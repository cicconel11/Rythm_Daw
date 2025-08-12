import { test, expect } from '@playwright/test';

test.describe('Auth Dynamic Tests', () => {
  test.describe.configure({ retries: 2 });

  test('should redirect to scan when registration not completed', async ({ page }) => {
    // Clear cookies to simulate no registration
    await page.context().clearCookies();

    // Try to access dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to scan page
    await expect(page).toHaveURL('/scan');
  });

  test('should redirect to dashboard when registration completed', async ({ page }) => {
    // Set registration completed cookie
    await page.context().addCookies([
      {
        name: 'registration_completed',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);

    // Try to access dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should stay on dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should allow access to bio page with step1 completed', async ({ page }) => {
    // Set step1 completed but not full registration
    await page.context().addCookies([
      {
        name: 'registration_step1',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);

    // Try to access bio page
    await page.goto('/register/bio');
    await page.waitForLoadState('networkidle');

    // Should be able to access bio page
    await expect(page.getByText(/Complete Profile/)).toBeVisible();
  });

  test('should redirect to credentials when step1 not completed', async ({ page }) => {
    // Clear all cookies
    await page.context().clearCookies();

    // Try to access bio page
    await page.goto('/register/bio');
    await page.waitForLoadState('networkidle');

    // Should redirect to credentials page
    await expect(page).toHaveURL('/register/credentials');
  });

  test('should handle registration flow with environment flags', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();

    // Start registration flow
    await page.goto('/register/credentials');
    await page.waitForLoadState('networkidle');

    // Fill credentials
    await page.getByPlaceholder('Enter your email').fill('test@example.com');
    await page.getByPlaceholder('Enter your password').fill('password123!');
    await page.getByPlaceholder('Confirm your password').fill('password123!');
    
    // Submit credentials
    await page.getByRole('button', { name: /Continue to profile/ }).click();
    await page.waitForLoadState('networkidle');

    // Should be on bio page
    await expect(page.getByText(/Complete Profile/)).toBeVisible();
  });

  test('should show dynamic content based on registration state', async ({ page }) => {
    // Test without registration
    await page.context().clearCookies();
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Download RHYTHM Plugin/)).toBeVisible();

    // Test with registration
    await page.context().addCookies([
      {
        name: 'registration_completed',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Dashboard/)).toBeVisible();
  });

  test('should handle login redirects dynamically', async ({ page }) => {
    // Clear cookies
    await page.context().clearCookies();

    // Try to access protected route
    await page.goto('/files');
    await page.waitForLoadState('networkidle');

    // Should redirect to registration
    await expect(page).toHaveURL(/\/register/);
  });

  test('should allow access to protected routes when authenticated', async ({ page }) => {
    // Set authentication cookies
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

    // Try to access protected routes
    await page.goto('/files');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/File Share/)).toBeVisible();

    await page.goto('/friends');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Friends/)).toBeVisible();
  });
});
