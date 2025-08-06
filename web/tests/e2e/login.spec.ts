import { test, expect } from '@playwright/test';
import { selectors, testData } from './selectors';

test.describe('Login Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/auth/login');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Login | Rythm/);
  });

  test('should display all required form fields', async ({ page }) => {
    // Check email field
    const emailInput = page.locator(selectors.login.emailInput);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required', '');

    // Check password field
    const passwordInput = page.locator(selectors.login.passwordInput);
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('required', '');

    // Check login button
    const loginBtn = page.locator(selectors.login.loginBtn);
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Submit the form without filling any fields
    await page.locator(selectors.login.loginBtn).click();

    // Check for validation error messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.locator(selectors.login.emailInput).fill('invalid-email');
    await page.locator(selectors.login.loginBtn).click();

    // Check for email validation error
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test('should show error toast for invalid credentials', async ({ page }) => {
    // Mock API to return error for invalid credentials
    await page.route('**/api/auth/login', route => {
      return route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    // Fill in the form with invalid data
    await page.locator(selectors.login.emailInput).fill('invalid@example.com');
    await page.locator(selectors.login.passwordInput).fill('wrongpassword');
    await page.locator(selectors.login.loginBtn).click();

    // Check for error toast
    await expect(page.locator(selectors.common.toast)).toBeVisible();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should successfully login with valid credentials and redirect to dashboard', async ({
    page,
  }) => {
    // Mock API to return success for valid credentials
    await page.route('**/api/auth/login', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { id: '1', email: testData.user.email, displayName: testData.user.displayName },
        }),
      });
    });

    // Fill in the form with valid data
    await page.locator(selectors.login.emailInput).fill(testData.user.email);
    await page.locator(selectors.login.passwordInput).fill(testData.user.password);
    await page.locator(selectors.login.loginBtn).click();

    // Verify navigation to dashboard
    await page.waitForURL(/\/$/);
    await expect(page).toHaveURL(/\/$/);

    // Verify user is authenticated (check for dashboard elements)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should have a link to the register page', async ({ page }) => {
    // Check for register link
    const registerLink = page.locator(selectors.login.registerLink);
    await expect(registerLink).toBeVisible();

    // Click the link and verify navigation
    await registerLink.click();
    await expect(page).toHaveURL(/\/register\/credentials/);
  });

  test('should show loading state during login', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/auth/login', route => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true }),
          });
          resolve();
        }, 2000);
      });
    });

    // Fill form
    await page.locator(selectors.login.emailInput).fill(testData.user.email);
    await page.locator(selectors.login.passwordInput).fill(testData.user.password);
    await page.locator(selectors.login.loginBtn).click();

    // Verify loading state
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.locator(selectors.login.loginBtn)).toBeDisabled();

    // Wait for completion
    await expect(page).toHaveURL(/\/$/);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', route => {
      return route.abort();
    });

    // Fill form
    await page.locator(selectors.login.emailInput).fill(testData.user.email);
    await page.locator(selectors.login.passwordInput).fill(testData.user.password);
    await page.locator(selectors.login.loginBtn).click();

    // Verify error message
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/network error/i)).toBeVisible();
  });
});
