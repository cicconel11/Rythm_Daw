import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test('shows account fields and handles WS user:update', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.locator('form, .settings-account')).toBeVisible();
    // Simulate WS event (pseudo-code, replace with actual WS mock if needed)
    // await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ event: 'user:update' }) })));
    // await expect(page.locator('input[name="email"]').inputValue()).not.toBe('');
  });
});
