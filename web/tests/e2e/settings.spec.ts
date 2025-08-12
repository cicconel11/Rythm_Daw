import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ user: { id: '1', name: 'Test User' } }));
    });
    
    // Mock current user API
    await page.route('/api/user/current', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          username: 'djproducer',
          displayName: 'DJ Producer',
          email: 'dj@example.com',
          bio: 'Professional music producer',
          avatar: 'https://example.com/avatar.jpg',
          status: 'online',
          lastSeen: '2024-01-15T10:00:00Z'
        })
      });
    });
    
    // Mock settings API
    await page.route('/api/settings', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          notifications: {
            email: true,
            push: true,
            sound: false
          },
          privacy: {
            profileVisibility: 'public',
            showOnlineStatus: true,
            allowFriendRequests: true
          },
          appearance: {
            theme: 'dark',
            compactMode: false
          }
        })
      });
    });
    
    // Mock plugins API
    await page.route('/api/plugins', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            name: 'Serum',
            type: 'Synthesizer',
            version: '1.365',
            status: 'Active',
            usage: '87%',
            lastUsed: '2024-01-15T09:00:00Z',
            size: 150000000
          },
          {
            id: 2,
            name: 'FabFilter Pro-Q 3',
            type: 'EQ',
            version: '3.24',
            status: 'Active',
            usage: '92%',
            lastUsed: '2024-01-15T08:30:00Z',
            size: 85000000
          },
          {
            id: 3,
            name: 'Ozone 10',
            type: 'Mastering',
            version: '10.1.0',
            status: 'Inactive',
            usage: '0%',
            lastUsed: null,
            size: 250000000
          }
        ])
      });
    });
    
    await page.goto('/settings');
  });

  test('should display user profile information', async ({ page }) => {
    await expect(page.getByText('Account Settings')).toBeVisible();
    
    // Verify user info is displayed
    await expect(page.getByDisplayValue('DJ Producer')).toBeVisible();
    await expect(page.getByDisplayValue('dj@example.com')).toBeVisible();
    await expect(page.getByDisplayValue('Professional music producer')).toBeVisible();
  });

  test('should update account information', async ({ page }) => {
    // Mock update API
    await page.route('/api/settings', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });
    
    // Update display name
    await page.getByLabel(/display name/i).fill('Updated DJ Producer');
    
    // Update bio
    await page.getByLabel(/bio/i).fill('Updated bio information');
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Should show success message
    await expect(page.getByText('Account Updated')).toBeVisible();
  });

  test('should handle account update errors', async ({ page }) => {
    // Mock update error
    await page.route('/api/settings', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Update failed' })
        });
      } else {
        await route.continue();
      }
    });
    
    // Try to update
    await page.getByLabel(/display name/i).fill('New Name');
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Should show error message
    await expect(page.getByText('Update Failed')).toBeVisible();
  });

  test('should display plugin list', async ({ page }) => {
    await expect(page.getByText('Installed Plugins')).toBeVisible();
    
    // Verify plugin information
    await expect(page.getByText('Serum')).toBeVisible();
    await expect(page.getByText('Synthesizer')).toBeVisible();
    await expect(page.getByText('v1.365')).toBeVisible();
    await expect(page.getByText('87% usage')).toBeVisible();
    
    await expect(page.getByText('FabFilter Pro-Q 3')).toBeVisible();
    await expect(page.getByText('EQ')).toBeVisible();
    await expect(page.getByText('v3.24')).toBeVisible();
    await expect(page.getByText('92% usage')).toBeVisible();
  });

  test('should filter plugins by status', async ({ page }) => {
    // Click on status filter
    await page.getByRole('button', { name: /active/i }).click();
    
    // Should only show active plugins
    await expect(page.getByText('Serum')).toBeVisible();
    await expect(page.getByText('FabFilter Pro-Q 3')).toBeVisible();
    await expect(page.getByText('Ozone 10')).not.toBeVisible();
  });

  test('should handle plugin rescan', async ({ page }) => {
    // Mock rescan API
    await page.route('/api/plugins/rescan', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });
    
    // Click rescan button
    await page.getByRole('button', { name: /rescan plugins/i }).click();
    
    // Should show success message
    await expect(page.getByText('Plugin Scan Complete')).toBeVisible();
  });

  test('should handle avatar upload', async ({ page }) => {
    // Mock avatar upload
    await page.route('/api/user/avatar', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          avatarUrl: 'https://example.com/new-avatar.jpg' 
        })
      });
    });
    
    // Upload avatar file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /upload avatar/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('test-files/avatar.jpg');
    
    // Should show success message
    await expect(page.getByText('Avatar Updated')).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('/api/settings', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/settings');
    
    // Should show skeletons while loading
    await expect(page.locator('.skeleton')).toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // Test email validation
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
    
    // Test display name validation
    await page.getByLabel(/email/i).fill('valid@example.com');
    await page.getByLabel(/display name/i).fill('');
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/display name is required/i)).toBeVisible();
  });

  test('should handle bio character limit', async ({ page }) => {
    const longBio = 'A'.repeat(501); // Exceed 500 character limit
    
    await page.getByLabel(/bio/i).fill(longBio);
    
    // Should show character count warning
    await expect(page.getByText(/500 characters maximum/i)).toBeVisible();
    
    // Should disable save button
    await expect(page.getByRole('button', { name: /save changes/i })).toBeDisabled();
  });

  test('should display notification settings', async ({ page }) => {
    // Verify notification toggles
    await expect(page.getByLabel(/email notifications/i)).toBeChecked();
    await expect(page.getByLabel(/push notifications/i)).toBeChecked();
    await expect(page.getByLabel(/sound notifications/i)).not.toBeChecked();
  });

  test('should update notification settings', async ({ page }) => {
    // Mock settings update
    await page.route('/api/settings', async route => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });
    
    // Toggle sound notifications
    await page.getByLabel(/sound notifications/i).check();
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Should show success message
    await expect(page.getByText('Account Updated')).toBeVisible();
  });

  test('should display privacy settings', async ({ page }) => {
    // Verify privacy options
    await expect(page.getByLabel(/public profile/i)).toBeChecked();
    await expect(page.getByLabel(/show online status/i)).toBeChecked();
    await expect(page.getByLabel(/allow friend requests/i)).toBeChecked();
  });

  test('should handle appearance settings', async ({ page }) => {
    // Verify theme selection
    await expect(page.getByLabel(/dark theme/i)).toBeChecked();
    await expect(page.getByLabel(/compact mode/i)).not.toBeChecked();
    
    // Toggle compact mode
    await page.getByLabel(/compact mode/i).check();
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Should show success message
    await expect(page.getByText('Account Updated')).toBeVisible();
  });

  test('should show plugin usage statistics', async ({ page }) => {
    // Verify usage statistics
    await expect(page.getByText('Total Plugins: 3')).toBeVisible();
    await expect(page.getByText('Active Plugins: 2')).toBeVisible();
    await expect(page.getByText('Inactive Plugins: 1')).toBeVisible();
  });

  test('should handle plugin search', async ({ page }) => {
    // Search for specific plugin
    await page.getByPlaceholder(/search plugins/i).fill('Serum');
    
    // Should only show matching plugin
    await expect(page.getByText('Serum')).toBeVisible();
    await expect(page.getByText('FabFilter Pro-Q 3')).not.toBeVisible();
  });

  test('should show plugin details on click', async ({ page }) => {
    // Click on plugin
    await page.getByText('Serum').click();
    
    // Should show detailed information
    await expect(page.getByText('Plugin Details')).toBeVisible();
    await expect(page.getByText('Version: 1.365')).toBeVisible();
    await expect(page.getByText('Size: 150 MB')).toBeVisible();
    await expect(page.getByText('Last Used: 2024-01-15')).toBeVisible();
  });
});
