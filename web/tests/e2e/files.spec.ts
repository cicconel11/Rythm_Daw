import { test, expect } from '@playwright/test';
import { selectors, testData } from './selectors';

test.describe('Files Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/files', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'test-audio.wav', size: '2.5 MB', uploadedAt: new Date().toISOString() },
          {
            id: '2',
            name: 'project-file.mp3',
            size: '1.8 MB',
            uploadedAt: new Date().toISOString(),
          },
        ]),
      });
    });

    // Navigate to files page
    await page.goto('/files');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Files | Rythm Daw/);
  });

  test('should display file table with uploaded files', async ({ page }) => {
    // Check for file table
    const fileTable = page.locator(selectors.files.fileTable);
    await expect(fileTable).toBeVisible();

    // Check for file rows
    const fileRows = fileTable.locator('tr');
    await expect(fileRows).toHaveCount(3); // Header + 2 files

    // Verify file names are displayed
    await expect(page.getByText('test-audio.wav')).toBeVisible();
    await expect(page.getByText('project-file.mp3')).toBeVisible();
  });

  test('should upload fixture .wav file', async ({ page }) => {
    // Mock upload API
    await page.route('**/api/files/upload', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'new-file',
          name: 'test-audio.wav',
          size: '2.5 MB',
          uploadedAt: new Date().toISOString(),
        }),
      });
    });

    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');

    // Click upload button
    const uploadInput = page.locator(selectors.files.uploadInput);
    await uploadInput.click();

    const fileChooser = await fileChooserPromise;

    // Upload test file
    await fileChooser.setFiles(testData.files.testWav);

    // Verify upload success
    await expect(page.getByText(/upload successful/i)).toBeVisible();
    await expect(page.getByText('test-audio.wav')).toBeVisible();
  });

  test('should download file when download button is clicked', async ({ page }) => {
    // Set up download event listener
    const downloadPromise = page.waitForEvent('download');

    // Click download button for first file
    const downloadBtn = page.locator(selectors.files.downloadBtn).first();
    await downloadBtn.click();

    // Wait for download to start
    const download = await downloadPromise;

    // Verify download filename
    expect(download.suggestedFilename()).toMatch(/\.(wav|mp3)$/);
    expect(download.suggestedFilename().length).toBeGreaterThan(0);
  });

  test('should delete file when delete button is clicked', async ({ page }) => {
    // Mock delete API
    await page.route('**/api/files/*', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Get initial file count
    const fileRows = page.locator(selectors.files.fileTable).locator('tr');
    const initialCount = await fileRows.count();

    // Click delete button for first file
    const deleteBtn = page.locator(selectors.files.deleteBtn).first();
    await deleteBtn.click();

    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click();

    // Verify file was removed
    await expect(fileRows).toHaveCount(initialCount - 1);
    await expect(page.getByText(/file deleted successfully/i)).toBeVisible();
  });

  test('should show upload progress', async ({ page }) => {
    // Mock slow upload response
    await page.route('**/api/files/upload', route => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'new-file',
              name: 'test-audio.wav',
              size: '2.5 MB',
            }),
          });
          resolve();
        }, 2000);
      });
    });

    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');
    const uploadInput = page.locator(selectors.files.uploadInput);
    await uploadInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testData.files.testWav);

    // Verify progress indicator
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.getByText(/uploading/i)).toBeVisible();
  });

  test('should handle upload errors gracefully', async ({ page }) => {
    // Mock upload error
    await page.route('**/api/files/upload', route => {
      return route.fulfill({
        status: 413,
        body: 'File too large',
      });
    });

    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');
    const uploadInput = page.locator(selectors.files.uploadInput);
    await uploadInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testData.files.testWav);

    // Verify error message
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/file too large/i)).toBeVisible();
  });

  test('should show file details on click', async ({ page }) => {
    // Click on first file row
    const firstFile = page.locator(selectors.files.fileTable).locator('tr').nth(1);
    await firstFile.click();

    // Verify file details modal/sidebar
    await expect(page.getByText(/file details/i)).toBeVisible();
    await expect(page.getByText('test-audio.wav')).toBeVisible();
    await expect(page.getByText('2.5 MB')).toBeVisible();
  });

  test('should allow file search and filtering', async ({ page }) => {
    // Check for search input
    const searchInput = page.getByPlaceholder(/search files/i);
    await expect(searchInput).toBeVisible();

    // Search for specific file
    await searchInput.fill('test-audio');

    // Verify filtered results
    await expect(page.getByText('test-audio.wav')).toBeVisible();
    await expect(page.getByText('project-file.mp3')).not.toBeVisible();
  });

  test('should show empty state when no files', async ({ page }) => {
    // Mock empty files response
    await page.route('**/api/files', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Reload to get empty state
    await page.reload();

    // Verify empty state
    await expect(page.getByText(/no files uploaded yet/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /upload your first file/i })).toBeVisible();
  });

  test('should handle file preview', async ({ page }) => {
    // Click preview button for audio file
    const previewBtn = page.getByRole('button', { name: /preview/i }).first();
    await previewBtn.click();

    // Verify audio player appears
    await expect(page.locator('audio')).toBeVisible();
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible();
  });
});
