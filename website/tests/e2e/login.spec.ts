import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('logs in and sees dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'TestPassword123');
    await page.click('button:has-text("Login")');
    await expect(page.locator('h1, h2')).toContainText('Dashboard');
  });
}); 