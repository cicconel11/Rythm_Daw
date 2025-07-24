import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Share', () => {
  test('loads transfers, uploads, and drag-to-desktop', async ({ page, context }) => {
    await page.goto('/files');
    await expect(page.locator('table, .file-list')).toBeVisible();
    // Upload
    const filePath = '/Users/louisciccone/Desktop/Rythm_Daw/145BPMWubbyChords.wav';
    await page.setInputFiles('input[type="file"]', filePath);
    await expect(page.locator('text=145BPMWubbyChords.wav')).toBeVisible();
    // Drag-to-desktop
    const fileItem = page.locator('.file-item').first();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      fileItem.dispatchEvent('dragstart'),
    ]);
    expect(download.suggestedFilename()).toBe('145BPMWubbyChords.wav');
  });
}); 