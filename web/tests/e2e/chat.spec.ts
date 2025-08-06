import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

test.describe('Chat Page', () => {
  test.describe.configure({ retries: 2 });

  test.use({ storageState: 'tests/state.json' });

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/chat/threads', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'Alex Johnson',
            lastMessage: 'Hey there!',
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Sam Wilson',
            lastMessage: "How's the project going?",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
        ]),
      });
    });

    await page.route('**/api/chat/messages/*', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            sender: 'Alex Johnson',
            message: 'Hey there!',
            timestamp: new Date().toISOString(),
          },
          { id: '2', sender: 'You', message: 'Hi Alex!', timestamp: new Date().toISOString() },
        ]),
      });
    });

    // Navigate to chat page
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Chat | Rythm/);
  });

  test('should display thread list', async ({ page }) => {
    // Check for thread list
    const threadList = page.locator(selectors.chat.threadList);
    await expect(threadList).toBeVisible();

    // Check for thread items
    const threadItems = page.locator('[data-testid="thread-item"]');
    await expect(threadItems).toHaveCount(2);

    // Verify thread names
    await expect(page.getByText('Alex Johnson')).toBeVisible();
    await expect(page.getByText('Sam Wilson')).toBeVisible();
  });

  test('should open thread and display messages', async ({ page }) => {
    // Click on first thread
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.click();

    // Verify messages are loaded
    const messages = page.locator(selectors.chat.messages);
    await expect(messages).toHaveCount(2);

    // Verify message content
    await expect(page.getByText('Hey there!')).toBeVisible();
    await expect(page.getByText('Hi Alex!')).toBeVisible();
  });

  test('should send message and display in thread', async ({ page }) => {
    // Open first thread
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.click();

    // Type and send message
    const messageInput = page.locator(selectors.chat.messageInput);
    await messageInput.fill('Hello from the test!');
    await page.locator(selectors.chat.sendBtn).click();

    // Verify message appears
    await expect(page.getByText('Hello from the test!')).toBeVisible();

    // Verify message input is cleared
    await expect(messageInput).toHaveValue('');
  });

  test('should receive incoming WebSocket message', async ({ page }) => {
    // Open first thread
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.click();

    // Get initial message count
    const messages = page.locator(selectors.chat.messages);
    const initialCount = await messages.count();

    // Simulate incoming WebSocket message
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'chat:newMessage',
            data: {
              threadId: '1',
              message: {
                id: 'new-message',
                sender: 'Alex Johnson',
                message: 'New message from WebSocket!',
                timestamp: new Date().toISOString(),
              },
            },
          }),
        })
      );
    });

    // Verify new message appears
    await expect(messages).toHaveCount(initialCount + 1);
    await expect(page.getByText('New message from WebSocket!')).toBeVisible();
  });

  test('should show typing indicator', async ({ page }) => {
    // Open first thread
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.click();

    // Simulate typing indicator via WebSocket
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'chat:typing',
            data: {
              threadId: '1',
              userId: 'Alex Johnson',
              isTyping: true,
            },
          }),
        })
      );
    });

    // Verify typing indicator
    await expect(page.getByText(/alex johnson is typing/i)).toBeVisible();
  });

  test('should create new thread', async ({ page }) => {
    // Click new thread button
    const newThreadBtn = page.getByRole('button', { name: /new chat/i });
    await expect(newThreadBtn).toBeVisible();
    await newThreadBtn.click();

    // Fill recipient
    const recipientInput = page.getByPlaceholder(/enter username/i);
    await recipientInput.fill('newfriend@example.com');

    // Start chat
    await page.getByRole('button', { name: /start chat/i }).click();

    // Verify new thread created
    await expect(page.getByText(/chat with newfriend/i)).toBeVisible();
  });

  test('should show message status indicators', async ({ page }) => {
    // Open first thread
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.click();

    // Send message
    const messageInput = page.locator(selectors.chat.messageInput);
    await messageInput.fill('Test message');
    await page.locator(selectors.chat.sendBtn).click();

    // Verify message status (sent, delivered, read)
    await expect(page.getByText(/sent/i)).toBeVisible();
  });

  test('should handle file attachments', async ({ page }) => {
    // Open first thread
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.click();

    // Click attachment button
    const attachmentBtn = page.getByRole('button', { name: /attach/i });
    await attachmentBtn.click();

    // Upload file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /upload file/i }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('test-files/test-audio.wav');

    // Verify file attachment
    await expect(page.getByText('test-audio.wav')).toBeVisible();
    await expect(page.getByText(/audio file/i)).toBeVisible();
  });

  test('should show thread search', async ({ page }) => {
    // Check for search input
    const searchInput = page.getByPlaceholder(/search threads/i);
    await expect(searchInput).toBeVisible();

    // Search for specific thread
    await searchInput.fill('Alex');

    // Verify filtered results
    await expect(page.getByText('Alex Johnson')).toBeVisible();
    await expect(page.getByText('Sam Wilson')).not.toBeVisible();
  });

  test('should handle thread deletion', async ({ page }) => {
    // Open thread options
    const firstThread = page.locator('[data-testid="thread-item"]').first();
    await firstThread.locator('[data-testid="thread-options"]').click();

    // Click delete thread
    await page.getByRole('button', { name: /delete thread/i }).click();

    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click();

    // Verify thread removed
    await expect(page.getByText(/thread deleted/i)).toBeVisible();
  });

  test('should show loading state', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/chat/threads', route => {
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
    await expect(page.getByText(/loading threads/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/chat/threads', route => {
      return route.fulfill({
        status: 500,
        body: 'Internal Server Error',
      });
    });

    // Reload to trigger error
    await page.reload();

    // Verify error state
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/failed to load threads/i)).toBeVisible();

    // Verify retry button
    const retryBtn = page.getByRole('button', { name: /retry/i });
    await expect(retryBtn).toBeVisible();
    await expect(retryBtn).toBeEnabled();
  });
});
