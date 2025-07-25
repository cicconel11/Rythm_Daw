import { test, expect } from '@playwright/test';

// Test data
const testUser = {
  email: `testuser+${Date.now()}@example.com`,
  password: 'TestPassword123!',
  displayName: 'Test User',
};

test.describe('Register - Credentials Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration page before each test
    await page.goto('/register/credentials');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Register | Rythm/);
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

    // Check display name field
    const displayNameInput = page.getByLabel(/display name/i);
    await expect(displayNameInput).toBeVisible();
    await expect(displayNameInput).toHaveAttribute('required', '');
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Submit the form without filling any fields
    await page.getByRole('button', { name: /next/i }).click();

    // Check for validation error messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
    await expect(page.getByText(/display name is required/i)).toBeVisible();
  });

  test('should show validation for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByRole('button', { name: /next/i }).click();

    // Check for email validation error
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test('should show validation for weak password', async ({ page }) => {
    // Enter weak password
    await page.getByLabel(/password/i).fill('weak');
    await page.getByRole('button', { name: /next/i }).click();

    // Check for password strength validation
    await expect(page.getByText(/password is too short/i)).toBeVisible();
  });

  test('should successfully submit with valid credentials and navigate to bio page', async ({
    page,
  }) => {
    // Fill in the form with valid data
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(testUser.password);
    await page.getByLabel(/display name/i).fill(testUser.displayName);

    // Submit the form
    await page.getByRole('button', { name: /next/i }).click();

    // Verify navigation to the bio page
    await page.waitForURL(/\/register\/bio/);
    await expect(page).toHaveURL(/\/register\/bio/);

    // Verify the form data is passed to the next step (check for display name in the next page)
    await expect(page.getByText(`Welcome, ${testUser.displayName}`)).toBeVisible();
  });

  test('should have a link to the login page', async ({ page }) => {
    // Check for login link
    const loginLink = page.getByRole('link', { name: /already have an account\? log in/i });
    await expect(loginLink).toBeVisible();

    // Click the link and verify navigation
    await loginLink.click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
