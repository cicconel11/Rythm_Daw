import { test, expect } from '@playwright/test';

test.describe('File Share E2E', () => {
  test('User A uploads file to B, B accepts and downloads', async ({ page, context }) => {
    test.setTimeout(60000);

    // Login as User A
    await page.goto('/auth/login');
    await page.fill('#email', 'userA@example.com');
    await page.fill('#password', 'password');
    await page.click('button[type=submit]');
    await expect(page.locator('#dashboard')).toBeVisible();

    // Navigate to files and upload
    await page.goto('/files');
    // Simulate file upload to User B (assume UI elements)
    await page.click('#upload-button');
    await page.fill('#toUser', 'userB@example.com');
    await page.setInputFiles('#file-input', { name: 'test.mp3', mimeType: 'audio/mpeg', buffer: Buffer.from('test data') });
    await page.click('#submit-upload');
    await expect(page.locator('#upload-status')).toHaveText('Uploaded');

    // Switch to User B
    const pageB = await context.newPage();
    await pageB.goto('/auth/login');
    await pageB.fill('#email', 'userB@example.com');
    await pageB.fill('#password', 'password');
    await pageB.click('button[type=submit]');
    await expect(pageB.locator('#dashboard')).toBeVisible();

    // Check incoming transfer
    await pageB.goto('/files');
    await expect(pageB.locator('#incoming-list')).toContainText('test.mp3');

    // Accept transfer
    await pageB.click('#accept-button');
    await expect(pageB.locator('#status')).toHaveText('Accepted');

    // Download
    const [download] = await Promise.all([
      pageB.waitForEvent('download'),
      pageB.click('#download-button'),
    ]);
    expect(download.suggestedFilename()).toBe('test.mp3');
  });
}); 