import { test, expect } from '@playwright/test';

test('debug form submission', async ({ page }) => {
  // Listen to console logs
  const logs: string[] = [];
  page.on('console', msg => {
    logs.push(msg.text());
  });

  // Monitor network requests
  const requests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      requests.push(`${request.method()} ${request.url()}`);
    }
  });

  const responses: string[] = [];
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      responses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('/register/credentials');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check what's on the page
  const title = await page.title();
  console.log('Page title:', title);
  
  const h2Elements = await page.locator('h2').allTextContents();
  console.log('H2 elements:', h2Elements);
  
  // Fill the form
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.fill('#confirmPassword', 'password123');
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait a bit to see what happens
  await page.waitForTimeout(5000);
  
  // Check current URL
  const currentUrl = page.url();
  console.log('Current URL after submission:', currentUrl);
  
  // Check network requests
  console.log('API Requests:', requests);
  console.log('API Responses:', responses);
  
  // Check console logs
  console.log('Console logs:', logs);
  
  // For now, just check that the form submission didn't cause errors
  expect(logs.filter(log => log.includes('error') || log.includes('Error'))).toHaveLength(0);
});
