import { test, expect } from '@playwright/test';

test.describe('History', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ user: { id: '1', name: 'Test User' } }));
    });
    
    // Mock activities API
    await page.route('/api/activities', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            type: 'plugin_scan',
            title: 'Plugin Scan Completed',
            description: 'Successfully scanned 15 plugins',
            timestamp: '2024-01-15T10:30:00Z',
            metadata: {
              pluginsFound: 15,
              newPlugins: 3,
              scanDuration: '2.5s'
            },
            status: 'completed'
          },
          {
            id: '2',
            type: 'file_upload',
            title: 'File Uploaded',
            description: 'Project Alpha.wav uploaded successfully',
            timestamp: '2024-01-15T10:25:00Z',
            metadata: {
              fileName: 'Project Alpha.wav',
              fileSize: 45200000,
              recipient: 'beatmaker99'
            },
            status: 'completed'
          },
          {
            id: '3',
            type: 'friend_request',
            title: 'Friend Request Sent',
            description: 'Friend request sent to producerx',
            timestamp: '2024-01-15T10:20:00Z',
            metadata: {
              recipient: 'producerx',
              message: 'Let\'s collaborate!'
            },
            status: 'pending'
          },
          {
            id: '4',
            type: 'chat_message',
            title: 'Message Sent',
            description: 'Message sent to beatmaker99',
            timestamp: '2024-01-15T10:15:00Z',
            metadata: {
              recipient: 'beatmaker99',
              messagePreview: 'Check out this new track!'
            },
            status: 'delivered'
          },
          {
            id: '5',
            type: 'plugin_usage',
            title: 'Plugin Used',
            description: 'Serum used in project',
            timestamp: '2024-01-15T10:10:00Z',
            metadata: {
              pluginName: 'Serum',
              projectName: 'New Track',
              usageDuration: '45m'
            },
            status: 'completed'
          }
        ])
      });
    });
    
    await page.goto('/history');
  });

  test('should display history page title', async ({ page }) => {
    await expect(page.getByText('History')).toBeVisible();
    await expect(page.getByText('View your activity timeline')).toBeVisible();
  });

  test('should display activity timeline', async ({ page }) => {
    // Verify activity items are displayed
    await expect(page.getByText('Plugin Scan Completed')).toBeVisible();
    await expect(page.getByText('File Uploaded')).toBeVisible();
    await expect(page.getByText('Friend Request Sent')).toBeVisible();
    await expect(page.getByText('Message Sent')).toBeVisible();
    await expect(page.getByText('Plugin Used')).toBeVisible();
  });

  test('should show activity details', async ({ page }) => {
    // Check activity descriptions
    await expect(page.getByText('Successfully scanned 15 plugins')).toBeVisible();
    await expect(page.getByText('Project Alpha.wav uploaded successfully')).toBeVisible();
    await expect(page.getByText('Friend request sent to producerx')).toBeVisible();
    await expect(page.getByText('Message sent to beatmaker99')).toBeVisible();
    await expect(page.getByText('Serum used in project')).toBeVisible();
  });

  test('should display activity timestamps', async ({ page }) => {
    // Check timestamps are displayed
    await expect(page.getByText(/10:30/)).toBeVisible();
    await expect(page.getByText(/10:25/)).toBeVisible();
    await expect(page.getByText(/10:20/)).toBeVisible();
    await expect(page.getByText(/10:15/)).toBeVisible();
    await expect(page.getByText(/10:10/)).toBeVisible();
  });

  test('should show activity status indicators', async ({ page }) => {
    // Check status badges
    await expect(page.getByText('completed')).toBeVisible();
    await expect(page.getByText('pending')).toBeVisible();
    await expect(page.getByText('delivered')).toBeVisible();
  });

  test('should filter activities by type', async ({ page }) => {
    // Click on plugin filter
    await page.getByRole('button', { name: /plugins/i }).click();
    
    // Should only show plugin-related activities
    await expect(page.getByText('Plugin Scan Completed')).toBeVisible();
    await expect(page.getByText('Plugin Used')).toBeVisible();
    await expect(page.getByText('File Uploaded')).not.toBeVisible();
  });

  test('should filter activities by status', async ({ page }) => {
    // Click on completed filter
    await page.getByRole('button', { name: /completed/i }).click();
    
    // Should only show completed activities
    await expect(page.getByText('Plugin Scan Completed')).toBeVisible();
    await expect(page.getByText('File Uploaded')).toBeVisible();
    await expect(page.getByText('Friend Request Sent')).not.toBeVisible();
  });

  test('should search activities', async ({ page }) => {
    // Type in search box
    await page.getByPlaceholder(/search activities/i).fill('Serum');
    
    // Should only show matching activities
    await expect(page.getByText('Plugin Used')).toBeVisible();
    await expect(page.getByText('Serum used in project')).toBeVisible();
    await expect(page.getByText('File Uploaded')).not.toBeVisible();
  });

  test('should show activity metadata', async ({ page }) => {
    // Click on activity to expand details
    await page.getByText('Plugin Scan Completed').click();
    
    // Should show metadata
    await expect(page.getByText('15 plugins found')).toBeVisible();
    await expect(page.getByText('3 new plugins')).toBeVisible();
    await expect(page.getByText('Scan duration: 2.5s')).toBeVisible();
  });

  test('should handle activity actions', async ({ page }) => {
    // Click on file upload activity
    await page.getByText('File Uploaded').click();
    
    // Should show action buttons
    await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /share/i })).toBeVisible();
  });

  test('should show loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('/api/activities', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/history');
    
    // Should show skeletons while loading
    await expect(page.locator('.skeleton')).toBeVisible();
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty activities
    await page.route('/api/activities', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/history');
    
    // Should show empty state
    await expect(page.getByText('No activity yet')).toBeVisible();
    await expect(page.getByText('Start using the app to see your activity here')).toBeVisible();
  });

  test('should handle pagination', async ({ page }) => {
    // Mock paginated response
    await page.route('/api/activities', async route => {
      const url = new URL(route.request().url());
      const page = url.searchParams.get('page') || '1';
      
      if (page === '1') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: '1', type: 'plugin_scan', title: 'Activity 1', timestamp: '2024-01-15T10:30:00Z' }
          ])
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: '2', type: 'file_upload', title: 'Activity 2', timestamp: '2024-01-15T10:25:00Z' }
          ])
        });
      }
    });
    
    // Click next page
    await page.getByRole('button', { name: /next/i }).click();
    
    // Should show second page
    await expect(page.getByText('Activity 2')).toBeVisible();
  });

  test('should export activity data', async ({ page }) => {
    // Mock export API
    await page.route('/api/activities/export', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ downloadUrl: '/api/activities/export/download' })
      });
    });
    
    // Click export button
    await page.getByRole('button', { name: /export/i }).click();
    
    // Should show export options
    await expect(page.getByText('Export Activities')).toBeVisible();
    await expect(page.getByRole('button', { name: /download csv/i })).toBeVisible();
  });

  test('should show activity statistics', async ({ page }) => {
    // Verify statistics cards
    await expect(page.getByText('Total Activities')).toBeVisible();
    await expect(page.getByText('5')).toBeVisible();
    
    await expect(page.getByText('Today')).toBeVisible();
    await expect(page.getByText('5')).toBeVisible();
    
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('5')).toBeVisible();
  });

  test('should handle real-time activity updates', async ({ page }) => {
    // Simulate new activity via WebSocket
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'activity:new',
            data: {
              id: 'new-activity',
              type: 'plugin_scan',
              title: 'New Plugin Scan',
              description: 'Real-time activity update',
              timestamp: new Date().toISOString(),
              status: 'completed'
            }
          })
        })
      );
    });
    
    // Should show new activity
    await expect(page.getByText('New Plugin Scan')).toBeVisible();
  });

  test('should handle activity errors', async ({ page }) => {
    // Mock API error
    await page.route('/api/activities', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to load activities' })
      });
    });
    
    await page.goto('/history');
    
    // Should show error message
    await expect(page.getByText(/error/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /retry/i })).toBeVisible();
  });

  test('should sort activities by date', async ({ page }) => {
    // Click on date sort
    await page.getByRole('button', { name: /date/i }).click();
    
    // Should sort activities (newest first)
    const activities = page.locator('[data-testid="activity-item"]');
    await expect(activities.first()).toContainText('10:30');
    await expect(activities.last()).toContainText('10:10');
  });

  test('should show activity categories', async ({ page }) => {
    // Verify category badges
    await expect(page.getByText('Plugin')).toBeVisible();
    await expect(page.getByText('File')).toBeVisible();
    await expect(page.getByText('Social')).toBeVisible();
    await expect(page.getByText('Chat')).toBeVisible();
  });
});
