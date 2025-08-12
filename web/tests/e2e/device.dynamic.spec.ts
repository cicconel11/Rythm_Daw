import { test, expect } from '@playwright/test';

test.describe('Device Dynamic Tests', () => {
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

  test('should show connection code generation', async ({ page }) => {
    await page.goto('/device');
    await page.waitForLoadState('networkidle');

    // Verify connection code elements
    await expect(page.getByText(/Connect Your Device/)).toBeVisible();
    await expect(page.getByText(/Connection Code/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate New Code/ })).toBeVisible();
  });

  test('should generate new connection code', async ({ page }) => {
    await page.goto('/device');
    await page.waitForLoadState('networkidle');

    // Get initial code
    const initialCode = await page.locator('.text-4xl.font-mono').textContent();

    // Click generate new code button
    await page.getByRole('button', { name: /Generate New Code/ }).click();

    // Wait for new code to generate
    await page.waitForTimeout(1000);

    // Verify code changed
    const newCode = await page.locator('.text-4xl.font-mono').textContent();
    expect(newCode).not.toBe(initialCode);
  });

  test('should navigate to scan page when continue clicked', async ({ page }) => {
    await page.goto('/device');
    await page.waitForLoadState('networkidle');

    // Click continue button
    await page.getByRole('button', { name: /Continue to Plugin Download/ }).click();

    // Verify navigation to scan page
    await expect(page).toHaveURL('/scan');
  });

  test('should navigate to dashboard when skip clicked', async ({ page }) => {
    await page.goto('/device');
    await page.waitForLoadState('networkidle');

    // Click skip button
    await page.getByRole('button', { name: /Skip to Dashboard/ }).click();

    // Verify navigation to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show device connection instructions', async ({ page }) => {
    await page.goto('/device');
    await page.waitForLoadState('networkidle');

    // Verify instructions
    await expect(page.getByText(/Use this code to link your RHYTHM plugin/)).toBeVisible();
    await expect(page.getByText(/Enter this code in your RHYTHM plugin to connect/)).toBeVisible();
  });

  test('should display connection code format', async ({ page }) => {
    await page.goto('/device');
    await page.waitForLoadState('networkidle');

    // Verify connection code is displayed
    const codeElement = page.locator('.text-4xl.font-mono');
    await expect(codeElement).toBeVisible();
    
    // Verify code is 6 digits
    const codeText = await codeElement.textContent();
    expect(codeText).toMatch(/^\d{6}$/);
  });
});
