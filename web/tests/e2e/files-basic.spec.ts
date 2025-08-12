import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Files Basic', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ user: { id: '1', name: 'Test User' } }));
    });
    
    // Mock API responses
    await page.route('/api/files', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Project Alpha.wav', size: 45200000, type: 'audio/wav', status: 'inbox', owner: 'user1' },
          { id: '2', name: 'Mixdown Final.mp3', size: 12800000, type: 'audio/mp3', status: 'sent', owner: 'user1' },
          { id: '3', name: 'Session Notes.pdf', size: 2100000, type: 'application/pdf', status: 'processing', owner: 'user1' }
        ])
      });
    });
    
    await page.goto('/files');
  });

  test('should display file list', async ({ page }) => {
    await expect(page.getByText('File Share')).toBeVisible();
    
    // Verify file items
    await expect(page.getByText('Project Alpha.wav')).toBeVisible();
    await expect(page.getByText('Mixdown Final.mp3')).toBeVisible();
    await expect(page.getByText('Session Notes.pdf')).toBeVisible();
  });

  test('should show file details', async ({ page }) => {
    // Check file sizes
    await expect(page.getByText('45.2 MB')).toBeVisible();
    await expect(page.getByText('12.8 MB')).toBeVisible();
    await expect(page.getByText('2.1 MB')).toBeVisible();
    
    // Check file types
    await expect(page.getByText('WAV')).toBeVisible();
    await expect(page.getByText('MP3')).toBeVisible();
    await expect(page.getByText('PDF')).toBeVisible();
  });

  test('should display file statuses', async ({ page }) => {
    // Check status badges
    await expect(page.getByText('Inbox')).toBeVisible();
    await expect(page.getByText('Sent')).toBeVisible();
    await expect(page.getByText('Processing')).toBeVisible();
  });

  test('should handle drag and drop upload', async ({ page }) => {
    // Create a test file
    const testFilePath = path.join(__dirname, 'test-files', 'test-audio.wav');
    
    // Mock file upload API
    await page.route('/api/files/upload', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'new-file',
          name: 'test-audio.wav',
          size: 1024000,
          type: 'audio/wav',
          status: 'uploaded',
          owner: 'user1'
        })
      });
    });
    
    // Find drop zone
    const dropZone = page.locator('[data-testid="file-drop-zone"]');
    await expect(dropZone).toBeVisible();
    
    // Simulate file drop
    await dropZone.setInputFiles(testFilePath);
    
    // Should show upload progress
    await expect(page.getByText('Uploading...')).toBeVisible();
    
    // Should show success message
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
  });

  test('should handle file selection', async ({ page }) => {
    // Click on a file
    await page.getByText('Project Alpha.wav').click();
    
    // Should show file details panel
    await expect(page.getByText('File Details')).toBeVisible();
    await expect(page.getByText('Project Alpha.wav')).toBeVisible();
  });

  test('should handle file download', async ({ page }) => {
    // Mock download API
    await page.route('/api/files/*/download', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/octet-stream',
        body: 'fake file content'
      });
    });
    
    // Click download button
    await page.getByTestId('download-btn').first().click();
    
    // Should trigger download
    const downloadPromise = page.waitForEvent('download');
    await downloadPromise;
  });

  test('should handle file deletion', async ({ page }) => {
    // Mock delete API
    await page.route('/api/files/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Click delete button
    await page.getByTestId('delete-btn').first().click();
    
    // Should show confirmation dialog
    await expect(page.getByText('Delete File')).toBeVisible();
    
    // Confirm deletion
    await page.getByRole('button', { name: 'Delete' }).click();
    
    // Should show success message
    await expect(page.getByText('File deleted successfully')).toBeVisible();
  });

  test('should filter files by status', async ({ page }) => {
    // Click on status filter
    await page.getByRole('button', { name: 'Inbox' }).click();
    
    // Should only show inbox files
    await expect(page.getByText('Project Alpha.wav')).toBeVisible();
    await expect(page.getByText('Mixdown Final.mp3')).not.toBeVisible();
  });

  test('should search files', async ({ page }) => {
    // Type in search box
    await page.getByPlaceholder('Search files...').fill('Alpha');
    
    // Should only show matching files
    await expect(page.getByText('Project Alpha.wav')).toBeVisible();
    await expect(page.getByText('Mixdown Final.mp3')).not.toBeVisible();
  });

  test('should show empty state when no files', async ({ page }) => {
    // Mock empty file list
    await page.route('/api/files', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/files');
    
    // Should show empty state
    await expect(page.getByText('No files yet')).toBeVisible();
    await expect(page.getByText('Upload your first file')).toBeVisible();
  });

  test('should handle upload errors', async ({ page }) => {
    // Mock upload error
    await page.route('/api/files/upload', async route => {
      await route.fulfill({
        status: 413,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'File too large' })
      });
    });
    
    // Try to upload a file
    const testFilePath = path.join(__dirname, 'test-files', 'large-file.wav');
    const dropZone = page.locator('[data-testid="file-drop-zone"]');
    await dropZone.setInputFiles(testFilePath);
    
    // Should show error message
    await expect(page.getByText('File too large')).toBeVisible();
  });
});
