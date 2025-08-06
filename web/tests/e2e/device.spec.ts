import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

test.describe('Device Connection Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Use authenticated state
    test.use({ storageState: 'tests/state.json' });

    // Navigate to the device page before each test
    await page.goto('/device');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Device | Rythm/);
  });

  test('should display connection code element', async ({ page }) => {
    // Check for connect code element
    const connectCode = page.locator(selectors.device.connectCode);
    await expect(connectCode).toBeVisible();

    // Verify it contains a code (alphanumeric)
    const codeText = await connectCode.textContent();
    expect(codeText).toMatch(/^[A-Z0-9]{6,8}$/);
  });

  test('should show loading state while waiting for connection', async ({ page }) => {
    // Check for loading indicator
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();

    // Check for waiting message
    await expect(page.getByText(/waiting for device connection/i)).toBeVisible();
  });

  test('should handle successful device connection via WebSocket', async ({ page }) => {
    // Get initial state
    const connectCode = page.locator(selectors.device.connectCode);
    await expect(connectCode).toBeVisible();

    // Simulate WebSocket device:linked event
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'device:linked',
            data: {
              deviceId: 'test-device-123',
              deviceName: 'Test Device',
              status: 'connected',
            },
          }),
        })
      );
    });

    // Verify code disappears
    await expect(connectCode).not.toBeVisible();

    // Verify success banner appears
    const successBanner = page.locator(selectors.device.successBanner);
    await expect(successBanner).toBeVisible();
    await expect(successBanner).toContainText(/device connected successfully/i);

    // Verify device info is displayed
    await expect(page.getByText('Test Device')).toBeVisible();
    await expect(page.getByText('test-device-123')).toBeVisible();
  });

  test('should handle connection timeout', async ({ page }) => {
    // Mock timeout scenario
    await page.route('**/api/device/timeout', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ timeout: true }),
      });
    });

    // Wait for timeout (simulate by triggering timeout event)
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'device:timeout',
            data: { message: 'Connection timed out' },
          }),
        })
      );
    });

    // Verify timeout message
    await expect(page.getByText(/connection timed out/i)).toBeVisible();

    // Verify retry button is available
    const retryBtn = page.getByRole('button', { name: /retry/i });
    await expect(retryBtn).toBeVisible();
    await expect(retryBtn).toBeEnabled();
  });

  test('should handle connection error', async ({ page }) => {
    // Simulate connection error via WebSocket
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'device:error',
            data: {
              error: 'Connection failed',
              code: 'CONNECTION_ERROR',
            },
          }),
        })
      );
    });

    // Verify error message
    await expect(page.getByText(/connection failed/i)).toBeVisible();

    // Verify error details
    await expect(page.getByText(/CONNECTION_ERROR/i)).toBeVisible();
  });

  test('should allow manual refresh of connection code', async ({ page }) => {
    // Get initial code
    const connectCode = page.locator(selectors.device.connectCode);
    const initialCode = await connectCode.textContent();

    // Click refresh button
    const refreshBtn = page.getByRole('button', { name: /refresh/i });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // Verify new code is generated
    await expect(connectCode).not.toHaveText(initialCode || '');
  });

  test('should show device compatibility information', async ({ page }) => {
    // Check for compatibility section
    await expect(page.getByText(/compatible devices/i)).toBeVisible();

    // Check for supported platforms
    await expect(page.getByText(/macos/i)).toBeVisible();
    await expect(page.getByText(/windows/i)).toBeVisible();
    await expect(page.getByText(/linux/i)).toBeVisible();
  });

  test('should provide troubleshooting information', async ({ page }) => {
    // Check for troubleshooting section
    await expect(page.getByText(/troubleshooting/i)).toBeVisible();

    // Check for common issues
    await expect(page.getByText(/device not detected/i)).toBeVisible();
    await expect(page.getByText(/connection issues/i)).toBeVisible();
  });

  test('should handle multiple connection attempts', async ({ page }) => {
    // Simulate first connection attempt
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'device:linked',
            data: { deviceId: 'device-1', status: 'connected' },
          }),
        })
      );
    });

    // Verify success
    await expect(page.locator(selectors.device.successBanner)).toBeVisible();

    // Simulate disconnect
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'device:disconnected',
            data: { deviceId: 'device-1' },
          }),
        })
      );
    });

    // Verify reconnection UI
    const connectCode = page.locator(selectors.device.connectCode);
    await expect(connectCode).toBeVisible();
    await expect(page.getByText(/device disconnected/i)).toBeVisible();
  });
});
