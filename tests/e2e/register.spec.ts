import { test, expect } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

// Mock data
const TEST_EMAIL = `test-${uuidv4()}@example.com`;
const TEST_PASSWORD = 'SecurePass123!';
const TEST_DISPLAY_NAME = 'Test User';

// Test suite for the registration flow
test.describe('User Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear session storage before each test
    await page.goto('/');
    await page.evaluate(() => window.sessionStorage.clear());
  });

  test('should complete the registration flow successfully', async ({ page }) => {
    // Step 1: Navigate to registration page
    await page.goto('/register/email');
    await expect(page).toHaveURL(/\/register\/email$/);
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();

    // Step 2: Submit email
    await page.getByLabel('Email address').fill(TEST_EMAIL);
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Verify navigation to verification page
    await expect(page).toHaveURL(/\/register\/verify$/);
    await expect(page.getByText(`We've sent a 6-digit code to ${TEST_EMAIL}`)).toBeVisible();
    
    // Step 3: Get the verification code from the mock
    const verificationCode = await page.evaluate(() => {
      // In a real test, you would get this from your test email service or mock
      return '123456'; // Mocked for this example
    });
    
    // Step 4: Submit verification code
    await page.getByLabel('Verification code').fill(verificationCode);
    
    // The form should auto-submit when 6 digits are entered
    await page.waitForURL(/\/register\/profile$/);
    
    // Step 5: Fill out profile information
    await page.getByLabel('Display Name').fill(TEST_DISPLAY_NAME);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm Password').fill(TEST_PASSWORD);
    
    // Optional: Test password strength indicator
    const passwordStrength = page.locator('.password-strength-meter');
    await expect(passwordStrength).toBeVisible();
    
    // Submit the form
    await page.getByRole('button', { name: 'Create Account' }).click();
    
    // Step 6: Verify success page and auto-redirect
    await expect(page).toHaveURL(/\/register\/success$/);
    await expect(page.getByRole('heading', { name: `Welcome, ${TEST_DISPLAY_NAME}!` })).toBeVisible();
    
    // Wait for auto-redirect to login page
    await page.waitForURL(/\/login\?registered=true$/);
    
    // Verify success message on login page
    await expect(page.getByText('Registration successful! Please log in.')).toBeVisible();
  });

  test('should handle email already registered', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register/email');
    
    // Submit an email that already exists
    await page.getByLabel('Email address').fill('existing@example.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Verify error message
    await expect(page.getByText('An account with this email already exists')).toBeVisible();
    
    // Verify link to login page
    const loginLink = page.getByRole('link', { name: 'log in' });
    await expect(loginLink).toBeVisible();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('should handle invalid verification code', async ({ page }) => {
    // Navigate to verification page directly with mock data
    await page.goto('/register/verify');
    
    // Mock the session storage to simulate coming from email submission
    await page.evaluate((email) => {
      window.sessionStorage.setItem('registration_state', JSON.stringify({
        email,
        requestId: 'test-request-id',
      }));
    }, TEST_EMAIL);
    
    // Refresh to load the mocked state
    await page.reload();
    
    // Submit an invalid code
    await page.getByLabel('Verification code').fill('000000');
    
    // Verify error message
    await expect(page.getByText('Invalid or expired code')).toBeVisible();
    
    // Test resend code functionality
    const resendButton = page.getByRole('button', { name: /Resend code/ });
    await expect(resendButton).toBeDisabled();
    
    // Wait for resend to be available (in a real test, you might mock the timer)
    await page.waitForTimeout(30000);
    
    // Click resend
    await resendButton.click();
    await expect(page.getByText('Code resent successfully')).toBeVisible();
  });

  test('should persist state across page refreshes', async ({ page }) => {
    // Start registration
    await page.goto('/register/email');
    await page.getByLabel('Email address').fill(TEST_EMAIL);
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Verify we're on the verification page
    await expect(page).toHaveURL(/\/register\/verify$/);
    
    // Refresh the page
    await page.reload();
    
    // Verify we're still on the verification page with the email pre-filled
    await expect(page).toHaveURL(/\/register\/verify$/);
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();
    
    // Go back to email entry
    await page.getByRole('link', { name: 'Go back' }).click();
    
    // Verify we're back on the email page with the email pre-filled
    await expect(page).toHaveURL(/\/register\/email$/);
    await expect(page.getByLabel('Email address')).toHaveValue(TEST_EMAIL);
  });

  test('should validate form inputs', async ({ page }) => {
    // Test email validation
    await page.goto('/register/email');
    await page.getByLabel('Email address').fill('invalid-email');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    
    // Test empty email
    await page.getByLabel('Email address').fill('');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Email is required')).toBeVisible();
    
    // Submit valid email to proceed to verification
    await page.getByLabel('Email address').fill(TEST_EMAIL);
    await page.getByRole('button', { name: 'Continue' }).click();
    
    // Test verification code validation
    await page.getByLabel('Verification code').fill('123');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Code must be exactly 6 digits')).toBeVisible();
    
    // Submit valid code to proceed to profile
    await page.getByLabel('Verification code').fill('123456');
    
    // Test profile validation
    await page.getByLabel('Password', { exact: true }).fill('weak');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Password is too weak')).toBeVisible();
    
    // Test password mismatch
    await page.getByLabel('Password', { exact: true }).fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('DifferentPass123!');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
});
