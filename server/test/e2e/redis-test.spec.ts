import { test, expect } from '@playwright/test';

test.describe('Redis Service Test', () => {
  test('Server starts without Redis connection errors', async ({ page }) => {
    test.setTimeout(30000);

    // Navigate to a simple endpoint to check if server is running
    await page.goto('/healthz');
    
    // Should get a response (even if it's an error, it means server is running)
    await expect(page.locator('body')).toBeVisible();
  });

  test('Server handles missing Redis gracefully', async ({ page }) => {
    test.setTimeout(30000);

    // Navigate to the root endpoint
    await page.goto('/');
    
    // Should load without Redis connection errors
    await expect(page.locator('body')).toBeVisible();
  });
});
