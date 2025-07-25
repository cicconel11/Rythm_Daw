import { test, expect } from '@playwright/test';

// Helper function to generate a random device code
function generateDeviceCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Mock WebSocket server URL (this would be configured in your test setup)
const MOCK_WS_SERVER = process.env.WS_SERVER_URL || 'ws://localhost:3001';

test.describe('Device Connection', () => {
  // Skip authentication for now - in a real test, you'd want to set up an authenticated session
  test.skip('requires authentication', async ({ page }) => {
    await page.goto('/device');
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('displays a device pairing code', async ({ page }) => {
    // Mock the API response for device code generation
    await page.route('**/api/device/code', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'ABC123',
          expiresIn: 300, // 5 minutes
        }),
      });
    });

    await page.goto('/device');

    // Check that the code is displayed
    const codeElement = page.locator('code');
    await expect(codeElement).toBeVisible();
    const displayedCode = await codeElement.textContent();
    expect(displayedCode).toMatch(/^[A-Z0-9]{6}$/);

    // Check that the expiration timer is shown
    await expect(page.getByText(/expires in/i)).toBeVisible();
  });

  test('handles WebSocket connection and device:linked event', async ({ page }) => {
    // Mock the API response for device code generation
    const testCode = generateDeviceCode();
    await page.route('**/api/device/code', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: testCode,
          expiresIn: 300,
        }),
      });
    });

    // Set up WebSocket connection mocking
    await page.goto('/device');

    // Wait for the page to establish WebSocket connection
    await page.waitForTimeout(1000);

    // Mock WebSocket message for device linked
    await page.evaluate(
      ({ testCode }) => {
        // This is a simplified version - in a real test, you'd want to use a proper WebSocket mock
        window.dispatchEvent(
          new MessageEvent('message', {
            data: JSON.stringify({
              event: 'device:linked',
              data: {
                code: testCode,
                deviceName: 'Test Device',
                timestamp: new Date().toISOString(),
              },
            }),
          })
        );
      },
      { testCode }
    );

    // Check that the success message is shown
    await expect(page.getByText(/device linked successfully/i)).toBeVisible();

    // Check that the continue button is shown and clickable
    const continueButton = page.getByRole('button', { name: /continue to dashboard/i });
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();

    // Test navigation on continue
    await continueButton.click();
    await expect(page).toHaveURL('/');
  });

  test('shows an error if the code expires', async ({ page }) => {
    // Mock the API response for device code generation
    await page.route('**/api/device/code', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'EXPIRED',
          expiresIn: 1, // 1 second
        }),
      });
    });

    await page.goto('/device');

    // Wait for the code to expire (1 second + buffer)
    await page.waitForTimeout(1500);

    // Check that the code expired message is shown
    await expect(page.getByText(/code has expired/i)).toBeVisible();

    // Check that a refresh button is shown
    const refreshButton = page.getByRole('button', { name: /get new code/i });
    await expect(refreshButton).toBeVisible();

    // Test refresh functionality
    await refreshButton.click();
    await expect(page.getByText(/code has expired/i)).not.toBeVisible();
  });

  test('allows copying the device code to clipboard', async ({ page }) => {
    // Mock the clipboard API
    await page.goto('about:blank');
    await page.addInitScript(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
          readText: () => Promise.resolve('MOCKED'),
        },
      });
    });

    // Mock the API response
    const testCode = 'COPY123';
    await page.route('**/api/device/code', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: testCode,
          expiresIn: 300,
        }),
      });
    });

    await page.goto('/device');

    // Click the copy button
    const copyButton = page.getByRole('button', { name: /copy code/i });
    await expect(copyButton).toBeVisible();

    // Mock the clipboard write
    await page.evaluate(() => {
      navigator.clipboard.writeText = text => {
        window['lastCopiedText'] = text;
        return Promise.resolve();
      };
    });

    await copyButton.click();

    // Verify the copy was attempted with the correct text
    const copiedText = await page.evaluate(() => window['lastCopiedText']);
    expect(copiedText).toBe(testCode);

    // Verify feedback is shown
    await expect(page.getByText(/copied/i)).toBeVisible();
  });

  test('shows connected devices if any exist', async ({ page }) => {
    // Mock the API response for connected devices
    await page.route('**/api/device/connected', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'iPhone 13', lastSeen: new Date().toISOString() },
          { id: '2', name: 'MacBook Pro', lastSeen: new Date().toISOString() },
        ]),
      });
    });

    await page.goto('/device');

    // Check that connected devices are shown
    await expect(page.getByText(/connected devices/i)).toBeVisible();
    const deviceItems = page.locator('.device-item');
    const count = await deviceItems.count();
    expect(count).toBeGreaterThan(0);

    // Check that each device shows the expected information
    for (let i = 0; i < count; i++) {
      const device = deviceItems.nth(i);
      await expect(device.getByRole('heading')).toBeVisible();
      await expect(device.getByText(/last seen/i)).toBeVisible();
    }
  });
});
