import { Page, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TestUser {
  id: string;
  email: string;
  displayName: string;
}

export interface TestFile {
  name: string;
  mimeType: string;
  content: string;
  size: number;
}

export class FileSharingHelper {
  static async createTestUser(email: string, displayName: string): Promise<TestUser> {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        displayName,
        password: '$2b$10$test.hash.for.testing', // bcrypt hash of 'password123'
        username: email.split('@')[0],
      },
    });
    return { id: user.id, email: user.email, displayName: user.displayName || '' };
  }

  static async cleanupTestData(userIds: string[]) {
    // Clean up test transfers
    await prisma.fileTransfer.deleteMany({
      where: {
        OR: [
          { fromUserId: { in: userIds } },
          { toUserId: { in: userIds } },
        ]
      }
    });

    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        id: { in: userIds }
      }
    });
  }

  static async loginUser(page: Page, email: string, password: string = 'password123') {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  }

  static async navigateToFileShare(page: Page) {
    await page.goto('/files');
    await expect(page.locator('h1')).toContainText('Studio Hub - File Share');
  }

  static async uploadFile(page: Page, file: TestFile) {
    await page.setInputFiles('input[type="file"]', {
      name: file.name,
      mimeType: file.mimeType,
      buffer: Buffer.from(file.content)
    });

    // Wait for file to be selected
    await expect(page.locator(`text=${file.name}`)).toBeVisible();
  }

  static async selectRecipient(page: Page, recipientName: string) {
    await page.click('button:has-text("Select friends")');
    await page.click(`text=${recipientName}`);
  }

  static async sendFiles(page: Page) {
    await page.click('button:has-text("Send Files")');
    await expect(page.locator('text=Files Sent')).toBeVisible({ timeout: 30000 });
  }

  static async acceptTransfer(page: Page) {
    await page.click('button:has-text("Accept")');
    await expect(page.locator('text=File Accepted')).toBeVisible();
  }

  static async declineTransfer(page: Page) {
    await page.click('button:has-text("Decline")');
    await expect(page.locator('text=File Declined')).toBeVisible();
  }

  static async downloadFile(page: Page) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button:has-text("Download")'),
    ]);
    return download;
  }

  static async searchFiles(page: Page, query: string) {
    await page.fill('input[placeholder="Search files..."]', query);
  }

  static async switchToTab(page: Page, tabName: 'inbox' | 'sent' | 'all') {
    await page.click(`text=${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  }

  static getTestFiles(): TestFile[] {
    return [
      {
        name: 'test-audio.wav',
        mimeType: 'audio/wav',
        content: 'test audio file content',
        size: 23
      },
      {
        name: 'test-midi.mid',
        mimeType: 'audio/midi',
        content: 'test midi file content',
        size: 22
      },
      {
        name: 'test-project.flp',
        mimeType: 'application/octet-stream',
        content: 'test fl studio project content',
        size: 32
      },
      {
        name: 'test-stem.wav',
        mimeType: 'audio/wav',
        content: 'test audio stem content',
        size: 25
      }
    ];
  }

  static async verifyTransferInDatabase(fileName: string, fromUserId: string, toUserId: string) {
    const transfers = await prisma.fileTransfer.findMany({
      where: {
        fileName,
        fromUserId,
        toUserId
      }
    });

    expect(transfers).toHaveLength(1);
    expect(transfers[0].status).toBe('pending');
    expect(transfers[0].transferType).toBe('s3');
    
    return transfers[0];
  }

  static async waitForWebSocketConnection(page: Page, timeout: number = 10000) {
    return page.waitForEvent('websocket', { timeout });
  }

  static async verifyFileIcon(page: Page, fileName: string, expectedIcon: string) {
    const fileElement = page.locator(`text=${fileName}`).first();
    await expect(fileElement.locator(`svg[class*="${expectedIcon}"]`)).toBeVisible();
  }
}

export const TEST_USERS = {
  USER_A: { email: 'userA@example.com', displayName: 'User A' },
  USER_B: { email: 'userB@example.com', displayName: 'User B' },
  USER_C: { email: 'userC@example.com', displayName: 'User C' },
};

export const TEST_FILES = {
  AUDIO_WAV: { name: 'test-audio.wav', mimeType: 'audio/wav', content: 'test audio content', size: 23 },
  MIDI_FILE: { name: 'test-midi.mid', mimeType: 'audio/midi', content: 'test midi content', size: 22 },
  PROJECT_FILE: { name: 'test-project.flp', mimeType: 'application/octet-stream', content: 'test project content', size: 32 },
  LARGE_FILE: { name: 'large-audio.wav', mimeType: 'audio/wav', content: 'x'.repeat(1024 * 1024), size: 1024 * 1024 }, // 1MB
};
