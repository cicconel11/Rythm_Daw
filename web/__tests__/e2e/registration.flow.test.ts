import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage before each test
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.clear());
  });

  test('should allow a user to register with valid credentials', async ({ page }) => {
    // Navigate to the signup page
    await page.goto('/signup');
    
    // Fill in the registration form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    
    // Mock the reCAPTCHA response
    await page.evaluate(() => {
      window['grecaptcha'] = {
        execute: () => Promise.resolve('test-token'),
        ready: (cb: () => void) => cb(),
      };
    });

    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for the profile form to appear
    await page.waitForSelector('input[name="displayName"]');
    
    // Fill in the profile form
    await page.fill('input[name="displayName"]', 'Test User');
    
    // Mock the API response for profile submission
    await page.route('**/api/auth/register', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, userId: '123' })
      });
    });
    
    // Submit the profile form
    await page.click('button[type="submit"]');
    
    // Verify redirection to dashboard on successful registration
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill in with invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify validation error is shown
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill in with mismatched passwords
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Different123!');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify password mismatch error is shown
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should show error for existing email', async ({ page }) => {
    await page.goto('/signup');
    
    // Mock the API response for existing email
    await page.route('**/api/auth/register/validate', route => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: false, 
          message: 'Email already in use' 
        })
      });
    });
    
    // Fill in the form
    await page.fill('input[name="email"]', 'existing@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    
    // Mock reCAPTCHA
    await page.evaluate(() => {
      window['grecaptcha'] = {
        execute: () => Promise.resolve('test-token'),
        ready: (cb: () => void) => cb(),
      };
    });
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify error message is shown
    await expect(page.getByText('Email already in use')).toBeVisible();
  });
});
