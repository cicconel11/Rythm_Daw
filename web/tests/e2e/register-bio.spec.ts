import { test, expect } from '@playwright/test';
import { selectors, testData } from './selectors';

test.describe('Register - Bio Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Navigate to the bio registration page before each test
    await page.goto('/register/bio');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Register | Rythm/);
  });

  test('should display welcome message with user name', async ({ page }) => {
    // Check for welcome message
    await expect(page.getByText(/welcome/i)).toBeVisible();
    await expect(page.getByText(testData.user.displayName)).toBeVisible();
  });

  test('should display bio form field', async ({ page }) => {
    // Check bio field
    const bioInput = page.locator(selectors.register.bioInput);
    await expect(bioInput).toBeVisible();
    await expect(bioInput).toHaveAttribute('required', '');
    await expect(bioInput).toHaveAttribute('maxlength', '140');
  });

  test('should show character count', async ({ page }) => {
    const bioInput = page.locator(selectors.register.bioInput);

    // Check initial character count
    await expect(page.getByText(/0\/140/i)).toBeVisible();

    // Type some text and check character count updates
    await bioInput.fill('Hello world');
    await expect(page.getByText(/11\/140/i)).toBeVisible();
  });

  test('should show validation for empty bio', async ({ page }) => {
    // Submit the form without filling bio
    await page.locator(selectors.register.submitBtn).click();

    // Check for validation error
    await expect(page.getByText(/bio is required/i)).toBeVisible();
  });

  test('should show validation for bio that is too long', async ({ page }) => {
    const bioInput = page.locator(selectors.register.bioInput);

    // Fill bio with more than 140 characters
    const longBio = 'A'.repeat(141);
    await bioInput.fill(longBio);

    // Check for validation error
    await expect(page.getByText(/bio is too long/i)).toBeVisible();
  });

  test('should successfully submit with valid bio and navigate to dashboard', async ({ page }) => {
    // Fill in the bio with valid data
    await page.locator(selectors.register.bioInput).fill(testData.user.bio);

    // Submit the form
    await page.locator(selectors.register.submitBtn).click();

    // Verify navigation to dashboard
    await page.waitForURL(/\/$/);
    await expect(page).toHaveURL(/\/$/);

    // Verify user is now authenticated (check for dashboard elements)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should have a back button to return to credentials', async ({ page }) => {
    // Check for back button
    const backBtn = page.getByRole('button', { name: /back/i });
    await expect(backBtn).toBeVisible();

    // Click back and verify navigation
    await backBtn.click();
    await expect(page).toHaveURL(/\/register\/credentials/);
  });

  test('should preserve form data when navigating back and forth', async ({ page }) => {
    // Fill bio
    await page.locator(selectors.register.bioInput).fill(testData.user.bio);

    // Navigate back
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL(/\/register\/credentials/);

    // Navigate forward again
    await page.locator(selectors.register.nextBtn).click();
    await expect(page).toHaveURL(/\/register\/bio/);

    // Verify bio is still filled
    const bioInput = page.locator(selectors.register.bioInput);
    await expect(bioInput).toHaveValue(testData.user.bio);
  });

  test('should show loading state during form submission', async ({ page }) => {
    // Fill bio
    await page.locator(selectors.register.bioInput).fill(testData.user.bio);

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

    // Submit form
    await page.locator(selectors.register.submitBtn).click();

    // Verify loading state
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.locator(selectors.register.submitBtn)).toBeDisabled();

    // Wait for completion
    await expect(page).toHaveURL(/\/$/);
  });
});
