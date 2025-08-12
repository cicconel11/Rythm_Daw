import { test, expect } from '@playwright/test';

test.describe('Dashboard Dynamic Tests', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Set up authentication cookies before navigation
    await page.context().addCookies([
      {
        name: 'registration_completed',
        value: 'true',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'registration_step1',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);

    // Mock authentication state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ 
        user: { id: '1', name: 'Test User' },
        isAuthenticated: true 
      }));
    });

    // Navigate to dashboard page
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display dashboard with stats cards', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForTimeout(2000);

    // Verify dashboard content - using actual text from the page
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Total Plugins')).toBeVisible();
    await expect(page.getByText('Active Plugins')).toBeVisible();
    await expect(page.getByText('Avg Usage')).toBeVisible();
    await expect(page.getByText('Updates Available')).toBeVisible();
  });

  test('should show loading state during data fetch', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/dashboard', route => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              plugins: {
                total: 6,
                active: 5,
                avgUsage: 74,
                updatesAvailable: 3,
              },
              recentActivity: [],
              installedPlugins: []
            }),
          });
          resolve();
        }, 2000);
      });
    });

    // Reload to trigger loading
    await page.reload();

    // Verify loading state - look for skeleton elements
    await expect(page.locator('.animate-spin')).toBeVisible();

    // Wait for content to load
    await expect(page.getByText('Total Plugins')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/dashboard', route => {
      return route.fulfill({
        status: 500,
        body: 'Internal Server Error',
      });
    });

    // Reload to trigger error
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Verify error state
    await expect(page.getByText(/Failed to load dashboard data/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Retry/ })).toBeVisible();
  });

  test('should display recent activity section', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForTimeout(2000);

    // Verify activity section
    await expect(page.getByText('Recent Activity')).toBeVisible();
  });

  test('should show welcome message with user info', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForTimeout(2000);

    // Verify welcome message
    await expect(page.getByText('Overview of your music production hub')).toBeVisible();
  });

  test('should display stats with dynamic values', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForTimeout(2000);

    // Verify stats are displayed with actual values
    await expect(page.getByText('6')).toBeVisible(); // Total plugins
    await expect(page.getByText('5')).toBeVisible(); // Active plugins
    await expect(page.getByText('74%')).toBeVisible(); // Avg usage
    await expect(page.getByText('3')).toBeVisible(); // Updates available
  });
});
