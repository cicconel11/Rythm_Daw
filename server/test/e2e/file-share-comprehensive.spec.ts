import { test, expect } from '@playwright/test';
import { FileSharingHelper, TEST_USERS, TEST_FILES, TestUser } from './helpers/file-sharing.helper';

test.describe('File Share Comprehensive E2E', () => {
  let userA: TestUser;
  let userB: TestUser;

  test.beforeAll(async () => {
    userA = await FileSharingHelper.createTestUser(TEST_USERS.USER_A.email, TEST_USERS.USER_A.displayName);
    userB = await FileSharingHelper.createTestUser(TEST_USERS.USER_B.email, TEST_USERS.USER_B.displayName);
  });

  test.afterAll(async () => {
    await FileSharingHelper.cleanupTestData([userA.id, userB.id]);
  });

  test('Complete file transfer workflow', async ({ page, context }) => {
    test.setTimeout(120000);

    await FileSharingHelper.loginUser(page, userA.email);
    await FileSharingHelper.navigateToFileShare(page);
    await FileSharingHelper.uploadFile(page, TEST_FILES.AUDIO_WAV);
    await FileSharingHelper.selectRecipient(page, userB.displayName);
    await FileSharingHelper.sendFiles(page);

    const pageB = await context.newPage();
    await FileSharingHelper.loginUser(pageB, userB.email);
    await FileSharingHelper.navigateToFileShare(pageB);
    await expect(pageB.locator(`text=${TEST_FILES.AUDIO_WAV.name}`)).toBeVisible({ timeout: 10000 });
    await FileSharingHelper.acceptTransfer(pageB);
    const download = await FileSharingHelper.downloadFile(pageB);
    expect(download.suggestedFilename()).toBe(TEST_FILES.AUDIO_WAV.name);
  });

  test('Multiple file types', async ({ page }) => {
    test.setTimeout(90000);

    await FileSharingHelper.loginUser(page, userA.email);
    await FileSharingHelper.navigateToFileShare(page);

    const files = [TEST_FILES.AUDIO_WAV, TEST_FILES.MIDI_FILE, TEST_FILES.PROJECT_FILE];
    
    for (const file of files) {
      await FileSharingHelper.uploadFile(page, file);
    }

    for (const file of files) {
      await expect(page.locator(`text=${file.name}`)).toBeVisible();
    }

    await FileSharingHelper.selectRecipient(page, userB.displayName);
    await FileSharingHelper.sendFiles(page);
  });

  test('File search and filtering', async ({ page }) => {
    test.setTimeout(60000);

    await FileSharingHelper.loginUser(page, userA.email);
    await FileSharingHelper.navigateToFileShare(page);

    await FileSharingHelper.searchFiles(page, 'nonexistent');
    await expect(page.locator('text=No files yet')).toBeVisible();

    await FileSharingHelper.switchToTab(page, 'inbox');
    await expect(page.locator('text=No incoming files')).toBeVisible();

    await FileSharingHelper.switchToTab(page, 'sent');
    await expect(page.locator('text=No sent files')).toBeVisible();
  });
});
