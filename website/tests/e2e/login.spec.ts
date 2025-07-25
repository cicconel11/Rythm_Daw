import { test, expect } from '@playwright/test';

// Test data
const validUser = {
  email: process.env.TEST_USER_EMAIL || 'testuser@example.com', // Should be a test user that exists in your test database
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!', // Use environment variables for sensitive data
};

const invalidUser = {
  email: 'nonexistent@example.com',
  password: 'wrongpassword',
};

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Login | Rythm/);
  });

  test('should display all required form fields', async ({ page }) => {
    // Check email field
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required', '');

    // Check password field
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('required', '');

    // Check remember me checkbox
    const rememberMe = page.getByLabel(/remember me/i);
    await expect(rememberMe).toBeVisible();
    await expect(rememberMe).not.toBeChecked();

    // Check login button
    const loginButton = page.getByRole('button', { name: /log in/i });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Submit the form without filling any fields
    await page.getByRole('button', { name: /log in/i }).click();

    // Check for validation error messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should show validation for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('anypassword');
    await page.getByRole('button', { name: /log in/i }).click();

    // Check for email validation error
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Attempt to log in with invalid credentials
    await page.getByLabel(/email/i).fill(invalidUser.email);
    await page.getByLabel(/password/i).fill(invalidUser.password);
    await page.getByRole('button', { name: /log in/i }).click();

    // Check for authentication error message
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();

    // Should still be on the login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should have a link to the registration page', async ({ page }) => {
    // Check for registration link
    const registerLink = page.getByRole('link', { name: /create an account/i });
    await expect(registerLink).toBeVisible();

    // Click the link and verify navigation
    await registerLink.click();
    await expect(page).toHaveURL(/\/register\/credentials/);
  });

  test('should have a link to the forgot password page', async ({ page }) => {
    // Check for forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    await expect(forgotPasswordLink).toBeVisible();

    // Click the link and verify navigation
    await forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/auth\/forgot-password/);
  });

  // Note: The following test is commented out because it requires a valid test user
  // and proper test database setup with test data
  /*
  test('should successfully log in with valid credentials and redirect to dashboard', async ({ page }) => {
    // Fill in the form with valid credentials
    await page.getByLabel(/email/i).fill(validUser.email);
    await page.getByLabel(/password/i).fill(validUser.password);
    
    // Optionally check "Remember me"
    await page.getByLabel(/remember me/i).check();
    
    // Submit the form
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Should redirect to dashboard or home page
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
    
    // Verify user is logged in (this would depend on your app's UI)
    await expect(page.getByRole('button', { name: /profile/i })).toBeVisible();
    
    // Verify session persistence (if testing remember me functionality)
    // This would involve checking cookies or local storage
    // const cookies = await page.context().cookies();
    // const authCookie = cookies.find(c => c.name === 'your_auth_cookie_name');
    // expect(authCookie).toBeTruthy();
  });
  */
});
