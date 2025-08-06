import { chromium } from '@playwright/test';
import fs from 'fs/promises';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function setupAuth() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Always use Credentials provider for CI/E2E
  await page.goto(`${BASE_URL}`);
  const res = await page.request.post(`${BASE_URL}/api/auth/callback/credentials`, {
    form: {
      csrfToken: '', // Not required for test
      email: process.env.E2E_CREDENTIALS_EMAIL || 'test@example.com',
      password: process.env.E2E_CREDENTIALS_PASSWORD || 'pass1234',
    },
  });
  if (!res.ok()) throw new Error('Failed to login via credentials');
  await page.reload();

  // Save storage state
  await fs.mkdir('tests', { recursive: true });
  await fs.writeFile('tests/state.json', await page.context().storageState());

  await browser.close();
}

// If run directly, invoke setupAuth
if (require.main === module) {
  setupAuth();
}
