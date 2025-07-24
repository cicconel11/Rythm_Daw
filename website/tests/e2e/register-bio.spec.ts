import { test, expect } from '@playwright/test';

test.describe('Register Bio', () => {
  test('fills bio and submits to dashboard', async ({ page }) => {
    await page.goto('/register/bio');
    await page.fill('textarea[name="bio"]', 'This is my bio. '.repeat(10));
    await page.click('button:has-text("Submit")');
    await expect(page).toHaveURL('/');
  });
}); 