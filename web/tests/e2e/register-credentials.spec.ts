import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

// Test data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'Test123!',
  confirmPassword: 'Test123!',
};

// Configure storage state for this file
test.use({ storageState: 'tests/state.json' });

// Helper function to wait for toast with retry logic
async function waitForToast(page, expectedText, timeout = 5000) {
  const startTime = Date.now();
  let lastError;

  while (Date.now() - startTime < timeout) {
    try {
      // Try multiple selectors that might match the toast
      const selectors = [
        `//*[contains(@class, 'toast')][contains(., '${expectedText}')]`, // General toast class
        `//*[@role='alert'][contains(., '${expectedText}')]`, // Alert role
        `//*[contains(@class, 'Toast_root')][contains(., '${expectedText}')]`, // Specific toast class
        `//*[contains(@class, 'ToastViewport')]//*[contains(., '${expectedText}')]` // Inside toast viewport
      ];

      for (const selector of selectors) {
        const toast = page.locator(selector);
        const isVisible = await toast.isVisible().catch(() => false);
        if (isVisible) {
          return toast;
        }
      }
      
      // If not found, wait a bit and retry
      await page.waitForTimeout(200);
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(200);
    }
  }

  // If we get here, the toast wasn't found
  console.error('Toast not found with text:', expectedText);
  console.error('Page content:', await page.content());
  throw lastError || new Error(`Toast with text "${expectedText}" not found within ${timeout}ms`);
}

test.describe('Register - Credentials Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/auth/register', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, token: 'test-token' }),
      });
    });

    // Navigate to register credentials page
    await page.goto('/register/credentials');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    // Check for the main heading
    await expect(page.getByRole('heading', { name: 'Create your account', level: 2 })).toBeVisible();
    
    // Check for the login link
    await expect(page.getByRole('link', { name: 'sign in to your existing account' })).toBeVisible();
  });

  test('should display registration form', async ({ page }) => {
    // Check for form elements
    await expect(page.locator(selectors.register.emailInput)).toBeVisible();
    await expect(page.locator(selectors.register.passwordInput)).toBeVisible();
    await expect(page.locator(selectors.register.confirmPasswordInput)).toBeVisible();
    await expect(page.locator(selectors.register.submitBtn)).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.locator(selectors.register.submitBtn).click();

    // Verify validation errors - these are browser-native validation messages
    await expect(page.locator('#email:invalid')).toHaveCount(1);
    await expect(page.locator('#password:invalid')).toHaveCount(1);
  });

  test('should validate email format', async ({ page }) => {
    // Fill invalid email
    await page.locator(selectors.register.emailInput).fill('invalid-email');
    await page.locator(selectors.register.passwordInput).fill(testUser.password);
    await page.locator(selectors.register.confirmPasswordInput).fill(testUser.confirmPassword);
    await page.locator(selectors.register.submitBtn).click();

    // Verify validation error - using browser's native validation
    await expect(page.locator('#email:invalid')).toHaveCount(1);
  });

  test('should validate password match', async ({ page }) => {
    test.slow(); // Give this test more time
    
    // Fill mismatched passwords
    await page.locator(selectors.register.emailInput).fill(testUser.email);
    await page.locator(selectors.register.passwordInput).fill('Test123!');
    await page.locator(selectors.register.confirmPasswordInput).fill('Different123!');
    
    // Take a screenshot before submitting
    await page.screenshot({ path: 'before-submit.png' });
    
    // Submit form
    const submitButton = page.locator(selectors.register.submitBtn);
    await submitButton.click();
    
    // Wait for any network activity to complete
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot after submitting
    await page.screenshot({ path: 'after-submit.png' });
    
    // Log the page content for debugging
    console.log('Page content after submit:', await page.content());
    
    // Wait for the toast to appear with a longer timeout
    const toast = page.locator('[data-sonner-toast]').filter({ hasText: /passwords? do not match/i });
    await expect(toast).toBeVisible({ timeout: 10000 });
    
    // Check the toast content
    await expect(toast).toContainText('Passwords do not match');
  });

  test('should validate password strength', async ({ page }) => {
    test.slow(); // Give this test more time
    
    // Fill weak password
    await page.locator(selectors.register.emailInput).fill(testUser.email);
    await page.locator(selectors.register.passwordInput).fill('weak');
    await page.locator(selectors.register.confirmPasswordInput).fill('weak');
    
    // Take a screenshot before submitting
    await page.screenshot({ path: 'before-password-strength-submit.png' });
    
    // Submit form
    const submitButton = page.locator(selectors.register.submitBtn);
    await submitButton.click();
    
    // Wait for any network activity to complete
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot after submitting
    await page.screenshot({ path: 'after-password-strength-submit.png' });
    
    // Log the page content for debugging
    console.log('Page content after password strength submit:', await page.content());
    
    // Wait for the toast to appear with a longer timeout
    const toast = page.locator('[data-sonner-toast]').filter({ hasText: /password must be at least 8 characters/i });
    await expect(toast).toBeVisible({ timeout: 10000 });
    
    // Check the toast content
    await expect(toast).toContainText('Password must be at least 8 characters long');
  });

  test('should successfully submit with valid credentials and redirect to login', async ({ page }) => {
    // Mock successful registration
    await page.route('**/api/auth/register', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
    
    // Fill form with valid data
    await page.locator(selectors.register.emailInput).fill(testUser.email);
    await page.locator(selectors.register.passwordInput).fill(testUser.password);
    await page.locator(selectors.register.confirmPasswordInput).fill(testUser.confirmPassword);
    
    // Submit form
    await page.locator(selectors.register.submitBtn).click();
    
    try {
      // Check for success message (might be a toast or on the page)
      await expect(
        page.getByText(/account created successfully/i)
      ).toBeVisible({
        timeout: 5000,
      });
    } catch (e) {
      // If no success message, check if we were redirected to login
      await page.waitForURL('**/auth/login', { timeout: 5000 });
      expect(page.url()).toContain('/auth/login');
      return;
    }
    
    // If we got a success message, wait for redirect to login
    await page.waitForURL('**/auth/login', { timeout: 5000 });
    expect(page.url()).toContain('/auth/login');
  });

  test('should show loading state during submission', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/auth/register', route => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ success: true }),
            })
          );
        }, 2000);
      });
    });
    
    // Fill form
    await page.locator(selectors.register.emailInput).fill(testUser.email);
    await page.locator(selectors.register.passwordInput).fill(testUser.password);
    await page.locator(selectors.register.confirmPasswordInput).fill(testUser.confirmPassword);
    
    // Submit and verify loading state
    await page.locator(selectors.register.submitBtn).click();
    await expect(page.locator('button:has-text("Creating account...")')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    test.slow(); // Give this test more time
    
    // Mock API error
    const errorMessage = 'Email already in use';
    await page.route('**/api/auth/register', route => {
      return route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: errorMessage,
        }),
      });
    });
    
    // Fill form with existing email
    await page.locator(selectors.register.emailInput).fill('existing@example.com');
    await page.locator(selectors.register.passwordInput).fill(testUser.password);
    await page.locator(selectors.register.confirmPasswordInput).fill(testUser.password);
    
    // Submit form
    const submitButton = page.locator(selectors.register.submitBtn);
    await submitButton.click();
    
    // Wait for the error toast with a longer timeout
    const toast = page.locator('[data-sonner-toast]').filter({ hasText: errorMessage });
    await expect(toast).toBeVisible({ timeout: 10000 });
    
    // Check the toast content
    await expect(toast).toContainText(errorMessage);
    
    // Wait for the loading state to finish
    await expect(submitButton).not.toBeDisabled();
  });

  test('should navigate to login page', async ({ page }) => {
    // Click login link
    await page.locator(selectors.register.loginLink).click();
    
    // Verify navigation to login page
    await page.waitForURL('**/auth/login');
    expect(page.url()).toContain('/auth/login');
  });

  test('should preserve form data on validation errors', async ({ page }) => {
    // Fill form partially
    const testEmail = `test-${Date.now() + 1}@example.com`;
    await page.locator(selectors.register.emailInput).fill(testEmail);
    await page.locator(selectors.register.passwordInput).fill(testUser.password);
    
    // Submit with missing confirm password
    await page.locator(selectors.register.submitBtn).click();
    
    // Verify email and password are preserved
    await expect(page.locator(selectors.register.emailInput)).toHaveValue(testEmail);
    await expect(page.locator(selectors.register.passwordInput)).toHaveValue(testUser.password);
  });
});
