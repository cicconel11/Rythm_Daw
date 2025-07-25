import { test, expect } from '@playwright/test';

test.describe('Chat', () => {
  test('loads threads, sends message, and sees it', async ({ page }) => {
    await page.goto('/chat');
    await expect(page.locator('aside, .chat-threads')).toBeVisible();
    await page.locator('aside ul li button').first().click();
    await page.fill('textarea', 'Hello World');
    await page.click('button:has-text("Send")');
    await expect(page.locator('text=Hello World')).toBeVisible();
  });
});
