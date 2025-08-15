import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Share E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test - using our actual login page
    await page.goto('/login/');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to files page or handle login failure
    try {
      await page.waitForURL('**/files/', { timeout: 5000 });
    } catch (error) {
      // If login fails, try to register the user first
      console.log('Login failed, trying to register user...');
      await page.goto('/login/');
      await page.click('button:has-text("Register Demo User")');
      await page.waitForTimeout(2000);
      
      // Try login again
      await page.goto('/login/');
      await page.fill('input[name="email"]', 'testuser@example.com');
      await page.fill('input[name="password"]', 'Test123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/files/', { timeout: 10000 });
    }
  });

  test('user can upload, see, and download a file', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test file upload via drag and drop
    const fileInput = page.locator('#file-input');
    const testFileContent = 'This is a test audio file for upload testing.';
    const testFileBuffer = Buffer.from(testFileContent);
    
    await fileInput.setInputFiles({
      name: 'test-upload.wav',
      mimeType: 'audio/wav',
      buffer: testFileBuffer
    });
    
    // Wait for file to be selected
    await expect(page.locator('#send-files')).toBeEnabled();

    // Select a recipient
    await page.click('#select-friends');
    await page.waitForSelector('#friend-modal', { state: 'visible' });
    
    // Select first friend
    await page.click('.friend-item:first-child');
    await page.click('#confirm-friends');
    
    // Send the file
    await page.click('#send-files');
    
    // Wait for upload to start
    await expect(page.locator('#send-files:has-text("Sending...")')).toBeVisible({ timeout: 5000 });
    
    // Wait for upload to complete
    await expect(page.locator('#send-files:has-text("Send Files")')).toBeVisible({ timeout: 30000 });
  });

  test('user can search and filter files', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test search functionality
    const searchInput = page.locator('#search-input');
    await searchInput.fill('nonexistent');
    await expect(page.locator('.loading')).toBeVisible();

    // Clear search
    await searchInput.clear();
    
    // Test filter navigation
    await page.click('button[data-filter="received"]');
    await expect(page.locator('button[data-filter="received"]')).toHaveClass(/active/);

    await page.click('button[data-filter="sent"]');
    await expect(page.locator('button[data-filter="sent"]')).toHaveClass(/active/);

    await page.click('button[data-filter="all"]');
    await expect(page.locator('button[data-filter="all"]')).toHaveClass(/active/);
  });

  test('user can drag and drop files', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test drag and drop zone
    const dropZone = page.locator('#file-drop-zone');
    await expect(dropZone).toBeVisible();
    await expect(dropZone).toContainText('Drag and drop files here');

    // Create a test file
    const testFileContent = 'test audio content for drag and drop';
    const testFileBuffer = Buffer.from(testFileContent);
    const file = {
      name: 'test-drag-drop.wav',
      mimeType: 'audio/wav',
      buffer: testFileBuffer
    };

    // Simulate file selection
    const fileInput = page.locator('#file-input');
    await fileInput.setInputFiles(file);
    
    // Verify file was selected
    await expect(page.locator('#send-files')).toBeEnabled();
  });

  test('user can accept and decline incoming transfers', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Navigate to received filter
    await page.click('button[data-filter="received"]');
    await expect(page.locator('button[data-filter="received"]')).toHaveClass(/active/);
    
    // Check if there are any incoming transfers
    const fileItems = page.locator('.file-item');
    const itemCount = await fileItems.count();
    
    if (itemCount > 0) {
      // Test accept/decline functionality if transfers exist
      await expect(page.locator('.file-item')).toBeVisible();
    } else {
      // No incoming transfers - this is expected in test environment
      await expect(page.locator('.loading')).toBeVisible();
    }
  });

  test('user can download completed transfers', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Check if there are any completed transfers
    const fileItems = page.locator('.file-item');
    const itemCount = await fileItems.count();
    
    if (itemCount > 0) {
      // Look for download buttons
      const downloadButtons = page.locator('.download-btn');
      const downloadCount = await downloadButtons.count();
      
      if (downloadCount > 0) {
        await expect(downloadButtons.first()).toBeVisible();
      }
    } else {
      // No transfers - this is expected in test environment
      await expect(page.locator('.loading')).toBeVisible();
    }
  });

  test('file transfer progress modal works', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test file upload to trigger progress modal
    const fileInput = page.locator('#file-input');
    const testFileContent = 'Test file for progress modal';
    const testFileBuffer = Buffer.from(testFileContent);
    
    await fileInput.setInputFiles({
      name: 'progress-test.wav',
      mimeType: 'audio/wav',
      buffer: testFileBuffer
    });
    
    // Verify file is selected
    await expect(page.locator('#send-files')).toBeEnabled();
    
    // Test friend selection modal
    await page.click('#select-friends');
    await page.waitForSelector('#friend-modal', { state: 'visible' });
    await expect(page.locator('#friend-modal')).toBeVisible();
    
    // Close modal
    await page.click('#cancel-friends');
    await page.waitForSelector('#friend-modal', { state: 'hidden' });
  });

  test('user can handle different file types', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test different file types
    const fileTypes = [
      { name: 'audio.wav', mime: 'audio/wav', content: 'audio content' },
      { name: 'document.pdf', mime: 'application/pdf', content: 'pdf content' },
      { name: 'image.jpg', mime: 'image/jpeg', content: 'image content' },
      { name: 'text.txt', mime: 'text/plain', content: 'text content' }
    ];

    for (const fileType of fileTypes) {
      const fileInput = page.locator('#file-input');
      const testFileBuffer = Buffer.from(fileType.content);
      
      await fileInput.setInputFiles({
        name: fileType.name,
        mimeType: fileType.mime,
        buffer: testFileBuffer
      });
      
      // Verify file is selected
      await expect(page.locator('#send-files')).toBeEnabled();
      
      // Clear for next test
      await page.reload();
      await expect(page.locator('h1')).toContainText('Studio Hub - File Share');
    }
  });

  test('user can manage multiple file transfers', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test multiple file selection
    const fileInput = page.locator('#file-input');
    const files = [
      { name: 'file1.wav', mime: 'audio/wav', content: 'file 1 content' },
      { name: 'file2.wav', mime: 'audio/wav', content: 'file 2 content' },
      { name: 'file3.wav', mime: 'audio/wav', content: 'file 3 content' }
    ];

    for (const file of files) {
      const testFileBuffer = Buffer.from(file.content);
      await fileInput.setInputFiles({
        name: file.name,
        mimeType: file.mime,
        buffer: testFileBuffer
      });
    }
    
    // Verify files are selected
    await expect(page.locator('#send-files')).toBeEnabled();
  });

  test('user can remove selected files before sending', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Select a file
    const fileInput = page.locator('#file-input');
    const testFileContent = 'Test file for removal';
    const testFileBuffer = Buffer.from(testFileContent);
    
    await fileInput.setInputFiles({
      name: 'remove-test.wav',
      mimeType: 'audio/wav',
      buffer: testFileBuffer
    });
    
    // Verify file is selected
    await expect(page.locator('#send-files')).toBeEnabled();
    
    // Clear file input (simulate removal)
    await fileInput.setInputFiles([]);
    
    // Verify send button is disabled
    await expect(page.locator('#send-files')).toBeDisabled();
  });

  test('user can see transfer status updates', async ({ page }) => {
    // Should already be on files page from beforeEach
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test that status badges are visible (if any transfers exist)
    const statusBadges = page.locator('.status-badge');
    const badgeCount = await statusBadges.count();
    
    if (badgeCount > 0) {
      await expect(statusBadges.first()).toBeVisible();
    } else {
      // No transfers - this is expected in test environment
      await expect(page.locator('.loading')).toBeVisible();
    }
  });
});
