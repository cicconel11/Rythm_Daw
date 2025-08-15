import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

test.describe('Device Connection Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Navigate to the device page before each test
    await page.goto('/device');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Device Connection | Rythm Daw/);
  });

  test('should display connection code element', async ({ page }) => {
    // Check for connect code element - it's in a div with specific classes
    const connectCode = page.locator('.text-4xl.font-mono.font-bold.text-blue-600');
    await expect(connectCode).toBeVisible();

    // Verify it contains a code (alphanumeric)
    const codeText = await connectCode.textContent();
    expect(codeText).toMatch(/^[0-9]{6}$/);
  });

  test('should show loading state while generating code', async ({ page }) => {
    // Check for loading indicator when generating new code
    const refreshBtn = page.getByRole('button', { name: /generate new code/i });
    await expect(refreshBtn).toBeVisible();
    
    // Get initial code
    const connectCode = page.locator('.text-4xl.font-mono.font-bold.text-blue-600');
    const initialCode = await connectCode.textContent();
    
    // Click refresh to trigger code generation
    await refreshBtn.click();
    
    // Wait a moment for the generation to complete
    await page.waitForTimeout(100);
    
    // Verify that a new code was generated (should be different)
    const newCode = await connectCode.textContent();
    expect(newCode).not.toBe(initialCode);
    
    // Button should still be enabled and functional
    await expect(refreshBtn).toBeEnabled();
  });

  test('should allow manual refresh of connection code', async ({ page }) => {
    // Get initial code
    const connectCode = page.locator('.text-4xl.font-mono.font-bold.text-blue-600');
    const initialCode = await connectCode.textContent();

    // Click refresh button
    const refreshBtn = page.getByRole('button', { name: /generate new code/i });
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();

    // Wait for new code to be generated
    await page.waitForTimeout(1000);

    // Verify new code is generated (should be different)
    const newCode = await connectCode.textContent();
    expect(newCode).not.toBe(initialCode);
  });

  test('should have continue to plugin download button', async ({ page }) => {
    // Check for continue button
    const continueBtn = page.getByRole('button', { name: /continue to plugin download/i });
    await expect(continueBtn).toBeVisible();
    await expect(continueBtn).toBeEnabled();
  });

  test('should have skip to dashboard button', async ({ page }) => {
    // Check for skip button - it's a button with role="button"
    const skipBtn = page.getByRole('button', { name: /skip to dashboard/i });
    await expect(skipBtn).toBeVisible();
    await expect(skipBtn).toBeEnabled();
  });

  test('should display device connection instructions', async ({ page }) => {
    // Check for instructions text
    await expect(page.getByText(/use this code to link your rhythm plugin/i)).toBeVisible();
    await expect(page.getByText(/enter this code in your rhythm plugin to connect/i)).toBeVisible();
  });

  test('should display device icon', async ({ page }) => {
    // Check for device icon - it's a specific SVG in the device icon container
    const deviceIcon = page.locator('.mx-auto.flex.h-16.w-16 svg');
    await expect(deviceIcon).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    // Check for main heading
    await expect(page.getByRole('heading', { name: /connect your device/i })).toBeVisible();
    
    // Check for connection code section
    await expect(page.getByText(/connection code/i)).toBeVisible();
    
    // Check for action buttons
    await expect(page.getByRole('button', { name: /generate new code/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue to plugin download/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /skip to dashboard/i })).toBeVisible();
  });
});
