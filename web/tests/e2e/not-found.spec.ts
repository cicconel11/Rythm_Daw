import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {
  test.describe.configure({ retries: 2 });

  test('should display NotFound component for invalid routes', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/definitely-not-a-page');
    await page.waitForLoadState('networkidle');

    // Verify NotFound component is visible
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
    await expect(page.getByText(/the page you're looking for doesn't exist/i)).toBeVisible();
  });

  test('should have a link back to home page', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/definitely-not-a-page');

    // Check for home link
    const homeLink = page.getByRole('link', { name: /go home/i });
    await expect(homeLink).toBeVisible();

    // Click home link and verify navigation
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('should show helpful error message', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/definitely-not-a-page');

    // Verify helpful error message
    await expect(page.getByText(/check the url/i)).toBeVisible();
    await expect(page.getByText(/or go back to the homepage/i)).toBeVisible();
  });

  test('should handle various invalid routes', async ({ page }) => {
    const invalidRoutes = [
      '/invalid-page',
      '/api/nonexistent',
      '/user/999999',
      '/project/abc123',
      '/settings/nonexistent',
    ];

    for (const route of invalidRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Verify 404 page is shown
      await expect(page.locator('text=404')).toBeVisible();
      await expect(page.getByText(/page not found/i)).toBeVisible();
    }
  });

  test('should maintain navigation functionality', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('/definitely-not-a-page');

    // Verify navigation menu is still accessible
    await expect(page.getByRole('navigation')).toBeVisible();

    // Check that navigation links work
    const navLinks = page.locator('nav a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should show proper HTTP status code', async ({ page }) => {
    // Navigate to a non-existent page
    const response = await page.goto('/definitely-not-a-page');

    // Verify 404 status code
    expect(response?.status()).toBe(404);
  });

  test('should handle deep nested invalid routes', async ({ page }) => {
    // Navigate to a deeply nested invalid route
    await page.goto('/very/deep/nested/invalid/route/that/does/not/exist');

    // Verify 404 page is shown
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
  });

  test('should work with query parameters', async ({ page }) => {
    // Navigate to invalid route with query parameters
    await page.goto('/invalid-page?param1=value1&param2=value2');

    // Verify 404 page is shown
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
  });

  test('should handle special characters in URL', async ({ page }) => {
    // Navigate to invalid route with special characters
    await page.goto('/invalid-page%20with%20spaces');

    // Verify 404 page is shown
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.getByText(/page not found/i)).toBeVisible();
  });
});
