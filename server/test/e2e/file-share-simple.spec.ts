import { test, expect } from '@playwright/test';

test.describe('File Share Simple E2E', () => {
  test('User can navigate to file share page', async ({ page }) => {
    test.setTimeout(60000);

    // Navigate to files page
    await page.goto('/files');
    
    // Check if page loads (this will fail if server is not running)
    await expect(page.locator('body')).toBeVisible();
  });

  test('File share page has expected elements', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('/files');
    
    // Check for basic UI elements in the new dynamic interface
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');
    await expect(page.locator('#file-drop-zone')).toBeVisible();
    await expect(page.locator('#select-friends')).toBeVisible();
    await expect(page.locator('#send-files')).toBeVisible();
    await expect(page.locator('#search-input')).toBeVisible();
  });

  test('File upload input is functional', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('/files');
    
    // Initially the send button should be disabled (no files selected)
    await expect(page.locator('#send-files')).toBeDisabled();
    
    // Test file input through the drag-and-drop zone
    const fileData = Buffer.from('test audio file content');
    await page.setInputFiles('#file-input', {
      name: 'test-audio.wav',
      mimeType: 'audio/wav',
      buffer: fileData
    });

    // After file selection, the send button should be enabled
    await expect(page.locator('#send-files')).toBeEnabled();
    
    // The file input should exist but be hidden (for better UX)
    await expect(page.locator('#file-input')).toBeHidden();
  });

  test('Drag and drop functionality works', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('/files');
    
    // Test drag and drop zone interaction
    const dropZone = page.locator('#file-drop-zone');
    await expect(dropZone).toBeVisible();
    await expect(dropZone).toContainText('Drag and drop files here');
    
    // Test clicking the drop zone opens file dialog
    await dropZone.click();
    // Note: We can't actually test the file dialog opening in headless mode
    // but we can verify the click handler is attached
  });

  test('Search and filter functionality', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('/files');
    
    // Check search input
    const searchInput = page.locator('#search-input');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('test search');
    await expect(searchInput).toHaveValue('test search');
    
    // Check filter buttons
    await expect(page.locator('button[data-filter="all"]')).toBeVisible();
    await expect(page.locator('button[data-filter="received"]')).toBeVisible();
    await expect(page.locator('button[data-filter="sent"]')).toBeVisible();
  });
});
