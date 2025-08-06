import { test, expect } from '@playwright/test';
import { selectors, testData } from './selectors';

// Configure storage state for this file
test.use({ storageState: 'tests/state.json' });

test.describe('Register - Credentials Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/auth/register', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to register credentials page
    await page.goto('/register/credentials');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Register | Rythm/);
  });

  test('should display registration form', async ({ page }) => {
    // Check for form elements
    await expect(page.locator(selectors.register.emailInput)).toBeVisible();
    await expect(page.locator(selectors.register.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.register.displayNameInput)).toBeVisible();
    await expect(page.locator(selectors.register.nextBtn)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.locator(selectors.register.nextBtn).click();

    // Verify validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
    await expect(page.getByText(/display name is required/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Fill invalid email
    await page.locator(selectors.register.emailInput).fill('invalid-email');
    await page.locator(selectors.register.passwordInput).fill(testData.user.password);
    await page.locator(selectors.register.displayNameInput).fill(testData.user.displayName);
    await page.locator(selectors.register.nextBtn).click();

    // Verify email validation error
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    // Fill weak password
    await page.locator(selectors.register.emailInput).fill(testData.user.email);
    await page.locator(selectors.register.passwordInput).fill('weak');
    await page.locator(selectors.register.displayNameInput).fill(testData.user.displayName);
    await page.locator(selectors.register.nextBtn).click();

    // Verify password strength error
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible();
  });

  test('should successfully submit with valid credentials and navigate to bio page', async ({
    page,
  }) => {
    // Fill form with valid data
    await page.locator(selectors.register.emailInput).fill(testData.user.email);
    await page.locator(selectors.register.passwordInput).fill(testData.user.password);
    await page.locator(selectors.register.displayNameInput).fill(testData.user.displayName);
    await page.locator(selectors.register.nextBtn).click();

    // Verify navigation to bio page
    await page.waitForURL(/\/register\/bio/);
    await expect(page).toHaveURL(/\/register\/bio/);
    await expect(page.getByText(`Welcome, ${testData.user.displayName}`)).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/auth/register', route => {
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

    // Fill and submit form
    await page.locator(selectors.register.emailInput).fill(testData.user.email);
    await page.locator(selectors.register.passwordInput).fill(testData.user.password);
    await page.locator(selectors.register.displayNameInput).fill(testData.user.displayName);
    await page.locator(selectors.register.nextBtn).click();

    // Verify loading state
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.getByText(/creating account/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/auth/register', route => {
      return route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Email already exists' }),
      });
    });

    // Fill and submit form
    await page.locator(selectors.register.emailInput).fill(testData.user.email);
    await page.locator(selectors.register.passwordInput).fill(testData.user.password);
    await page.locator(selectors.register.displayNameInput).fill(testData.user.displayName);
    await page.locator(selectors.register.nextBtn).click();

    // Verify error message
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/email already exists/i)).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    // Click login link
    await page.locator(selectors.register.loginLink).click();

    // Verify navigation to login page
    await page.waitForURL(/\/auth\/login/);
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should preserve form data on validation errors', async ({ page }) => {
    // Fill form partially
    await page.locator(selectors.register.emailInput).fill(testData.user.email);
    await page.locator(selectors.register.passwordInput).fill(testData.user.password);
    await page.locator(selectors.register.nextBtn).click();

    // Verify form data is preserved
    await expect(page.locator(selectors.register.emailInput)).toHaveValue(testData.user.email);
    await expect(page.locator(selectors.register.passwordInput)).toHaveValue(
      testData.user.password
    );
  });
});
