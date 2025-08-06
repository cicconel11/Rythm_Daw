import { test, expect } from '@playwright/test';

test('smoke: can run a basic test', async ({ page }) => {
  await page.goto('/');
  expect(1).toBe(1);
});
