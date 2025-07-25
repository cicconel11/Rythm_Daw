import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

// Environment variables can be set here or in .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // Directory containing the test files
  testDir: './tests/e2e',

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI/CD
  retries: process.env.CI ? 2 : 1,

  // Global timeout for each test
  timeout: 60000,

  // Limit the number of workers on CI, use default for local
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [['html', { open: 'on-failure' }], ['list']],

  // Web server for development with Next.js
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stderr: 'pipe',
    stdout: 'pipe',
    env: {
      NODE_ENV: 'test',
      PORT: '3000',
      // Add any other environment variables needed for testing
    },
  },

  // Shared settings for all tests
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'on-first-retry',

    // Headless mode - can be overridden with HEADLESS=false env var
    headless: process.env.HEADLESS !== 'false',

    // Viewport settings
    viewport: { width: 1920, height: 1080 },

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Customize Chrome launch options if needed
        // launchOptions: {
        //   args: ['--start-maximized']
        // }
      },
    },
    // Uncomment to enable testing in other browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Global setup and teardown (uncomment if needed)
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),
});
