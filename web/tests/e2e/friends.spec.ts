import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

test.describe('Friends Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Use authenticated state
    test.use({ storageState: 'tests/state.json' });

    // Mock API responses
    await page.route('**/api/friends', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Alex Johnson', status: 'online', lastSeen: new Date().toISOString() },
          {
            id: '2',
            name: 'Sam Wilson',
            status: 'offline',
            lastSeen: new Date(Date.now() - 3600000).toISOString(),
          },
          { id: '3', name: 'Taylor Swift', status: 'online', lastSeen: new Date().toISOString() },
        ]),
      });
    });

    // Navigate to friends page
    await page.goto('/friends');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Friends | Rythm/);
  });

  test('should display friends panel with online/offline status', async ({ page }) => {
    // Check for friends panel
    const friendsPanel = page.locator(selectors.friends.friendsPanel);
    await expect(friendsPanel).toBeVisible();

    // Check for friend items
    const friendItems = page.locator('[data-testid="friend-item"]');
    await expect(friendItems).toHaveCount(3);

    // Verify online/offline status
    await expect(page.getByText('Alex Johnson')).toBeVisible();
    await expect(page.getByText('Sam Wilson')).toBeVisible();
    await expect(page.getByText('Taylor Swift')).toBeVisible();

    // Check online badges
    const onlineBadges = page.locator(selectors.friends.onlineBadge);
    await expect(onlineBadges).toHaveCount(2); // 2 online friends
  });

  test('should update presence via WebSocket', async ({ page }) => {
    // Get initial online count
    const onlineBadges = page.locator(selectors.friends.onlineBadge);
    const initialOnlineCount = await onlineBadges.count();

    // Simulate WebSocket presence update
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'presence:update',
            data: {
              userId: '2',
              status: 'online',
              lastSeen: new Date().toISOString(),
            },
          }),
        })
      );
    });

    // Verify online badge count increased
    await expect(onlineBadges).toHaveCount(initialOnlineCount + 1);

    // Verify Sam Wilson is now online
    const samWilsonItem = page.locator('[data-testid="friend-item"]:has-text("Sam Wilson")');
    await expect(samWilsonItem.locator(selectors.friends.onlineBadge)).toBeVisible();
  });

  test('should show friend details on click', async ({ page }) => {
    // Click on first friend
    const firstFriend = page.locator('[data-testid="friend-item"]').first();
    await firstFriend.click();

    // Verify friend details modal/sidebar
    await expect(page.getByText(/friend details/i)).toBeVisible();
    await expect(page.getByText('Alex Johnson')).toBeVisible();
  });

  test('should allow adding new friends', async ({ page }) => {
    // Check for add friend button
    const addFriendBtn = page.getByRole('button', { name: /add friend/i });
    await expect(addFriendBtn).toBeVisible();

    // Mock add friend API
    await page.route('**/api/friends/add', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '4',
          name: 'New Friend',
          status: 'online',
          lastSeen: new Date().toISOString(),
        }),
      });
    });

    // Click add friend
    await addFriendBtn.click();

    // Fill friend search
    const searchInput = page.getByPlaceholder(/enter username or email/i);
    await searchInput.fill('newfriend@example.com');
    await page.getByRole('button', { name: /send request/i }).click();

    // Verify friend request sent
    await expect(page.getByText(/friend request sent/i)).toBeVisible();
  });

  test('should show pending friend requests', async ({ page }) => {
    // Mock pending requests
    await page.route('**/api/friends/pending', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '5', name: 'Pending Friend', requestedAt: new Date().toISOString() },
        ]),
      });
    });

    // Click pending requests tab
    await page.getByRole('tab', { name: /pending/i }).click();

    // Verify pending request
    await expect(page.getByText('Pending Friend')).toBeVisible();
    await expect(page.getByRole('button', { name: /accept/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /decline/i })).toBeVisible();
  });

  test('should allow accepting friend requests', async ({ page }) => {
    // Mock accept API
    await page.route('**/api/friends/accept/*', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Navigate to pending requests
    await page.getByRole('tab', { name: /pending/i }).click();

    // Accept first request
    await page
      .getByRole('button', { name: /accept/i })
      .first()
      .click();

    // Verify request accepted
    await expect(page.getByText(/friend request accepted/i)).toBeVisible();
  });

  test('should show friend activity', async ({ page }) => {
    // Click on friend to view activity
    const firstFriend = page.locator('[data-testid="friend-item"]').first();
    await firstFriend.click();

    // Check for activity section
    await expect(page.getByText(/recent activity/i)).toBeVisible();

    // Verify activity items
    const activityItems = page.locator('[data-testid="friend-activity-item"]');
    await expect(activityItems).toHaveCount(0); // Initially empty
  });

  test('should allow messaging friends', async ({ page }) => {
    // Click on friend to open chat
    const firstFriend = page.locator('[data-testid="friend-item"]').first();
    await firstFriend.click();

    // Click message button
    await page.getByRole('button', { name: /message/i }).click();

    // Verify chat interface opens
    await expect(page.getByText(/chat with alex johnson/i)).toBeVisible();
    await expect(page.locator('[data-testid="message-input"]')).toBeVisible();
  });

  test('should show friend suggestions', async ({ page }) => {
    // Mock suggestions API
    await page.route('**/api/friends/suggestions', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: '6', name: 'Suggested Friend', mutualFriends: 3 }]),
      });
    });

    // Check for suggestions section
    await expect(page.getByText(/people you may know/i)).toBeVisible();

    // Verify suggestion
    await expect(page.getByText('Suggested Friend')).toBeVisible();
    await expect(page.getByText(/3 mutual friends/i)).toBeVisible();
  });

  test('should handle friend removal', async ({ page }) => {
    // Mock remove friend API
    await page.route('**/api/friends/remove/*', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Click on friend options
    const firstFriend = page.locator('[data-testid="friend-item"]').first();
    await firstFriend.locator('[data-testid="friend-options"]').click();

    // Click remove friend
    await page.getByRole('button', { name: /remove friend/i }).click();

    // Confirm removal
    await page.getByRole('button', { name: /confirm/i }).click();

    // Verify friend removed
    await expect(page.getByText(/friend removed/i)).toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/friends', route => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
          resolve();
        }, 1000);
      });
    });

    // Reload to trigger loading
    await page.reload();

    // Verify loading state
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.getByText(/loading friends/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/friends', route => {
      return route.fulfill({
        status: 500,
        body: 'Internal Server Error',
      });
    });

    // Reload to trigger error
    await page.reload();

    // Verify error state
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/failed to load friends/i)).toBeVisible();

    // Verify retry button
    const retryBtn = page.getByRole('button', { name: /retry/i });
    await expect(retryBtn).toBeVisible();
    await expect(retryBtn).toBeEnabled();
  });
});
