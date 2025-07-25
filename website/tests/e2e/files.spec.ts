import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Test configuration
const TEST_FILES_DIR = path.join(__dirname, 'test-files');
const TEST_AUDIO_FILE = path.join(TEST_FILES_DIR, 'test-audio.wav');

// Create test directory if it doesn't exist
if (!fs.existsSync(TEST_FILES_DIR)) {
  fs.mkdirSync(TEST_FILES_DIR, { recursive: true });
}

// Create a test audio file
if (!fs.existsSync(TEST_AUDIO_FILE)) {
  const wavHeader = Buffer.from(
    'RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88\x58\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00',
    'latin1'
  );
  fs.writeFileSync(TEST_AUDIO_FILE, wavHeader);
}

test.describe('File Share', () => {
  // Use authenticated state
  test.use({ storageState: 'tests/state.json' });

  // Mock file data
  const mockFiles = [
    {
      id: '1',
      name: 'project1.wav',
      size: 1024 * 1024 * 5,
      type: 'audio/wav',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'sample.mp3',
      size: 1024 * 1024 * 2,
      type: 'audio/mp3',
      uploadedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/files', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFiles),
      });
    });

    // Mock upload response
    await page.route('**/api/files/upload', async route => {
      const data = await route.request().formData();
      const file = data.get('file') as File;

      // Add new file to mock data
      const newFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      };
      mockFiles.unshift(newFile);

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(newFile),
      });
    });

    // Navigate to files page
    await page.goto('/files');
    await page.waitForLoadState('networkidle');
  });

  test('should display file list with correct columns', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/Files | Rythm/);
    await expect(page.getByRole('heading', { name: /my files/i })).toBeVisible();

    // Check table headers
    const headers = ['Name', 'Size', 'Type', 'Uploaded', ''];
    for (const header of headers) {
      await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
    }

    // Check file list
    const fileRows = page.locator('[data-testid="file-row"]');
    await expect(fileRows).toHaveCount(mockFiles.length);

    // Verify file details in the first row
    const firstFile = mockFiles[0];
    const firstRow = fileRows.first();
    await expect(firstRow.getByText(firstFile.name)).toBeVisible();
    await expect(firstRow.getByText(/5 MB/)).toBeVisible();
    await expect(firstRow.getByText(firstFile.type.split('/')[1].toUpperCase())).toBeVisible();
  });

  test('should upload a file via file input', async ({ page }) => {
    test.retry(2);

    // Get initial file count
    const initialFileCount = await page.locator('[data-testid="file-row"]').count();

    // Upload test file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_AUDIO_FILE);

    // Verify upload success
    await expect(page.getByText('Upload complete')).toBeVisible();

    // Check file list was updated
    const fileRows = page.locator('[data-testid="file-row"]');
    await expect(fileRows).toHaveCount(initialFileCount + 1);
    await expect(fileRows.first().getByText(path.basename(TEST_AUDIO_FILE))).toBeVisible();
  });

  test('should upload a file via drag and drop', async ({ page }) => {
    test.retry(2);

    // Get initial file count
    const initialFileCount = await page.locator('[data-testid="file-row"]').count();

    // Setup drag and drop
    const dropZone = page.locator('[data-testid="drop-zone"]');
    const filePath = TEST_AUDIO_FILE;

    // Create a DataTransfer object to simulate drag and drop
    const dataTransfer = await page.evaluateHandle(filePath => {
      const dt = new DataTransfer();
      const file = new File(['test'], filePath, { type: 'audio/wav' });
      dt.items.add(file);
      return dt;
    }, filePath);

    // Trigger drag and drop
    await page.dispatchEvent('[data-testid="drop-zone"]', 'drop', { dataTransfer });

    // Verify upload success
    await expect(page.getByText('Upload complete')).toBeVisible();

    // Check file list was updated
    const fileRows = page.locator('[data-testid="file-row"]');
    await expect(fileRows).toHaveCount(initialFileCount + 1);
  });

  test('should download a file when clicking download button', async ({ page, browser }) => {
    test.retry(2);

    // Set up browser context with download handling
    const context = await browser.newContext({
      acceptDownloads: true,
    });

    const newPage = await context.newPage();
    await newPage.goto('/files');

    // Mock the download response
    await newPage.route('**/api/files/download/*', route => {
      return route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Disposition': 'attachment; filename="test-download.wav"',
        },
        body: 'test-file-content',
      });
    });

    // Click download button on first file
    const downloadPromise = newPage.waitForEvent('download');
    await newPage
      .locator('[data-testid="file-row"]')
      .first()
      .getByRole('button', { name: /download/i })
      .click();
    const download = await downloadPromise;

    // Wait for download to complete
    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    // Clean up
    await context.close();
  });

  test('should update file list in real-time via WebSocket', async ({ page }) => {
    // Get initial file count
    const initialFileCount = await page.locator('[data-testid="file-row"]').count();

    // Simulate new file via WebSocket
    const newFile = {
      id: 'websocket-file',
      name: 'websocket-upload.wav',
      size: 1024 * 1024 * 3,
      type: 'audio/wav',
      uploadedAt: new Date().toISOString(),
    };

    await page.evaluate(file => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'file:new',
            data: file,
          }),
        })
      );
    }, newFile);

    // Check file list was updated
    const fileRows = page.locator('[data-testid="file-row"]');
    await expect(fileRows).toHaveCount(initialFileCount + 1);
    await expect(fileRows.first().getByText(newFile.name)).toBeVisible();
  });

  test('should show empty state when no files are available', async ({ page }) => {
    // Override the default route for this test
    await page.route('**/api/files', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Reload to get empty state
    await page.reload();

    // Check empty state
    await expect(page.getByText(/no files uploaded yet/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /upload your first file/i })).toBeVisible();
  });

  test('should show upload progress during file upload', async ({ page }) => {
    // Mock upload with progress
    await page.route('**/api/files/upload', async (route, request) => {
      // Simulate progress events
      const data = await request.formData();
      const file = data.get('file') as File;

      // Create a mock response with progress
      const response = await fetch(route.request());
      const body = await response.text();

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: `progress-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }),
      });
    });

    // Upload test file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TEST_AUDIO_FILE);

    // Verify progress is shown
    await expect(page.getByText(/uploading/i)).toBeVisible();
    await expect(page.getByRole('progressbar')).toBeVisible();
  });
});
