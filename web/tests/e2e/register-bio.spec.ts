import { test, expect } from '@playwright/test';
import { selectors, testData } from './selectors';

test.describe('Register - Bio Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Navigate directly to the bio page without session storage setup
    await page.goto('/register/bio');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Debug: Check what's on the page
    console.log('Current URL:', await page.url());
    
    // Try to find any form elements
    const formElements = await page.locator('form input, form textarea, form button').count();
    console.log('Form elements found:', formElements);
    
    // Wait for the bio input to be visible
    try {
      await page.waitForSelector('#bio', { timeout: 5000 });
    } catch (error) {
      console.log('Bio input not found, checking page content...');
      const pageContent = await page.content();
      console.log('Page has content:', pageContent.length > 0);
      
      // Check if we're on the right page
      const title = await page.title();
      console.log('Page title:', title);
      
      throw error;
    }
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Register | Rythm/);
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
    await expect(page.getByText(/bio must be 140 characters or less/i)).toBeVisible();
  });

  test('should successfully submit with valid bio and navigate to dashboard', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/register/bio', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Profile completed successfully',
          user: {
            id: 'test-user-id',
            displayName: 'test',
            bio: testData.user.bio,
            email: 'test@example.com'
          }
        })
      });
    });

    // Fill in the bio with valid data
    await page.locator(selectors.register.bioInput).fill(testData.user.bio);

    // Submit the form
    await page.locator(selectors.register.submitBtn).click();

    // Check for success message
    await expect(page.getByText(/registration completed successfully/i)).toBeVisible();

    // Check navigation to success page
    await expect(page).toHaveURL(/.*registration-success/);
  });

  test('should show error for invalid bio submission', async ({ page }) => {
    // Mock the API to return an error
    await page.route('**/api/register/bio', route => {
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Bio is too short'
        })
      });
    });

    // Fill in a short bio
    await page.locator(selectors.register.bioInput).fill('Hi');

    // Submit the form
    await page.locator(selectors.register.submitBtn).click();

    // Check for error message
    await expect(page.getByText(/bio is too short/i)).toBeVisible();
  });

  test('should have back button that navigates to credentials page', async ({ page }) => {
    // Click the back button
    await page.locator(selectors.register.backBtn).click();

    // Check navigation to credentials page
    await expect(page).toHaveURL(/.*register\/credentials/);
  });

  test('should display display name field', async ({ page }) => {
    const displayNameInput = page.locator(selectors.register.displayNameInput);
    await expect(displayNameInput).toBeVisible();
    await expect(displayNameInput).toHaveAttribute('required', '');
  });

  test('should validate display name field', async ({ page }) => {
    const displayNameInput = page.locator(selectors.register.displayNameInput);
    
    // Try to submit with empty display name
    await page.locator(selectors.register.submitBtn).click();
    
    // Check for validation error
    await expect(page.getByText(/display name is required/i)).toBeVisible();
  });

  test('should show avatar URL field as optional', async ({ page }) => {
    const avatarInput = page.locator(selectors.register.avatarInput);
    await expect(avatarInput).toBeVisible();
    // Should not have required attribute
    await expect(avatarInput).not.toHaveAttribute('required', '');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/register/bio', route => {
      return route.abort();
    });

    // Fill in valid data
    await page.locator(selectors.register.displayNameInput).fill('Test User');
    await page.locator(selectors.register.bioInput).fill('Test bio');

    // Submit the form
    await page.locator(selectors.register.submitBtn).click();

    // Check for error message
    await expect(page.getByText(/an error occurred/i)).toBeVisible();
  });

  test('should clear session storage after successful submission', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/register/bio', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Profile completed successfully'
        })
      });
    });

    // Fill in valid data
    await page.locator(selectors.register.displayNameInput).fill('Test User');
    await page.locator(selectors.register.bioInput).fill('Test bio');

    // Submit the form
    await page.locator(selectors.register.submitBtn).click();

    // Wait for navigation
    await page.waitForURL(/.*registration-success/);

    // Check that session storage is cleared
    const sessionData = await page.evaluate(() => {
      return sessionStorage.getItem('registration_ctx_v1');
    });
    expect(sessionData).toBeNull();
  });
});
