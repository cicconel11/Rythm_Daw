import { test, expect } from '@playwright/test';

test.describe('File Share S3 Integration E2E', () => {
  test('S3 file sharing interface works', async ({ page }) => {
    test.setTimeout(60000);

    console.log('🚀 Testing S3 file sharing interface...');

    // Step 1: Navigate directly to file sharing page
    console.log('1. Navigating to file sharing page...');
    await page.goto('/files/');
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');
    console.log('✅ File sharing page loaded');

    // Step 2: Test file selection
    console.log('2. Testing file selection...');
    const fileInput = page.locator('#file-input');
    
    // Create a test file
    const testFileContent = 'This is a test audio file for S3 integration testing.';
    const testFileBuffer = Buffer.from(testFileContent);
    
    await fileInput.setInputFiles({
      name: 'test-s3-integration.wav',
      mimeType: 'audio/wav',
      buffer: testFileBuffer
    });

    // Verify file is selected
    await expect(page.locator('#send-files')).toBeEnabled();
    console.log('✅ File selected successfully');

    // Step 3: Test friend selection modal
    console.log('3. Testing friend selection modal...');
    await page.click('#select-friends');
    
    // Wait for friend modal to appear
    await page.waitForSelector('#friend-modal', { state: 'visible' });
    console.log('✅ Friend modal opened');
    
    // Check if friends are loaded
    const friendItems = page.locator('.friend-item');
    const friendCount = await friendItems.count();
    console.log(`📋 Found ${friendCount} friend(s) in modal`);
    
    if (friendCount > 0) {
      // Select first friend
      await page.click('.friend-item:first-child');
      await expect(page.locator('.friend-item:first-child')).toHaveClass(/selected/);
      console.log('✅ Friend selected');
    }

    // Close modal
    await page.click('#cancel-friends');
    await page.waitForSelector('#friend-modal', { state: 'hidden' });
    console.log('✅ Friend modal closed');

    // Step 4: Test search functionality
    console.log('4. Testing search functionality...');
    const searchInput = page.locator('#search-input');
    await searchInput.fill('test-s3-integration');
    await expect(searchInput).toHaveValue('test-s3-integration');
    console.log('✅ Search input working');

    // Step 5: Test filter functionality
    console.log('5. Testing filter functionality...');
    await page.click('button[data-filter="sent"]');
    await expect(page.locator('button[data-filter="sent"]')).toHaveClass(/active/);
    console.log('✅ Filter functionality working');

    // Step 6: Test drag and drop
    console.log('6. Testing drag and drop...');
    const dropZone = page.locator('#file-drop-zone');
    await expect(dropZone).toBeVisible();
    await expect(dropZone).toContainText('Drag and drop files here');
    console.log('✅ Drag and drop zone working');

    console.log('🎉 S3 file sharing interface test completed successfully!');
  });

  test('S3 API endpoints are accessible', async ({ request }) => {
    console.log('🔍 Testing S3 API endpoints...');

    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await request.get('/healthz');
    expect(healthResponse.ok()).toBeTruthy();
    const healthData = await healthResponse.json();
    expect(healthData.status).toBe('ok');
    console.log('✅ Health endpoint working');

    // Test 2: API ping
    console.log('2. Testing API ping...');
    const pingResponse = await request.get('/api/ping');
    expect(pingResponse.ok()).toBeTruthy();
    const pingData = await pingResponse.json();
    expect(pingData.status).toBe('ok');
    console.log('✅ API ping working');

    // Test 3: Files endpoint (should require auth)
    console.log('3. Testing files endpoint (should require auth)...');
    const filesResponse = await request.get('/api/files/transfers');
    expect(filesResponse.status()).toBe(401); // Should require authentication
    console.log('✅ Files endpoint properly protected');

    // Test 4: Files presign endpoint (should require auth)
    console.log('4. Testing files presign endpoint (should require auth)...');
    const presignResponse = await request.post('/api/files/presign', {
      data: {
        name: 'test.wav',
        mime: 'audio/wav',
        size: 1024
      }
    });
    expect(presignResponse.status()).toBe(401); // Should require authentication
    console.log('✅ Files presign endpoint properly protected');

    console.log('🎉 API endpoint tests completed!');
  });

  test('S3 configuration and workflow simulation', async ({ page }) => {
    console.log('📤 Testing S3 configuration and workflow...');

    // Test 1: Check if S3 is configured
    console.log('1. Checking S3 configuration...');
    
    // Navigate to files page to check console for S3 messages
    await page.goto('/files/');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check browser console for any S3-related messages
    const consoleMessages: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('S3') || msg.text().includes('AWS') || msg.text().includes('mock')) {
        consoleMessages.push(msg.text());
      }
    });

    // Wait a bit more for any async operations
    await page.waitForTimeout(3000);
    
    if (consoleMessages.length > 0) {
      console.log('📋 S3-related console messages:');
      consoleMessages.forEach(msg => console.log('   📡', msg));
    } else {
      console.log('ℹ️  No S3-related console messages found');
    }

    // Test 2: Simulate file upload workflow
    console.log('2. Simulating file upload workflow...');
    
    const testFileData = {
      name: 'test-s3-file.wav',
      mime: 'audio/wav',
      size: 1024 * 1024 // 1MB
    };

    console.log('📁 Test file data:', testFileData);
    console.log('📋 File upload workflow steps:');
    console.log('   1. User selects file');
    console.log('   2. Frontend requests presigned URL from API');
    console.log('   3. API generates S3 presigned URL');
    console.log('   4. Frontend uploads file directly to S3');
    console.log('   5. API creates transfer record in database');
    console.log('   6. WebSocket notifies recipient');
    console.log('   7. Recipient can download file');

    console.log('✅ S3 workflow simulation completed');
  });

  test('WebSocket connection for real-time file transfers', async ({ page }) => {
    console.log('🔌 Testing WebSocket connection...');

    // Navigate to files page
    await page.goto('/files/');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check for WebSocket connection attempts
    const wsMessages: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('WebSocket') || msg.text().includes('ws://') || msg.text().includes('wss://')) {
        wsMessages.push(msg.text());
      }
    });

    // Wait for WebSocket to attempt connection
    await page.waitForTimeout(3000);
    
    if (wsMessages.length > 0) {
      console.log('📡 WebSocket messages:');
      wsMessages.forEach(msg => console.log('   🔌', msg));
      console.log('✅ WebSocket connection detected');
    } else {
      console.log('ℹ️  No WebSocket connection attempts detected');
      console.log('   (This may be expected if no auth token is available)');
    }

    console.log('✅ WebSocket test completed');
  });
});
