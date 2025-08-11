import { test, expect } from '@playwright/test';

test('should load simple registration credentials page', async ({ page }) => {
  await page.goto('/register/credentials-simple');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if the page title is present
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
  
  // Check if the step indicator is present
  await expect(page.getByText('Step 1 of 2: Set up your credentials')).toBeVisible();
  
  // Check if the form is present
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('#confirmPassword')).toBeVisible();
});
