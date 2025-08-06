import { test, expect } from '@playwright/test';
import { selectors } from './selectors';

test.describe('Landing Page', () => {
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page and wait for network to be idle
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for key elements to be present before running tests
    await page.waitForSelector(selectors.landing.mainHeading, { state: 'visible' });
    await page.waitForSelector(selectors.landing.features, { state: 'attached' });
    await page.waitForSelector(selectors.landing.footer, { state: 'attached' });
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Rythm Daw/i);
  });

  test('should display main heading and key sections', async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator(selectors.landing.mainHeading);
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText(/rythm/i);

    // Check features section
    const features = page.locator(selectors.landing.features);
    await expect(features).toBeVisible();

    // Check footer
    const footer = page.locator(selectors.landing.footer);
    await expect(footer).toBeVisible();
  });

  test('should have visible and interactive call-to-action buttons', async ({ page }) => {
    // Get Started button
    const getStarted = page.locator(selectors.landing.getStartedBtn);
    await expect(getStarted).toBeVisible();
    await expect(getStarted).toBeEnabled();
    await expect(getStarted).toHaveText(/get started/i);

    // Login button
    const loginBtn = page.locator(selectors.landing.loginBtn);
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
    await expect(loginBtn).toHaveText(/login/i);
  });

  test('should navigate to register page when Get Started is clicked', async ({ page }) => {
    const getStarted = page.locator(selectors.landing.getStartedBtn);

    // Use Promise.all to wait for both navigation and click to complete
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), getStarted.click()]);

    // Verify navigation to register page
    await expect(page).toHaveURL(/\/register\/credentials/);
  });

  test('should navigate to login page when Login is clicked', async ({ page }) => {
    const loginBtn = page.locator(selectors.landing.loginBtn);

    // Use Promise.all to wait for both navigation and click to complete
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), loginBtn.click()]);

    // Verify navigation to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should have working navigation links in the header', async ({ page }) => {
    // Test each navigation link
    const navLinks = {
      [selectors.landing.navFeatures]: /#features/,
      [selectors.landing.navPricing]: /#pricing/,
      [selectors.landing.navDocs]: /docs/,
    };

    for (const [selector, urlPattern] of Object.entries(navLinks)) {
      const link = page.locator(selector);
      await expect(link).toBeVisible();

      // Test navigation
      await Promise.all([page.waitForURL(urlPattern, { timeout: 10000 }), link.click()]);

      // Go back to landing page for next test
      await page.goBack();
    }
  });

  test('should have a hero section with a call to action', async ({ page }) => {
    // Check hero section
    const heroSection = page.locator(selectors.landing.heroSection);
    await expect(heroSection).toBeVisible();

    // Check CTA button in hero section
    const ctaButton = heroSection.getByRole('link', { name: /get started/i });
    await expect(ctaButton).toBeVisible();
  });

  test('should have a features section', async ({ page }) => {
    // Check features section
    const featuresSection = page.locator(selectors.landing.featuresSection);
    await expect(featuresSection).toBeVisible();

    // Check for at least one feature card
    const featureCards = page.locator(selectors.landing.featureCards);
    const featureCardCount = await featureCards.count();
    expect(featureCardCount).toBeGreaterThan(0);
  });

  test('should have a footer with links', async ({ page }) => {
    // Check footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for footer links
    const footerLinks = page.locator(selectors.landing.footerLinks);
    const footerLinkCount = await footerLinks.count();
    expect(footerLinkCount).toBeGreaterThan(0);
  });
});
