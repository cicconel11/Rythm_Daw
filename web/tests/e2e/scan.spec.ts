import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

// Configure storage state for this file
test.use({ storageState: 'tests/state.json' });

test.describe('Scan Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Navigate to scan page
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Scan | Rythm/);
  });

  test('should display download link with .zip extension', async ({ page }) => {
    // Check for download link
    const downloadLink = page.locator(selectors.scan.downloadLink);
    await expect(downloadLink).toBeVisible();

    // Verify it's a .zip file
    await expect(downloadLink).toHaveAttribute('href', /\.zip$/);
  });

  test('should trigger download when download link is clicked', async ({ page }) => {
    // Set up download event listener
    const downloadPromise = page.waitForEvent('download');

    // Click download link
    const downloadLink = page.locator(selectors.scan.downloadLink);
    await downloadLink.click();

    // Wait for download to start
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/\.zip$/);
    expect(download.suggestedFilename().length).toBeGreaterThan(0);
  });

  test('should show download progress', async ({ page }) => {
    // Mock slow download response
    await page.route('**/api/scan/download', route => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename="rythm-plugin.zip"',
            },
            body: 'test-zip-content',
          });
          resolve();
        }, 1000);
      });
    });

    // Click download link
    const downloadLink = page.locator(selectors.scan.downloadLink);
    await downloadLink.click();

    // Verify progress indicator
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.getByText(/downloading/i)).toBeVisible();
  });

  test('should handle download errors gracefully', async ({ page }) => {
    // Mock download error
    await page.route('**/api/scan/download', route => {
      return route.fulfill({
        status: 500,
        body: 'Download failed',
      });
    });

    // Click download link
    const downloadLink = page.locator(selectors.scan.downloadLink);
    await downloadLink.click();

    // Verify error message
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/download failed/i)).toBeVisible();
  });

  test('should show scan instructions', async ({ page }) => {
    // Check for instructions section
    await expect(page.getByText(/scan instructions/i)).toBeVisible();
    await expect(page.getByText(/how to scan/i)).toBeVisible();
  });

  test('should show supported formats', async ({ page }) => {
    // Check for supported formats section
    await expect(page.getByText(/supported formats/i)).toBeVisible();
    await expect(page.getByText(/wav/i)).toBeVisible();
    await expect(page.getByText(/mp3/i)).toBeVisible();
  });

  test('should show file size limits', async ({ page }) => {
    // Check for file size information
    await expect(page.getByText(/file size limit/i)).toBeVisible();
    await expect(page.getByText(/mb/i)).toBeVisible();
  });

  test('should show troubleshooting section', async ({ page }) => {
    // Check for troubleshooting section
    await expect(page.getByText(/troubleshooting/i)).toBeVisible();
    await expect(page.getByText(/common issues/i)).toBeVisible();
  });

  test('should handle multiple download attempts', async ({ page }) => {
    // Click download link multiple times
    const downloadLink = page.locator(selectors.scan.downloadLink);

    // First download
    const downloadPromise1 = page.waitForEvent('download');
    await downloadLink.click();
    const download1 = await downloadPromise1;
    expect(download1.suggestedFilename()).toMatch(/\.zip$/);

    // Second download
    const downloadPromise2 = page.waitForEvent('download');
    await downloadLink.click();
    const download2 = await downloadPromise2;
    expect(download2.suggestedFilename()).toMatch(/\.zip$/);
  });

  test('should show download history', async ({ page }) => {
    // Check for download history section
    await expect(page.getByText(/download history/i)).toBeVisible();

    // Verify history items (if any)
    const historyItems = page.locator('[data-testid="download-history-item"]');
    await expect(historyItems).toHaveCount(0); // Initially empty
  });

  test('should allow canceling download', async ({ page }) => {
    // Mock slow download
    await page.route('**/api/scan/download', route => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename="rythm-plugin.zip"',
            },
            body: 'test-zip-content',
          });
          resolve();
        }, 3000);
      });
    });

    // Start download
    const downloadLink = page.locator(selectors.scan.downloadLink);
    await downloadLink.click();

    // Verify download started
    await expect(page.getByText(/downloading/i)).toBeVisible();

    // Cancel download
    await page.getByRole('button', { name: /cancel/i }).click();

    // Verify download cancelled
    await expect(page.getByText(/download cancelled/i)).toBeVisible();
  });
});
