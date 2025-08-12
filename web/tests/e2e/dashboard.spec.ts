import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ 
        user: { id: '1', name: 'Test User' },
        isAuthenticated: true 
      }));
    });
    
    // Mock API responses
    await page.route('/api/dashboard', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          plugins: {
            total: 6,
            active: 5,
            avgUsage: 74,
            updatesAvailable: 3
          },
          recentActivity: [
            { id: '1', action: 'Plugin Scan Completed', time: '2 minutes ago', type: 'system' },
            { id: '2', action: 'Added Serum to favorites', time: '15 minutes ago', type: 'user' }
          ],
          installedPlugins: [
            { id: 1, name: 'Serum', type: 'Synthesizer', version: '1.365', status: 'Active', usage: '87%' },
            { id: 2, name: 'FabFilter Pro-Q 3', type: 'EQ', version: '3.24', status: 'Active', usage: '92%' }
          ]
        })
      });
    });
    
    await page.goto('/dashboard');
  });

  test('should display dashboard metrics', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Verify metric cards
    await expect(page.getByText('Total Plugins')).toBeVisible();
    await expect(page.getByText('6')).toBeVisible();
    
    await expect(page.getByText('Active Plugins')).toBeVisible();
    await expect(page.getByText('5')).toBeVisible();
    
    await expect(page.getByText('Avg Usage')).toBeVisible();
    await expect(page.getByText('74%')).toBeVisible();
    
    await expect(page.getByText('Updates Available')).toBeVisible();
    await expect(page.getByText('3')).toBeVisible();
  });

  test('should display installed plugins grid', async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(page.getByText('Installed Plugins')).toBeVisible();
    
    // Verify plugin cards
    await expect(page.getByText('Serum')).toBeVisible();
    await expect(page.getByText('Synthesizer')).toBeVisible();
    await expect(page.getByText('87%')).toBeVisible();
    
    await expect(page.getByText('FabFilter Pro-Q 3')).toBeVisible();
    await expect(page.getByText('EQ')).toBeVisible();
    await expect(page.getByText('92%')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(page.getByText('Recent Activity')).toBeVisible();
    
    // Verify activity items
    await expect(page.getByText('Plugin Scan Completed')).toBeVisible();
    await expect(page.getByText('Added Serum to favorites')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Navigate to dashboard without mocking API
    await page.route('/api/dashboard', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/dashboard');
    
    // Should show skeletons while loading
    await expect(page.locator('.animate-spin')).toBeVisible();
  });

  test('should handle error states', async ({ page }) => {
    // Mock API error
    await page.route('/api/dashboard', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.goto('/dashboard');
    
    // Should show error state
    await expect(page.getByText(/Failed to load dashboard data/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Retry/ })).toBeVisible();
  });

  test('should navigate to settings from dashboard', async ({ page }) => {
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /settings/i }).click();
    await expect(page).toHaveURL('/settings');
  });

  test('should display dynamic user information', async ({ page }) => {
    // Mock user data
    await page.route('/api/user', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          username: 'djproducer',
          displayName: 'DJ Producer',
          status: 'online'
        })
      });
    });
    
    await page.waitForTimeout(2000);
    
    // Verify user info in sidebar
    await expect(page.getByText('Test User')).toBeVisible();
  });
});
