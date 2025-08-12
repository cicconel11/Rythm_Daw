import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
  });

  test('should navigate from landing to login', async ({ page }) => {
    await page.goto('/landing');
    
    // Verify landing page content
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible();
    
    // Navigate to login
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  test('should handle login form validation', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Test empty form submission
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
    
    // Test invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should handle successful login', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Mock successful login
    await page.route('/api/auth/signin', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, user: { id: '1', name: 'Test User' } })
      });
    });
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to registration', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('link', { name: /create account/i }).click();
    await expect(page).toHaveURL('/register/credentials');
  });

  test('should handle registration form validation', async ({ page }) => {
    await page.goto('/register/credentials');
    
    // Test empty form submission
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
    
    // Test password strength
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('weak');
    await expect(page.getByText(/password is too weak/i)).toBeVisible();
  });

  test('should complete registration flow', async ({ page }) => {
    await page.goto('/register/credentials');
    
    // Fill registration form
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/password/i).fill('StrongPassword123!');
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Should navigate to bio page
    await expect(page).toHaveURL('/register/bio');
    
    // Fill bio form
    await page.getByLabel(/display name/i).fill('New User');
    await page.getByLabel(/bio/i).fill('Music producer');
    await page.getByRole('button', { name: /complete/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should handle logout', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ user: { id: '1', name: 'Test User' } }));
    });
    
    await page.goto('/dashboard');
    
    // Click logout button
    await page.getByTestId('btn-logout').click();
    
    // Should redirect to landing page
    await expect(page).toHaveURL('/landing');
  });
});
