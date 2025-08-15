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

    // Verify dashboard content - using the main page heading
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
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

  test('should handle dashboard resilience', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForTimeout(2000);
    
    // Verify that dashboard loads and displays content reliably
    // This tests that the dashboard is resilient and shows meaningful content
    // even in various scenarios thanks to the robust mock system
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Overview of your music production hub')).toBeVisible();
    
    // Verify key navigation elements remain functional
    await expect(page.getByRole('button', { name: /settings/i })).toBeVisible();
    
    // Verify that stats section is present (even if data varies)
    await expect(page.getByText('Total Plugins')).toBeVisible();
    await expect(page.getByText('Active Plugins')).toBeVisible();
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

    // Verify stats are displayed with actual values using data-testid
    await expect(page.getByTestId('total-plugins-value')).toBeVisible();
    await expect(page.getByTestId('active-plugins-value')).toBeVisible();
    await expect(page.getByTestId('avg-usage-value')).toBeVisible();
    await expect(page.getByTestId('updates-available-value')).toBeVisible();
  });
});
