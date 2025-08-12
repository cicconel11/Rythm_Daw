import { test, expect } from '@playwright/test';

test.describe('Scan Dynamic Tests', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Set up authentication cookies
    await page.context().addCookies([
      {
        name: 'registration_completed',
        value: 'true',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'registration_step1',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);
  });

  test('should show Windows download link for Windows user agent', async ({ page }) => {
    // Override user agent to Windows
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Wait for OS detection to complete
    await page.waitForTimeout(1000);

    // Verify Windows download link
    await expect(page.getByText('🪟 Windows')).toBeVisible();
    await expect(page.getByText(/RHYTHM Plugin for Windows/)).toBeVisible();
  });

  test('should show macOS download link for macOS user agent', async ({ page }) => {
    // Override user agent to macOS
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    });

    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Wait for OS detection to complete
    await page.waitForTimeout(1000);

    // Verify macOS download link
    await expect(page.getByText('🍎 macOS')).toBeVisible();
    await expect(page.getByText(/RHYTHM Plugin for macOS/)).toBeVisible();
  });

  test('should show generic download for other user agents', async ({ page }) => {
    // Override user agent to Linux
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    });

    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Wait for OS detection to complete
    await page.waitForTimeout(1000);

    // Verify Linux download link
    await expect(page.getByText('🐧 Linux')).toBeVisible();
    await expect(page.getByText(/RHYTHM Plugin for Linux/)).toBeVisible();
  });

  test('should detect OS dynamically on page load', async ({ page }) => {
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Wait for OS detection to complete
    await page.waitForTimeout(1000);

    // Verify OS detection is working
    await expect(page.getByText(/Download RHYTHM Plugin/)).toBeVisible();
    await expect(page.getByText(/Recommended for your system/)).toBeVisible();
    
    // Should show download button for detected OS
    await expect(page.getByRole('button', { name: /Download Plugin/ })).toBeVisible();
  });

  test('should handle download link clicks', async ({ page }) => {
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Wait for OS detection to complete
    await page.waitForTimeout(1000);

    // Mock download response
    await page.route('**/downloads/**', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/octet-stream',
        body: 'mock-plugin-file-content',
      });
    });

    // Click download link - use the main download button
    const downloadButton = page.getByRole('button', { name: 'Download Plugin' });
    await downloadButton.click();

    // Verify download started
    await expect(page.getByText(/Downloading/)).toBeVisible();
  });

  test('should show plugin download status', async ({ page }) => {
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Wait for OS detection to complete
    await page.waitForTimeout(1000);

    // Verify download status elements
    await expect(page.getByText(/Download RHYTHM Plugin/)).toBeVisible();
    await expect(page.getByText(/Install the plugin to start collaborating/)).toBeVisible();
  });

  test('should have skip to dashboard option', async ({ page }) => {
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Verify skip button exists
    await expect(page.getByRole('button', { name: /Skip to Dashboard/ })).toBeVisible();
  });

  test('should show other platform options', async ({ page }) => {
    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Wait for OS detection to complete
    await page.waitForTimeout(1000);

    // Verify other platforms section
    await expect(page.getByText(/Other platforms/)).toBeVisible();
    
    // Should show at least one other platform option
    const otherPlatformButtons = page.locator('button').filter({ hasText: /Download$/ });
    await expect(otherPlatformButtons).toHaveCount(1);
  });
});
