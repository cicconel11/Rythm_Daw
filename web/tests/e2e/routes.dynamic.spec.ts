import { test, expect } from '@playwright/test';

test.describe('Routes Dynamic Tests', () => {
  test.describe.configure({ retries: 2 });

  test('should display correct page content for files route', async ({ page }) => {
    // Set up authentication cookies
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

    // Navigate to files page
    await page.goto('/files');
    await page.waitForLoadState('networkidle');

    // Verify page content instead of title
    await expect(page.getByText(/File Share/)).toBeVisible();
  });

  test('should handle 404 routes dynamically', async ({ page }) => {
    // Navigate to a non-existent route
    await page.goto('/non-existent-route');
    await page.waitForLoadState('networkidle');

    // Verify 404 page content
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should maintain route consistency across navigation', async ({ page }) => {
    // Set up authentication cookies
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

    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Verify dashboard content
    await expect(page.getByText(/Dashboard/)).toBeVisible();

    // Navigate to files page
    await page.goto('/files');
    await page.waitForLoadState('networkidle');

    // Verify files content
    await expect(page.getByText(/File Share/)).toBeVisible();

    // Navigate to friends page
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Verify friends content
    await expect(page.getByText(/Friends/)).toBeVisible();
  });

  test('should handle dynamic route parameters', async ({ page }) => {
    // Set up authentication cookies
    await page.context().addCookies([
      {
        name: 'registration_completed',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);

    // Test registration routes
    await page.goto('/register/credentials');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Register/)).toBeVisible();

    await page.goto('/register/bio');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Complete Profile/)).toBeVisible();
  });

  test('should handle protected routes with authentication', async ({ page }) => {
    // Clear cookies to test unauthenticated access
    await page.context().clearCookies();

    // Try to access protected route
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to registration
    await expect(page).toHaveURL(/\/register/);
  });

  test('should handle public routes without authentication', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();

    // Test public routes
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Download RHYTHM Plugin/)).toBeVisible();

    await page.goto('/device');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Connect Your Device/)).toBeVisible();
  });
});
