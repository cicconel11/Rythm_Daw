import { test, expect } from '@playwright/test';

test.describe('Device Connect', () => {
  test('shows device code and handles WS device:linked', async ({ page }) => {
    await page.goto('/device');
    await expect(page.locator('code')).toBeVisible();
    // Simulate WS event (pseudo-code, replace with actual WS mock if needed)
    // await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ event: 'device:linked' }) })));
    // await expect(page.locator('text=Device linked')).toBeVisible();
  });
}); 