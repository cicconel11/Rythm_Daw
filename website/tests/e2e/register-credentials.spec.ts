import { test, expect } from '@playwright/test';

test.describe('Register Credentials', () => {
  test('fills credentials and navigates to bio', async ({ page }) => {
    await page.goto('/register/credentials');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'TestPassword123');
    await page.fill('input[name="displayName"]', 'Test User');
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL(/register\/bio/);
  });
}); 