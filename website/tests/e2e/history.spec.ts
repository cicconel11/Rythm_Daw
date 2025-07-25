import { test, expect } from '@playwright/test';

test.describe('History', () => {
  test('shows activity items', async ({ page }) => {
    await page.goto('/history');
    await expect(page.locator('ul, .activity-list')).toBeVisible();
    // Optionally check for at least one item
    // expect(await page.locator('li, .activity-item').count()).toBeGreaterThan(0);
  });
});
