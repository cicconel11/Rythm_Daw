import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page and wait for network to be idle
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for key elements to be present before running tests
    await page.waitForSelector('[data-testid="landing-main-heading"]', { state: 'visible' });
    await page.waitForSelector('[data-testid="features"]', { state: 'attached' });
    await page.waitForSelector('[data-testid="footer-links"]', { state: 'attached' });
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Rythm Daw/i);
  });

  test('should display main heading and key sections', async ({ page }) => {
    // Check main heading
    const mainHeading = page.getByTestId('landing-main-heading');
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText(/rythm/i);

    // Check features section
    const features = page.getByTestId('features');
    await expect(features).toBeVisible();

    // Check footer
    const footer = page.getByTestId('footer-links');
    await expect(footer).toBeVisible();
  });

  test('should have visible and interactive call-to-action buttons', async ({ page }) => {
    // Get Started button
    const getStarted = page.getByTestId('btn-get-started');
    await expect(getStarted).toBeVisible();
    await expect(getStarted).toBeEnabled();
    await expect(getStarted).toHaveText(/get started/i);

    // Login button
    const loginBtn = page.getByTestId('btn-login');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
    await expect(loginBtn).toHaveText(/login/i);
  });

  test('should navigate to register page when Get Started is clicked', async ({ page }) => {
    const getStarted = page.getByTestId('btn-get-started');

    // Use Promise.all to wait for both navigation and click to complete
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), getStarted.click()]);

    // Verify navigation to register page
    await expect(page).toHaveURL(/\/register\/credentials/);
  });

  test('should navigate to login page when Login is clicked', async ({ page }) => {
    const loginBtn = page.getByTestId('btn-login');

    // Use Promise.all to wait for both navigation and click to complete
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), loginBtn.click()]);

    // Verify navigation to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should have working navigation links in the header', async ({ page }) => {
    // Test each navigation link
    const navLinks = {
      'nav-features': /#features/,
      'nav-pricing': /#pricing/,
      'nav-docs': /docs/,
    };

    for (const [testId, urlPattern] of Object.entries(navLinks)) {
      const link = page.getByTestId(testId);
      await expect(link).toBeVisible();

      // Test navigation
      await Promise.all([page.waitForURL(urlPattern, { timeout: 5000 }), link.click()]);

      // Go back to landing page for next test
      await page.goBack();
    }
  });

  test('should have a hero section with a call to action', async ({ page }) => {
    // Check hero section
    const heroSection = page.locator('section.hero');
    await expect(heroSection).toBeVisible();

    // Check CTA button in hero section
    const ctaButton = heroSection.getByRole('link', { name: /get started/i });
    await expect(ctaButton).toBeVisible();
  });

  test('should have a features section', async ({ page }) => {
    // Check features section
    const featuresSection = page.locator('section#features');
    await expect(featuresSection).toBeVisible();

    // Check for at least one feature card
    const featureCards = featuresSection.locator('.feature-card');
    const featureCardCount = await featureCards.count();
    expect(featureCardCount).toBeGreaterThan(0);
  });

  test('should have a footer with links', async ({ page }) => {
    // Check footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for footer links
    const footerLinks = footer.locator('a');
    const footerLinkCount = await footerLinks.count();
    expect(footerLinkCount).toBeGreaterThan(0);
  });
});
