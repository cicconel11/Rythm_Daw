import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('renders Lovable-UIKit LandingPage and navigates', async ({ page }) => {
    await page.goto('/landing');
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
    await page.click('button:has-text("Get Started")');
    await expect(page).toHaveURL(/register\/credentials/);
    await page.goBack();
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL(/auth\/login/);
  });
}); 