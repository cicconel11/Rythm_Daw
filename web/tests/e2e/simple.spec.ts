import { test, expect } from '@playwright/test';

test.describe('Simple Test Page', () => {
  test.describe.configure({ retries: 2 });

  test('should load simple test page', async ({ page }) => {
    // Navigate to simple test page
    await page.goto('/test-minimal');
    await page.waitForLoadState('networkidle');

    // Verify page content
    await expect(page).toHaveTitle(/Minimal Test Page/);
    await expect(page.getByRole('heading', { name: 'Minimal Test Page' })).toBeVisible();
    await expect(
      page.getByText('This is a minimal test page to verify Next.js works.')
    ).toBeVisible();
    await expect(page.locator('[data-testid="test-button"]')).toBeVisible();
  });
});
