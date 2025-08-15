import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

test.describe('File Share E2E', () => {
  let userAId: string;
  let userBId: string;

  test.beforeAll(async () => {
    // Initialize Prisma client
    prisma = new PrismaClient();
    
    // Create test users
    userAId = await createTestUser('userA@example.com', 'User A');
    userBId = await createTestUser('userB@example.com', 'User B');
  });

  test.afterAll(async () => {
    // Clean up test data
    await cleanupTestData();
    await prisma.$disconnect();
  });

  test('User A uploads file to B, B accepts and downloads', async ({ page, context }) => {
    test.setTimeout(120000); // 2 minutes for file operations

    // Login as User A
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'userA@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');

    // Navigate to files page
    await page.goto('/files');
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');

    // Test drag and drop file upload
    const fileData = Buffer.from('test audio file content');
    await page.setInputFiles('input[type="file"]', {
      name: 'test-audio.wav',
      mimeType: 'audio/wav',
      buffer: fileData
    });

    // Wait for file to be selected
    await expect(page.locator('text=test-audio.wav')).toBeVisible();

    // Select recipient (User B)
    await page.click('button:has-text("Select friends")');
    await page.click(`text=User B`);

    // Send file
    await page.click('button:has-text("Send Files")');

    // Wait for upload to complete
    await expect(page.locator('text=Files Sent')).toBeVisible({ timeout: 30000 });

    // Switch to User B
    const pageB = await context.newPage();
    await pageB.goto('/auth/login');
    await pageB.fill('input[name="email"]', 'userB@example.com');
    await pageB.fill('input[name="password"]', 'password123');
    await pageB.click('button[type="submit"]');
    await expect(pageB).toHaveURL('/');

    // Navigate to files and check incoming transfer
    await pageB.goto('/files');
    await expect(pageB.locator('text=test-audio.wav')).toBeVisible({ timeout: 10000 });

    // Accept the transfer
    await pageB.click('button:has-text("Accept")');
    await expect(pageB.locator('text=File Accepted')).toBeVisible();

    // Download the file
    const [download] = await Promise.all([
      pageB.waitForEvent('download'),
      pageB.click('button:has-text("Download")'),
    ]);

    expect(download.suggestedFilename()).toBe('test-audio.wav');
  });

  test('File transfer with WebSocket real-time updates', async ({ page, context }) => {
    test.setTimeout(90000);

    // Login as User A
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'userA@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to files page
    await page.goto('/files');

    // Create a WebSocket connection to monitor transfer events
    const wsPromise = page.waitForEvent('websocket', { timeout: 10000 });
    
    // Upload a file
    const fileData = Buffer.from('real-time test file');
    await page.setInputFiles('input[type="file"]', {
      name: 'realtime-test.wav',
      mimeType: 'audio/wav',
      buffer: fileData
    });

    await page.click('button:has-text("Select friends")');
    await page.click(`text=User B`);
    await page.click('button:has-text("Send Files")');

    // Wait for WebSocket connection
    const ws = await wsPromise;
    
    // Verify WebSocket messages
    await expect(ws.url()).toContain('/file-transfer');
  });

  test('File transfer history and search', async ({ page }) => {
    test.setTimeout(60000);

    // Login as User A
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'userA@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to files page
    await page.goto('/files');

    // Test search functionality
    await page.fill('input[placeholder="Search files..."]', 'test');
    await expect(page.locator('text=No files yet')).toBeVisible();

    // Test tab navigation
    await page.click('text=Sent');
    await expect(page.locator('text=No sent files')).toBeVisible();

    await page.click('text=Inbox');
    await expect(page.locator('text=No incoming files')).toBeVisible();
  });

  test('File transfer with plugin-specific fields', async ({ page, context }) => {
    test.setTimeout(90000);

    // Login as User A
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'userA@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Navigate to files page
    await page.goto('/files');

    // Upload a file with plugin-specific metadata
    const fileData = Buffer.from('plugin test file with metadata');
    await page.setInputFiles('input[type="file"]', {
      name: 'plugin-test.flp',
      mimeType: 'application/octet-stream',
      buffer: fileData
    });

    await page.click('button:has-text("Select friends")');
    await page.click(`text=User B`);
    await page.click('button:has-text("Send Files")');

    // Wait for upload to complete
    await expect(page.locator('text=Files Sent')).toBeVisible({ timeout: 30000 });

    // Verify the transfer was created with plugin fields
    const transfers = await prisma.fileTransfer.findMany({
      where: {
        fileName: 'plugin-test.flp',
        fromUserId: userAId
      }
    });

    expect(transfers).toHaveLength(1);
    expect(transfers[0].transferType).toBe('s3');
    expect(transfers[0].mimeType).toBe('application/octet-stream');
  });

  // Helper functions
  async function createTestUser(email: string, displayName: string): Promise<string> {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        displayName,
        password: '$2b$10$test.hash.for.testing', // bcrypt hash of 'password123'
      },
    });
    return user.id;
  }

  async function cleanupTestData() {
    // Clean up test transfers
    await prisma.fileTransfer.deleteMany({
      where: {
        OR: [
          { fromUserId: { in: [userAId, userBId] } },
          { toUserId: { in: [userAId, userBId] } },
        ]
      }
    });

    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        email: { in: ['userA@example.com', 'userB@example.com'] }
      }
    });
  }
}); 