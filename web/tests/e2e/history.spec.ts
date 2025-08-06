import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

test.describe('History Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Use authenticated state
    test.use({ storageState: 'tests/state.json' });

    // Mock API responses
    await page.route('**/api/history', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            action: 'uploaded',
            file: 'test-audio.wav',
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            action: 'downloaded',
            file: 'project-file.mp3',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ]),
      });
    });

    // Navigate to history page
    await page.goto('/history');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/History | Rythm/);
  });

  test('should display history list with activities', async ({ page }) => {
    // Check for history list
    const historyList = page.locator(selectors.history.historyList);
    await expect(historyList).toBeVisible();

    // Check for history items
    const historyItems = historyList.locator('[data-testid="history-item"]');
    await expect(historyItems).toHaveCount(2);

    // Verify activity details
    await expect(page.getByText(/uploaded/i)).toBeVisible();
    await expect(page.getByText(/downloaded/i)).toBeVisible();
    await expect(page.getByText('test-audio.wav')).toBeVisible();
    await expect(page.getByText('project-file.mp3')).toBeVisible();
  });

  test('should show empty state when no history', async ({ page }) => {
    // Mock empty history response
    await page.route('**/api/history', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Reload to get empty state
    await page.reload();

    // Verify empty state message
    await expect(page.getByText(selectors.history.emptyState)).toBeVisible();
    await expect(page.getByText(/no history yet/i)).toBeVisible();
  });

  test('should display timestamps correctly', async ({ page }) => {
    // Check for timestamp elements
    const timestamps = page.locator('[data-testid="history-timestamp"]');
    await expect(timestamps).toHaveCount(2);

    // Verify relative time formatting
    await expect(page.getByText(/ago/i)).toBeVisible();
  });

  test('should allow filtering by activity type', async ({ page }) => {
    // Check for filter controls
    const filterSelect = page.getByRole('combobox', { name: /filter by/i });
    await expect(filterSelect).toBeVisible();

    // Filter by uploads
    await filterSelect.selectOption('upload');

    // Verify only uploads are shown
    await expect(page.getByText(/uploaded/i)).toBeVisible();
    await expect(page.getByText(/downloaded/i)).not.toBeVisible();
  });

  test('should allow searching history', async ({ page }) => {
    // Check for search input
    const searchInput = page.getByPlaceholder(/search history/i);
    await expect(searchInput).toBeVisible();

    // Search for specific file
    await searchInput.fill('test-audio');

    // Verify filtered results
    await expect(page.getByText('test-audio.wav')).toBeVisible();
    await expect(page.getByText('project-file.mp3')).not.toBeVisible();
  });

  test('should show activity details on click', async ({ page }) => {
    // Click on first history item
    const firstItem = page.locator('[data-testid="history-item"]').first();
    await firstItem.click();

    // Verify details modal/sidebar
    await expect(page.getByText(/activity details/i)).toBeVisible();
    await expect(page.getByText('test-audio.wav')).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Mock paginated response
    await page.route('**/api/history', route => {
      const url = new URL(route.request().url());
      const page = url.searchParams.get('page') || '1';

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: Array.from({ length: 10 }, (_, i) => ({
            id: `${page}-${i}`,
            action: 'uploaded',
            file: `file-${page}-${i}.wav`,
            timestamp: new Date().toISOString(),
          })),
          total: 25,
          page: parseInt(page),
          hasMore: parseInt(page) < 3,
        }),
      });
    });

    // Reload to get paginated data
    await page.reload();

    // Check for pagination controls
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible();

    // Click next page
    await page.getByRole('button', { name: /next/i }).click();

    // Verify page changed
    await expect(page.getByText('file-2-0.wav')).toBeVisible();
  });

  test('should allow clearing history', async ({ page }) => {
    // Check for clear history button
    const clearBtn = page.getByRole('button', { name: /clear history/i });
    await expect(clearBtn).toBeVisible();

    // Mock clear API
    await page.route('**/api/history/clear', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Click clear button
    await clearBtn.click();

    // Confirm clearing
    await page.getByRole('button', { name: /confirm/i }).click();

    // Verify history is cleared
    await expect(page.getByText(/no history yet/i)).toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/history', route => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
          resolve();
        }, 1000);
      });
    });

    // Reload to trigger loading
    await page.reload();

    // Verify loading state
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.getByText(/loading history/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/history', route => {
      return route.fulfill({
        status: 500,
        body: 'Internal Server Error',
      });
    });

    // Reload to trigger error
    await page.reload();

    // Verify error state
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/failed to load history/i)).toBeVisible();

    // Verify retry button
    const retryBtn = page.getByRole('button', { name: /retry/i });
    await expect(retryBtn).toBeVisible();
    await expect(retryBtn).toBeEnabled();
  });
});
