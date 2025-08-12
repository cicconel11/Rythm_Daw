import { test, expect } from '@playwright/test';

test.describe('Friends', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ user: { id: '1', name: 'Test User' } }));
    });
    
    // Mock friends API
    await page.route('/api/friends', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            user: { id: '2', username: 'beatmaker99', displayName: 'BeatMaker99', status: 'online' },
            mutualFriends: ['producerx'],
            compatibility: 85,
            sharedPlugins: ['Serum', 'FabFilter Pro-Q 3']
          },
          {
            id: '2',
            user: { id: '3', username: 'producerx', displayName: 'ProducerX', status: 'offline' },
            mutualFriends: ['beatmaker99'],
            compatibility: 72,
            sharedPlugins: ['Serum']
          }
        ])
      });
    });
    
    // Mock friend requests API
    await page.route('/api/friends/requests', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', from: 'synthmaster', to: 'user1', status: 'pending', createdAt: '2024-01-15T09:00:00Z', message: 'Let\'s collaborate!' }
        ])
      });
    });
    
    await page.goto('/friends');
  });

  test('should display friends list', async ({ page }) => {
    await expect(page.getByText('Friends')).toBeVisible();
    
    // Verify friend names
    await expect(page.getByText('BeatMaker99')).toBeVisible();
    await expect(page.getByText('ProducerX')).toBeVisible();
  });

  test('should show online/offline status', async ({ page }) => {
    // Check online status
    await expect(page.getByText('online')).toBeVisible();
    await expect(page.getByText('offline')).toBeVisible();
    
    // Check status indicators
    await expect(page.locator('.status-online')).toBeVisible();
    await expect(page.locator('.status-offline')).toBeVisible();
  });

  test('should display compatibility badges', async ({ page }) => {
    // Check compatibility percentages
    await expect(page.getByText('85%')).toBeVisible();
    await expect(page.getByText('72%')).toBeVisible();
    
    // Check compatibility labels
    await expect(page.getByText('High Compatibility')).toBeVisible();
    await expect(page.getByText('Medium Compatibility')).toBeVisible();
  });

  test('should show shared plugins', async ({ page }) => {
    // Check shared plugins
    await expect(page.getByText('Serum')).toBeVisible();
    await expect(page.getByText('FabFilter Pro-Q 3')).toBeVisible();
  });

  test('should display friend requests', async ({ page }) => {
    // Check pending requests
    await expect(page.getByText('Friend Requests')).toBeVisible();
    await expect(page.getByText('synthmaster')).toBeVisible();
    await expect(page.getByText('Let\'s collaborate!')).toBeVisible();
  });

  test('should handle accepting friend request', async ({ page }) => {
    // Mock accept API
    await page.route('/api/friends/requests/*/accept', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Click accept button
    await page.getByTestId('accept-request-btn').click();
    
    // Should show success message
    await expect(page.getByText('Friend request accepted')).toBeVisible();
  });

  test('should handle rejecting friend request', async ({ page }) => {
    // Mock reject API
    await page.route('/api/friends/requests/*/reject', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Click reject button
    await page.getByTestId('reject-request-btn').click();
    
    // Should show success message
    await expect(page.getByText('Friend request rejected')).toBeVisible();
  });

  test('should search friends', async ({ page }) => {
    // Type in search box
    await page.getByPlaceholder('Search friends...').fill('Beat');
    
    // Should only show matching friends
    await expect(page.getByText('BeatMaker99')).toBeVisible();
    await expect(page.getByText('ProducerX')).not.toBeVisible();
  });

  test('should filter by online status', async ({ page }) => {
    // Click online filter
    await page.getByRole('button', { name: 'Online' }).click();
    
    // Should only show online friends
    await expect(page.getByText('BeatMaker99')).toBeVisible();
    await expect(page.getByText('ProducerX')).not.toBeVisible();
  });

  test('should show mutual friends', async ({ page }) => {
    // Click on a friend to see details
    await page.getByText('BeatMaker99').click();
    
    // Should show mutual friends
    await expect(page.getByText('Mutual Friends')).toBeVisible();
    await expect(page.getByText('producerx')).toBeVisible();
  });

  test('should handle collaboration CTA', async ({ page }) => {
    // Click collaborate button
    await page.getByTestId('collab-btn').first().click();
    
    // Should open collaboration modal
    await expect(page.getByText('Start Collaboration')).toBeVisible();
  });

  test('should show empty state when no friends', async ({ page }) => {
    // Mock empty friends list
    await page.route('/api/friends', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/friends');
    
    // Should show empty state
    await expect(page.getByText('No friends yet')).toBeVisible();
    await expect(page.getByText('Connect with other musicians')).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Mock paginated response
    await page.route('/api/friends', async route => {
      const url = new URL(route.request().url());
      const page = url.searchParams.get('page') || '1';
      
      if (page === '1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: '1', user: { id: '2', username: 'friend1', displayName: 'Friend 1', status: 'online' } }
          ])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: '2', user: { id: '3', username: 'friend2', displayName: 'Friend 2', status: 'offline' } }
          ])
        });
      }
    });
    
    // Click next page
    await page.getByRole('button', { name: 'Next' }).click();
    
    // Should show second page
    await expect(page.getByText('Friend 2')).toBeVisible();
  });
});
