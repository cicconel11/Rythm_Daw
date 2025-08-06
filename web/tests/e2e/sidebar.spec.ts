import { test, expect } from '@playwright/test';

const navLinks = [
  { testId: 'nav-files', path: '/files' },
  { testId: 'nav-history', path: '/history' },
  { testId: 'nav-friends', path: '/friends' },
  { testId: 'nav-chat', path: '/chat' },
  { testId: 'nav-settings', path: '/settings' },
];

test.describe('Sidebar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const { testId, path } of navLinks) {
    test(`should navigate to ${path} via sidebar`, async ({ page }) => {
      await page.getByTestId(testId).click();
      await expect(page).toHaveURL(path);
    });
  }
});
