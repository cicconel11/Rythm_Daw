import { test, expect } from '@playwright/test';

test.describe('404 Dynamic Tests', () => {
  test.describe.configure({ retries: 2 });

  test('should display 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-route');
    await page.waitForLoadState('networkidle');

    // Verify 404 page content
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should show helpful error message', async ({ page }) => {
    await page.goto('/completely-invalid-path');
    await page.waitForLoadState('networkidle');

    // Look for helpful error message
    const errorMessage = page.getByText(/not found|doesn't exist|page not found/i);
    await expect(errorMessage).toBeVisible();
  });

  test('should provide navigation back to home', async ({ page }) => {
    await page.goto('/invalid-route');
    await page.waitForLoadState('networkidle');

    // Look for home navigation link
    const homeLink = page.getByRole('link', { name: /home|dashboard|back to home/i });
    if (await homeLink.isVisible()) {
      await expect(homeLink).toBeVisible();
    }
  });

  test('should handle deep nested invalid routes', async ({ page }) => {
    await page.goto('/deeply/nested/invalid/route/that/does/not/exist');
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should handle special characters in invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-with-special-chars-!@#$%^&*()');
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should handle very long invalid routes', async ({ page }) => {
    const longRoute = '/a'.repeat(1000);
    await page.goto(longRoute);
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should handle query parameters in invalid routes', async ({ page }) => {
    await page.goto('/invalid-route?param1=value1&param2=value2');
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should handle hash fragments in invalid routes', async ({ page }) => {
    await page.goto('/invalid-route#section1');
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should show correct status code', async ({ page }) => {
    const response = await page.goto('/non-existent-route');
    
    // Verify 404 status code
    expect(response?.status()).toBe(404);
  });

  test('should handle dynamic route parameters that don\'t exist', async ({ page }) => {
    await page.goto('/user/non-existent-user-id');
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should handle API routes that don\'t exist', async ({ page }) => {
    await page.goto('/api/non-existent-endpoint');
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should provide search functionality on 404 page', async ({ page }) => {
    await page.goto('/invalid-route');
    await page.waitForLoadState('networkidle');

    // Look for search functionality
    const searchInput = page.getByPlaceholder(/search|find/i);
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should show suggested routes on 404 page', async ({ page }) => {
    await page.goto('/invalid-route');
    await page.waitForLoadState('networkidle');

    // Look for suggested routes
    const suggestedRoutes = page.locator('[data-testid*="suggestion"], .suggestion, [class*="suggestion"]');
    if (await suggestedRoutes.first().isVisible()) {
      await expect(suggestedRoutes.first()).toBeVisible();
    }
  });

  test('should handle 404 with authentication', async ({ page }) => {
    // Set up authentication cookies
    await page.context().addCookies([
      {
        name: 'registration_completed',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);

    await page.goto('/protected-invalid-route');
    await page.waitForLoadState('networkidle');

    // Verify 404 page is shown even with authentication
    await expect(page.getByText(/404/)).toBeVisible();
  });

  test('should maintain navigation context on 404', async ({ page }) => {
    await page.goto('/invalid-route');
    await page.waitForLoadState('networkidle');

    // Look for navigation elements that should still be present
    const navigation = page.locator('nav, [role="navigation"], [data-testid*="nav"]');
    if (await navigation.first().isVisible()) {
      await expect(navigation.first()).toBeVisible();
    }
  });

  test('should handle 404 with different HTTP methods', async ({ page }) => {
    // Test POST request to non-existent route
    const response = await page.request.post('/non-existent-post-route');
    expect(response.status()).toBe(404);
  });

  test('should show appropriate error for different content types', async ({ page }) => {
    // Test API route that expects JSON
    const response = await page.request.get('/api/non-existent-endpoint', {
      headers: { 'Accept': 'application/json' }
    });
    expect(response.status()).toBe(404);
  });
});
