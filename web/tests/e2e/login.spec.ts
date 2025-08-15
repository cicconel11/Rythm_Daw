import { test, expect } from '@playwright/test';
import { selectors, testData } from './selectors';

test.describe('Login Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/auth/login');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Login | Rythm/);
  });

  test('should display all required form fields', async ({ page }) => {
    // Check email field
    const emailInput = page.locator('#email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required', '');

    // Check password field
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(passwordInput).toHaveAttribute('required', '');

    // Check login button (it says "Sign in" not "Login")
    const loginBtn = page.getByRole('button', { name: /sign in/i });
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Submit the form without filling any fields using programmatic click
    await page.evaluate(() => {
      const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Sign in')
      );
      
      if (signInButton) {
        // Try to remove any portal interference by temporarily hiding portals
        const portals = document.querySelectorAll('[data-nextjs-portal], nextjs-portal');
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = 'none';
        });
        
        // Click the button
        signInButton.click();
        
        // Restore portals
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = '';
        });
      }
    });

    // Check for validation error messages (shown as toasts)
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
  });

  test('should show validation for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.locator('#email').fill('invalid-email');
    
    // Submit using programmatic click
    await page.evaluate(() => {
      const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Sign in')
      );
      
      if (signInButton) {
        // Try to remove any portal interference by temporarily hiding portals
        const portals = document.querySelectorAll('[data-nextjs-portal], nextjs-portal');
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = 'none';
        });
        
        // Click the button
        signInButton.click();
        
        // Restore portals
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = '';
        });
      }
    });

    // Check for email validation error (shown as toast)
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
  });

  test('should show error toast for invalid credentials', async ({ page }) => {
    // Mock API to return error for invalid credentials
    await page.route('**/api/auth/login', route => {
      return route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    // Fill in the form with invalid data
    await page.locator('#email').fill('invalid@example.com');
    await page.locator('#password').fill('wrongpassword');
    
    // Submit using programmatic click
    await page.evaluate(() => {
      const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Sign in')
      );
      
      if (signInButton) {
        // Try to remove any portal interference by temporarily hiding portals
        const portals = document.querySelectorAll('[data-nextjs-portal], nextjs-portal');
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = 'none';
        });
        
        // Click the button
        signInButton.click();
        
        // Restore portals
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = '';
        });
      }
    });

    // Check for error toast
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
  });

  test('should successfully login with valid credentials and redirect to dashboard', async ({
    page,
  }) => {
    // Set registration completed cookie to allow access to dashboard
    await page.context().addCookies([{
      name: 'registration_completed',
      value: 'true',
      domain: 'localhost',
      path: '/',
    }]);

    // Mock API to return success for valid credentials
    await page.route('**/api/auth/login', route => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { id: '1', email: testData.user.email, displayName: testData.user.displayName },
        }),
      });
    });

    // Fill in the form with valid data
    await page.locator('#email').fill(testData.user.email);
    await page.locator('#password').fill(testData.user.password);
    
    // Submit using programmatic click
    await page.evaluate(() => {
      const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Sign in')
      );
      
      if (signInButton) {
        // Try to remove any portal interference by temporarily hiding portals
        const portals = document.querySelectorAll('[data-nextjs-portal], nextjs-portal');
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = 'none';
        });
        
        // Click the button
        signInButton.click();
        
        // Restore portals
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = '';
        });
      }
    });

    // Verify navigation to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should have a link to the register page', async ({ page }) => {
    // Check for register button (it's a button, not a link)
    const registerButton = page.getByRole('button', { name: /register/i });
    await expect(registerButton).toBeVisible();

    // Click the button using programmatic click and verify navigation
    await page.evaluate(() => {
      const registerBtn = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Register')
      );
      
      if (registerBtn) {
        // Try to remove any portal interference by temporarily hiding portals
        const portals = document.querySelectorAll('[data-nextjs-portal], nextjs-portal');
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = 'none';
        });
        
        // Click the button
        registerBtn.click();
        
        // Restore portals
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = '';
        });
      }
    });
    
    await expect(page).toHaveURL('/register/credentials');
  });

  test('should show loading state during login', async ({ page }) => {
    // Set registration completed cookie to allow access to dashboard
    await page.context().addCookies([{
      name: 'registration_completed',
      value: 'true',
      domain: 'localhost',
      path: '/',
    }]);

    // Mock slow API response
    await page.route('**/api/auth/login', route => {
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
    });

    // Fill form
    await page.locator('#email').fill(testData.user.email);
    await page.locator('#password').fill(testData.user.password);
    
    // Submit using programmatic click
    await page.evaluate(() => {
      const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Sign in')
      );
      
      if (signInButton) {
        // Try to remove any portal interference by temporarily hiding portals
        const portals = document.querySelectorAll('[data-nextjs-portal], nextjs-portal');
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = 'none';
        });
        
        // Click the button
        signInButton.click();
        
        // Restore portals
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = '';
        });
      }
    });

    // Verify loading state (button should show "Signing in..." and be disabled)
    const loadingBtn = page.getByRole('button', { name: /signing in/i });
    await expect(loadingBtn).toBeVisible();
    await expect(loadingBtn).toBeDisabled();

    // Wait for completion
    await expect(page).toHaveURL('/dashboard');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/auth/login', route => {
      return route.abort();
    });

    // Fill form
    await page.locator('#email').fill(testData.user.email);
    await page.locator('#password').fill(testData.user.password);
    
    // Submit using programmatic click
    await page.evaluate(() => {
      const signInButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Sign in')
      );
      
      if (signInButton) {
        // Try to remove any portal interference by temporarily hiding portals
        const portals = document.querySelectorAll('[data-nextjs-portal], nextjs-portal');
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = 'none';
        });
        
        // Click the button
        signInButton.click();
        
        // Restore portals
        portals.forEach(portal => {
          (portal as HTMLElement).style.pointerEvents = '';
        });
      }
    });

    // Verify error message (shown as toast)
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
  });
});
