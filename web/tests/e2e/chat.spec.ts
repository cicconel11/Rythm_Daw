import { test, expect } from '@playwright/test';

test.describe('Chat', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authentication cookies before navigation
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

    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem('auth', JSON.stringify({ 
        user: { id: '1', name: 'Test User' },
        isAuthenticated: true 
      }));
    });
    
    await page.goto('/chat');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display conversations list', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Use role selector to be more specific about which "Chat" we want
    await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
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
    // Click on first conversation - use first() to avoid strict mode violation
    await page.getByText('beatmaker99').first().click();
    
    // Should show messages
    await expect(page.getByText('Hey, check out this new track!')).toBeVisible();
    // Check for sender name in message area (more specific) - use first() to avoid strict mode
    await expect(page.locator('.space-y-4').getByText('beatmaker99').first()).toBeVisible();
  });

  test('should display send message interface', async ({ page }) => {
    // Select conversation
    await page.getByText('beatmaker99').first().click();
    
    // Should show message input interface
    await expect(page.getByPlaceholder('Type a message...')).toBeVisible();
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible();
  });

  test('should handle message input validation', async ({ page }) => {
    // Select conversation
    await page.getByText('beatmaker99').first().click();
    
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
    
    // Should show skeletons while loading - use first() to avoid strict mode
    await expect(page.locator('.skeleton').first()).toBeVisible();
  });

  test('should handle conversation switching', async ({ page }) => {
    // Select first conversation
    await page.getByText('beatmaker99').first().click();
    await expect(page.getByText('Hey, check out this new track!')).toBeVisible();
    
    // Switch to second conversation
    await page.getByText('producerx').first().click();
    await expect(page.getByText('Sounds great! Can you share the project file?')).toBeVisible();
  });

  test('should display message content', async ({ page }) => {
    // Select conversation
    await page.getByText('beatmaker99').first().click();
    
    // Should show message content in the message area
    await expect(page.getByText('Hey, check out this new track!')).toBeVisible();
    await expect(page.getByText('Sounds great! Can you share the project file?')).toBeVisible();
  });

  test('should show empty state when no conversation selected', async ({ page }) => {
    // Should show empty state initially
    await expect(page.getByText('Select a conversation to start chatting')).toBeVisible();
  });

  test('should show unread message indicators', async ({ page }) => {
    // Check unread badge
    const unreadBadge = page.locator('.badge').first();
    await expect(unreadBadge).toContainText('1');
  });

  test('should display basic chat interface', async ({ page }) => {
    // Verify that the chat interface loads with expected elements
    await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible();
    await expect(page.getByText('Connect with your team and collaborators')).toBeVisible();
    
    // Verify that conversations are displayed
    await expect(page.getByText('Conversations')).toBeVisible();
    
    // Verify empty state message when no conversation is selected
    await expect(page.getByText('Select a conversation to start chatting')).toBeVisible();
  });
});
