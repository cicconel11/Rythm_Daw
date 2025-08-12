import { test, expect } from '@playwright/test';

test.describe('Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ user: { id: '1', name: 'Test User' } }));
    });
    
    // Mock conversations API
    await page.route('/api/chat/conversations', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            participants: ['user1', 'beatmaker99'],
            lastMessage: {
              id: '1',
              content: 'Hey, check out this new track!',
              sender: 'beatmaker99',
              timestamp: '2024-01-15T10:30:00Z',
              type: 'text'
            },
            unreadCount: 1,
            updatedAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            participants: ['user1', 'producerx'],
            lastMessage: {
              id: '2',
              content: 'Sounds great! Can you share the project file?',
              sender: 'producerx',
              timestamp: '2024-01-15T10:35:00Z',
              type: 'text'
            },
            unreadCount: 0,
            updatedAt: '2024-01-15T10:35:00Z'
          }
        ])
      });
    });
    
    // Mock messages API
    await page.route('/api/chat/conversations/*/messages', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            content: 'Hey, check out this new track!',
            sender: 'beatmaker99',
            timestamp: '2024-01-15T10:30:00Z',
            type: 'text'
          },
          {
            id: '2',
            content: 'Sounds great! Can you share the project file?',
            sender: 'producerx',
            timestamp: '2024-01-15T10:35:00Z',
            type: 'text'
          }
        ])
      });
    });
    
    await page.goto('/chat');
  });

  test('should display conversations list', async ({ page }) => {
    await expect(page.getByText('Chat')).toBeVisible();
    await expect(page.getByText('Conversations')).toBeVisible();
    
    // Verify conversation items
    await expect(page.getByText('beatmaker99')).toBeVisible();
    await expect(page.getByText('producerx')).toBeVisible();
  });

  test('should show conversation details', async ({ page }) => {
    // Check last message previews
    await expect(page.getByText('Hey, check out this new track!')).toBeVisible();
    await expect(page.getByText('Sounds great! Can you share the project file?')).toBeVisible();
    
    // Check unread count
    await expect(page.getByText('1')).toBeVisible();
  });

  test('should select conversation and display messages', async ({ page }) => {
    // Click on first conversation
    await page.getByText('beatmaker99').click();
    
    // Should show messages
    await expect(page.getByText('Hey, check out this new track!')).toBeVisible();
    await expect(page.getByText('beatmaker99')).toBeVisible();
  });

  test('should send message', async ({ page }) => {
    // Mock send message API
    await page.route('/api/chat/conversations/*/messages', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-message',
            content: 'Test message',
            sender: 'user1',
            timestamp: new Date().toISOString(),
            type: 'text'
          })
        });
      } else {
        await route.continue();
      }
    });
    
    // Select conversation
    await page.getByText('beatmaker99').click();
    
    // Type and send message
    await page.getByPlaceholder('Type a message...').fill('Test message');
    await page.getByRole('button', { name: /send/i }).click();
    
    // Should show sent message
    await expect(page.getByText('Test message')).toBeVisible();
  });

  test('should handle message input validation', async ({ page }) => {
    // Select conversation
    await page.getByText('beatmaker99').click();
    
    // Try to send empty message
    const sendButton = page.getByRole('button', { name: /send/i });
    await expect(sendButton).toBeDisabled();
    
    // Type message
    await page.getByPlaceholder('Type a message...').fill('Valid message');
    await expect(sendButton).toBeEnabled();
  });

  test('should show loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('/api/chat/conversations', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    await page.goto('/chat');
    
    // Should show skeletons while loading
    await expect(page.locator('.skeleton')).toBeVisible();
  });

  test('should handle conversation switching', async ({ page }) => {
    // Select first conversation
    await page.getByText('beatmaker99').click();
    await expect(page.getByText('Hey, check out this new track!')).toBeVisible();
    
    // Switch to second conversation
    await page.getByText('producerx').click();
    await expect(page.getByText('Sounds great! Can you share the project file?')).toBeVisible();
  });

  test('should display message timestamps', async ({ page }) => {
    // Select conversation
    await page.getByText('beatmaker99').click();
    
    // Should show timestamps
    await expect(page.getByText(/10:30/)).toBeVisible();
    await expect(page.getByText(/10:35/)).toBeVisible();
  });

  test('should show empty state when no conversation selected', async ({ page }) => {
    // Should show empty state initially
    await expect(page.getByText('Select a conversation to start chatting')).toBeVisible();
  });

  test('should handle send message errors', async ({ page }) => {
    // Mock send message error
    await page.route('/api/chat/conversations/*/messages', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Failed to send message' })
        });
      } else {
        await route.continue();
      }
    });
    
    // Select conversation
    await page.getByText('beatmaker99').click();
    
    // Try to send message
    await page.getByPlaceholder('Type a message...').fill('Test message');
    await page.getByRole('button', { name: /send/i }).click();
    
    // Should show error toast
    await expect(page.getByText('Message Failed')).toBeVisible();
  });

  test('should show unread message indicators', async ({ page }) => {
    // Check unread badge
    const unreadBadge = page.locator('.badge').first();
    await expect(unreadBadge).toContainText('1');
  });

  test('should handle real-time message updates', async ({ page }) => {
    // Select conversation
    await page.getByText('beatmaker99').click();
    
    // Simulate new message via WebSocket
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'chat:new_message',
            data: {
              conversationId: '1',
              message: {
                id: 'new-message',
                content: 'Real-time message!',
                sender: 'beatmaker99',
                timestamp: new Date().toISOString(),
                type: 'text'
              }
            }
          })
        })
      );
    });
    
    // Should show new message
    await expect(page.getByText('Real-time message!')).toBeVisible();
  });
});
