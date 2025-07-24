import { test, expect } from '@playwright/test';

test.describe('Plugin Download', () => {
  test('shows download link and verifies href', async ({ page }) => {
    await page.goto('/scan');
    const link = page.locator('a:has-text("Download")');
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/\.zip|\.dmg|\.exe/);
  });
}); 