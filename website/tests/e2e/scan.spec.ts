import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Test configuration
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

// Ensure download directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

test.describe('Plugin Download & Scan', () => {
  // Use authenticated state
  test.use({ storageState: 'tests/state.json' });

  test.beforeEach(async ({ page }) => {
    // Clear download directory before each test
    const files = fs.readdirSync(DOWNLOAD_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(DOWNLOAD_DIR, file));
    }

    // Mock API responses
    await page.route('**/api/scans', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Project 1', date: new Date().toISOString() },
          { id: '2', name: 'Project 2', date: new Date().toISOString() },
        ]),
      });
    });

    // Navigate to scan page
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');
  });

  test('should display scan page with download section', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/Scan | Rythm/);
    await expect(page.getByRole('heading', { name: /scan & analyze/i })).toBeVisible();

    // Check download section
    const downloadSection = page.locator('section:has(h2:has-text("Download Plugin"))');
    await expect(downloadSection).toBeVisible();

    // Check platform selection
    const platformSelect = page.getByLabel('Select platform');
    await expect(platformSelect).toBeVisible();

    // Check download button
    const downloadButton = page.getByRole('button', { name: /download plugin/i });
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toBeEnabled();
  });

  test('should allow downloading the plugin', async ({ browser }) => {
    test.retry(2);

    // Set up browser context with download handling
    const context = await browser.newContext({
      acceptDownloads: true,
      downloadPath: DOWNLOAD_DIR,
    });

    const page = await context.newPage();
    await page.goto('/scan');

    // Mock the download response
    await page.route('**/api/plugin/download*', route => {
      return route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="rythm-plugin-v1.0.0.zip"',
        },
        body: Buffer.from('mock-plugin-content'),
      });
    });

    // Start waiting for download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download plugin/i }).click();
    const download = await downloadPromise;

    // Wait for download to complete
    const downloadPath = path.join(DOWNLOAD_DIR, download.suggestedFilename());
    await download.saveAs(downloadPath);

    // Verify file was downloaded
    expect(fs.existsSync(downloadPath)).toBeTruthy();

    // Clean up
    await context.close();
  });

  test('should show scan history when available', async ({ page }) => {
    // Check scan history section
    const historySection = page.locator('section:has(h2:has-text("Scan History"))');
    await expect(historySection).toBeVisible();

    // Check scan items
    const scanItems = page.locator('[data-testid="scan-item"]');
    const count = await scanItems.count();
    expect(count).toBeGreaterThan(0);

    // Verify scan item content
    for (let i = 0; i < count; i++) {
      const item = scanItems.nth(i);
      await expect(item.locator('h3')).toBeVisible();
      await expect(item.locator('time')).toBeVisible();
      await expect(item.getByRole('button', { name: /view|download/i })).toBeVisible();
    }
  });

  test('should show empty state when no scans are available', async ({ page }) => {
    // Override the default route for this test
    await page.route('**/api/scans', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Reload to get empty state
    await page.reload();

    // Check empty state
    await expect(page.getByText(/no scans available/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /start new scan/i })).toBeVisible();
  });

  test('should handle file upload for scanning', async ({ page }) => {
    // Mock file upload response
    await page.route('**/api/scan/upload', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'scan-123',
          status: 'processing',
          name: 'test-file.wav',
        }),
      });
    });

    // Mock WebSocket for scan updates
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'scan:update',
            data: {
              id: 'scan-123',
              status: 'completed',
              results: { bpm: 120, key: 'C#m' },
            },
          }),
        })
      );
    });

    // Test file upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /upload file/i }).click();
    const fileChooser = await fileChooserPromise;

    // Create a test file
    const testFilePath = path.join(__dirname, 'test-audio.wav');
    fs.writeFileSync(testFilePath, 'test-audio-content');

    // Upload the file
    await fileChooser.setFiles(testFilePath);

    // Verify upload success
    await expect(page.getByText(/processing your file/i)).toBeVisible();

    // Wait for scan completion (handled by WebSocket mock)
    await expect(page.getByText(/scan completed/i)).toBeVisible();

    // Clean up test file
    fs.unlinkSync(testFilePath);
  });

  test('should show scan results when a scan is selected', async ({ page }) => {
    // Click on first scan item
    const firstScan = page.locator('[data-testid="scan-item"]').first();
    const scanName = await firstScan.locator('h3').textContent();
    await firstScan.click();

    // Verify results panel is shown
    const resultsPanel = page.locator('[data-testid="scan-results"]');
    await expect(resultsPanel).toBeVisible();

    // Verify scan details are displayed
    await expect(resultsPanel.getByText(scanName)).toBeVisible();
    await expect(resultsPanel.getByText(/bpm/i)).toBeVisible();
    await expect(resultsPanel.getByText(/key/i)).toBeVisible();

    // Verify action buttons
    await expect(resultsPanel.getByRole('button', { name: /export/i })).toBeVisible();
    await expect(resultsPanel.getByRole('button', { name: /delete/i })).toBeVisible();
  });
});
