import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

test.describe('Settings Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Use authenticated state
    test.use({ storageState: 'tests/state.json' });

    // Mock API responses
    await page.route('**/api/settings', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          displayName: 'Test User',
          email: 'testuser@example.com',
          bio: 'This is a test bio',
          notifications: {
            email: true,
            push: false,
            sms: false,
          },
          privacy: {
            profileVisibility: 'public',
            showOnlineStatus: true,
          },
        }),
      });
    });

    // Navigate to settings page
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Settings | Rythm/);
  });

  test('should display settings form with prefilled values', async ({ page }) => {
    // Check for settings form
    const settingsForm = page.locator(selectors.settings.settingsForm);
    await expect(settingsForm).toBeVisible();

    // Verify form fields are prefilled
    await expect(page.getByLabel(/display name/i)).toHaveValue('Test User');
    await expect(page.getByLabel(/email/i)).toHaveValue('testuser@example.com');
    await expect(page.getByLabel(/bio/i)).toHaveValue('This is a test bio');

    // Verify notification settings
    await expect(page.getByLabel(/email notifications/i)).toBeChecked();
    await expect(page.getByLabel(/push notifications/i)).not.toBeChecked();
  });

  test('should save settings successfully', async ({ page }) => {
    // Mock save API
    await page.route('**/api/settings', route => {
      if (route.request().method() === 'PUT') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
      return route.continue();
    });

    // Update display name
    await page.getByLabel(/display name/i).fill('Updated User Name');

    // Click save button
    await page.locator(selectors.settings.saveBtn).click();

    // Verify success message
    await expect(page.locator(selectors.common.successMessage)).toBeVisible();
    await expect(page.getByText(/settings saved successfully/i)).toBeVisible();
  });

  test('should update UI via WebSocket user:update event', async ({ page }) => {
    // Get initial display name
    const displayNameInput = page.getByLabel(/display name/i);
    const initialValue = await displayNameInput.inputValue();

    // Simulate WebSocket user update
    await page.evaluate(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            event: 'user:update',
            data: {
              displayName: 'Updated via WebSocket',
              email: 'updated@example.com',
              bio: 'Updated bio via WebSocket',
            },
          }),
        })
      );
    });

    // Verify form fields updated
    await expect(displayNameInput).toHaveValue('Updated via WebSocket');
    await expect(page.getByLabel(/email/i)).toHaveValue('updated@example.com');
    await expect(page.getByLabel(/bio/i)).toHaveValue('Updated bio via WebSocket');
  });

  test('should validate form fields', async ({ page }) => {
    // Try to save with invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.locator(selectors.settings.saveBtn).click();

    // Verify validation error
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();

    // Try to save with empty display name
    await page.getByLabel(/display name/i).fill('');
    await page.locator(selectors.settings.saveBtn).click();

    // Verify validation error
    await expect(page.getByText(/display name is required/i)).toBeVisible();
  });

  test('should handle notification settings', async ({ page }) => {
    // Toggle push notifications
    await page.getByLabel(/push notifications/i).check();

    // Toggle SMS notifications
    await page.getByLabel(/sms notifications/i).check();

    // Save settings
    await page.locator(selectors.settings.saveBtn).click();

    // Verify settings saved
    await expect(page.getByText(/settings saved successfully/i)).toBeVisible();
  });

  test('should handle privacy settings', async ({ page }) => {
    // Change profile visibility
    await page.getByLabel(/profile visibility/i).selectOption('private');

    // Toggle online status visibility
    await page.getByLabel(/show online status/i).uncheck();

    // Save settings
    await page.locator(selectors.settings.saveBtn).click();

    // Verify settings saved
    await expect(page.getByText(/settings saved successfully/i)).toBeVisible();
  });

  test('should show loading state during save', async ({ page }) => {
    // Mock slow save API
    await page.route('**/api/settings', route => {
      if (route.request().method() === 'PUT') {
        return new Promise<void>(resolve => {
          setTimeout(() => {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({ success: true }),
            });
            resolve();
          }, 2000);
        });
      }
      return route.continue();
    });

    // Update a field
    await page.getByLabel(/display name/i).fill('Slow Save Test');

    // Click save
    await page.locator(selectors.settings.saveBtn).click();

    // Verify loading state
    await expect(page.locator(selectors.common.loadingSpinner)).toBeVisible();
    await expect(page.getByText(/saving settings/i)).toBeVisible();

    // Wait for completion
    await expect(page.getByText(/settings saved successfully/i)).toBeVisible();
  });

  test('should handle save errors gracefully', async ({ page }) => {
    // Mock save error
    await page.route('**/api/settings', route => {
      if (route.request().method() === 'PUT') {
        return route.fulfill({
          status: 500,
          body: 'Save failed',
        });
      }
      return route.continue();
    });

    // Update a field
    await page.getByLabel(/display name/i).fill('Error Test');

    // Click save
    await page.locator(selectors.settings.saveBtn).click();

    // Verify error message
    await expect(page.locator(selectors.common.errorMessage)).toBeVisible();
    await expect(page.getByText(/failed to save settings/i)).toBeVisible();
  });

  test('should allow password change', async ({ page }) => {
    // Click change password button
    await page.getByRole('button', { name: /change password/i }).click();

    // Fill password fields
    await page.getByLabel(/current password/i).fill('oldpassword');
    await page.getByLabel(/new password/i).fill('newpassword123');
    await page.getByLabel(/confirm new password/i).fill('newpassword123');

    // Mock password change API
    await page.route('**/api/settings/password', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Submit password change
    await page.getByRole('button', { name: /update password/i }).click();

    // Verify success message
    await expect(page.getByText(/password updated successfully/i)).toBeVisible();
  });

  test('should handle account deletion', async ({ page }) => {
    // Scroll to danger zone
    await page.getByText(/danger zone/i).scrollIntoViewIfNeeded();

    // Click delete account button
    await page.getByRole('button', { name: /delete account/i }).click();

    // Fill confirmation
    await page.getByPlaceholder(/type delete to confirm/i).fill('delete');

    // Mock delete API
    await page.route('**/api/settings/account', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Confirm deletion
    await page.getByRole('button', { name: /confirm deletion/i }).click();

    // Verify redirect to landing page
    await expect(page).toHaveURL(/\/landing/);
  });

  test('should show data export options', async ({ page }) => {
    // Check for export section
    await expect(page.getByText(/export data/i)).toBeVisible();

    // Click export button
    await page.getByRole('button', { name: /export data/i }).click();

    // Verify export options
    await expect(page.getByText(/export format/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /download export/i })).toBeVisible();
  });

  test('should handle theme preferences', async ({ page }) => {
    // Check for theme section
    await expect(page.getByText(/appearance/i)).toBeVisible();

    // Change theme
    await page.getByLabel(/theme/i).selectOption('dark');

    // Save settings
    await page.locator(selectors.settings.saveBtn).click();

    // Verify theme applied
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
  });
});
