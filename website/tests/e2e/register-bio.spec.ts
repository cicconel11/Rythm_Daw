import { test, expect } from '@playwright/test';

// Test data
const testBio = 'This is a test bio that meets the minimum length requirement.';
const shortBio = 'Too short';
const longBio = 'a'.repeat(1001); // Assuming 1000 is the max length

// Helper function to navigate to the bio page with session storage
async function navigateToBioPage(page) {
  // Set session storage to simulate coming from the credentials page
  await page.goto('/register/bio');
  await page.waitForLoadState('networkidle');

  // If redirected to login/register, we need to handle that
  if (page.url().includes('/auth/')) {
    // This is a simplified version - in a real test, you'd want to set up proper authentication state
    await page.goto('/register/credentials');
    await page.waitForLoadState('networkidle');
    await page.goto('/register/bio');
  }
}

test.describe('Register - Bio Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToBioPage(page);
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Complete Your Profile | Rythm/);
  });

  test('should display all required elements', async ({ page }) => {
    // Check bio textarea
    const bioTextarea = page.getByLabel(/tell us about yourself/i);
    await expect(bioTextarea).toBeVisible();

    // Check character counter
    const charCounter = page.getByText(/characters remaining/i);
    await expect(charCounter).toBeVisible();

    // Check submit button
    const submitButton = page.getByRole('button', { name: /complete registration/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled(); // Should be disabled until bio is valid

    // Check back button
    const backButton = page.getByRole('link', { name: /back/i });
    await expect(backButton).toBeVisible();
  });

  test('should show validation for bio that is too short', async ({ page }) => {
    const bioTextarea = page.getByLabel(/tell us about yourself/i);

    // Enter a bio that's too short
    await bioTextarea.fill(shortBio);

    // Check for validation error
    await expect(page.getByText(/bio must be at least 30 characters/i)).toBeVisible();

    // Submit button should still be disabled
    const submitButton = page.getByRole('button', { name: /complete registration/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should show validation for bio that is too long', async ({ page }) => {
    const bioTextarea = page.getByLabel(/tell us about yourself/i);

    // Enter a bio that's too long
    await bioTextarea.fill(longBio);

    // Check for validation error
    await expect(page.getByText(/bio must be at most 1000 characters/i)).toBeVisible();

    // Submit button should be disabled
    const submitButton = page.getByRole('button', { name: /complete registration/i });
    await expect(submitButton).toBeDisabled();
  });

  test('should update character counter as user types', async ({ page }) => {
    const bioTextarea = page.getByLabel(/tell us about yourself/i);
    const charCounter = page.getByText(/characters remaining/i);

    // Check initial counter
    await expect(charCounter).toContainText('1000 characters remaining');

    // Type some text and check the counter updates
    await bioTextarea.fill('Hello');
    await expect(charCounter).toContainText('995 characters remaining');

    // Clear and check counter resets
    await bioTextarea.fill('');
    await expect(charCounter).toContainText('1000 characters remaining');
  });

  test('should enable submit button with valid bio', async ({ page }) => {
    const bioTextarea = page.getByLabel(/tell us about yourself/i);
    const submitButton = page.getByRole('button', { name: /complete registration/i });

    // Initially disabled
    await expect(submitButton).toBeDisabled();

    // Enter valid bio
    await bioTextarea.fill(testBio);

    // Should now be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should navigate back to credentials page when back button is clicked', async ({ page }) => {
    const backButton = page.getByRole('link', { name: /back/i });

    // Click back button
    await backButton.click();

    // Should navigate to the previous step
    await expect(page).toHaveURL(/\/register\/credentials/);
  });

  // Note: The following test is commented out because it requires proper authentication setup
  // which would typically be handled in a global setup or with test fixtures
  /*
  test('should successfully submit valid bio and redirect to dashboard', async ({ page }) => {
    const bioTextarea = page.getByLabel(/tell us about yourself/i);
    const submitButton = page.getByRole('button', { name: /complete registration/i });
    
    // Enter valid bio
    await bioTextarea.fill(testBio);
    
    // Submit the form
    await submitButton.click();
    
    // Should redirect to dashboard
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
    
    // Verify user is logged in (this would depend on your app's UI)
    await expect(page.getByRole('button', { name: /profile/i })).toBeVisible();
  });
  */
});
