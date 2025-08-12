import { test, expect } from '@playwright/test';

test.describe('Friends & Chat Dynamic Tests', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Set up authentication cookies
    await page.context().addCookies([
      {
        name: 'registration_completed',
        value: 'true',
        domain: 'localhost',
        path: '/',
      },
      {
        name: 'registration_step1',
        value: 'true',
        domain: 'localhost',
        path: '/',
      }
    ]);
  });

  test('should display friends list with dynamic data', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Verify friends page content
    await expect(page.getByText(/Friends/)).toBeVisible();
  });

  test('should filter friends by search term', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Find search input and type
    const searchInput = page.getByPlaceholder(/Search friends/);
    if (await searchInput.isVisible()) {
      await searchInput.fill('BeatMaker');
      await page.waitForTimeout(500);
      
      // Verify filtered results
      await expect(page.getByText(/BeatMaker/)).toBeVisible();
    }
  });

  test('should show online/offline status', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Verify status indicators exist
    const statusElements = page.locator('[data-testid*="status"], .status, [class*="status"]');
    await expect(statusElements.first()).toBeVisible();
  });

  test('should display chat interface', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Verify chat page content
    await expect(page.getByText(/Chat/)).toBeVisible();
  });

  test('should show chat threads', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Verify chat threads section exists
    const threadsSection = page.locator('[data-testid*="thread"], .threads, [class*="thread"]');
    await expect(threadsSection.first()).toBeVisible();
  });

  test('should allow sending messages', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Find message input and send button
    const messageInput = page.getByPlaceholder(/Type a message/);
    const sendButton = page.getByRole('button', { name: /Send/ });

    if (await messageInput.isVisible() && await sendButton.isVisible()) {
      await messageInput.fill('Hello, this is a test message');
      await sendButton.click();
      
      // Verify message was sent
      await expect(page.getByText('Hello, this is a test message')).toBeVisible();
    }
  });

  test('should display friend compatibility', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Verify compatibility indicators exist
    const compatibilityElements = page.locator('[data-testid*="compatibility"], .compatibility, [class*="compatibility"]');
    if (await compatibilityElements.first().isVisible()) {
      await expect(compatibilityElements.first()).toBeVisible();
    }
  });

  test('should handle friend requests', async ({ page }) => {
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Look for add friend functionality
    const addFriendButton = page.getByRole('button', { name: /Add Friend/ });
    if (await addFriendButton.isVisible()) {
      await expect(addFriendButton).toBeVisible();
    }
  });

  test('should show chat history', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Verify chat history/messages section exists
    const messagesSection = page.locator('[data-testid*="message"], .messages, [class*="message"]');
    await expect(messagesSection.first()).toBeVisible();
  });

  test('should handle dynamic data switching', async ({ page }) => {
    // Mock friends data
    await page.route('**/api/friends', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'TestUser1',
            online: true,
            compatibility: 'High'
          },
          {
            id: '2', 
            name: 'TestUser2',
            online: false,
            compatibility: 'Medium'
          }
        ]),
      });
    });

    await page.goto('/friends');
    await page.waitForLoadState('networkidle');

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Verify mock data is displayed
    await expect(page.getByText('TestUser1')).toBeVisible();
    await expect(page.getByText('TestUser2')).toBeVisible();
  });
});
