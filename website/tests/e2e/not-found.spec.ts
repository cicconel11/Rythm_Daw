import { test, expect } from '@playwright/test';

test.describe('404 Not Found', () => {
  test('shows NotFound component on invalid route', async ({ page }) => {
    await page.goto('/nope');
    await expect(page.locator('h1, h2, .not-found')).toContainText('Not Found');
  });
});
