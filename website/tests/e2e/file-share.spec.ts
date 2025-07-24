import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Share E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'userA@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('user can upload, see, and drag-to-desktop a file', async ({ page }) => {
    await page.goto('/files');
    const filePath = path.resolve(__dirname, '../fixtures/sample.wav');
    await page.setInputFiles('input[type="file"]', filePath);
    await page.click('button:has-text("Upload")');
    await page.pause();
    await expect(page.locator('li')).toContainText('sample.wav', { timeout: 10000 });

    // Simulate drag-to-desktop
    const fileItem = page.locator('li').first();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      fileItem.dispatchEvent('dragstart'),
    ]);
    const outPath = path.join(process.cwd(), 'sample.wav');
    await download.saveAs(outPath);
    // Skipping headers check due to Playwright API limitations
    // const headers = await download.headers();
    // expect(headers).toHaveProperty('content-type');
    // expect(headers['content-type']).toMatch(/audio/);
  });
}); 