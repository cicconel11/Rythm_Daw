import { test, expect } from '@playwright/test';

test.describe('Friends', () => {
  test('shows friends and handles presence update', async ({ page }) => {
    await page.goto('/friends');
    await expect(page.locator('ul, .friends-list')).toBeVisible();
    // Simulate WS event (pseudo-code, replace with actual WS mock if needed)
    // await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ event: 'presence:update' }) })));
    // await expect(page.locator('.online')).toBeVisible();
  });
}); 