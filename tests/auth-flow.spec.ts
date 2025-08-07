import { test, expect } from "@playwright/test";
import { E2E_USER } from "./auth.setup";

// Use the baseURL from playwright config
test.use({ baseURL: "http://localhost:3000" });

test.describe("Authentication Flow", () => {
  test("should load landing page with correct options", async ({ page }) => {
    await test.step("navigate to landing page", async () => {
      await page.goto("/landing");
      await expect(page).toHaveURL("/landing");
    });

    await test.step("verify landing page content", async () => {
      await expect(page.locator("h1")).toContainText("Rythm");
      const getStartedBtn = page.locator('[data-testid="btn-get-started"]');
      await expect(getStartedBtn).toBeVisible();
      await expect(getStartedBtn).toContainText("Get Started");

      const loginBtn = page.locator('[data-testid="btn-login"]');
      await expect(loginBtn).toBeVisible();
      await expect(loginBtn).toContainText("Login");
    });
  });

  test("should navigate to registration flow from landing page", async ({
    page,
  }) => {
    await page.goto("/landing");
    await page.locator('[data-testid="btn-get-started"]').click();
    await expect(page).toHaveURL("/register/credentials");
  });

  test("complete registration flow", async ({ page }) => {
    // Step 1: Credentials registration
    await page.goto("/register/credentials");

    await test.step("fill out registration form", async () => {
      await page
        .locator('[data-testid="input-email"]')
        .fill("test@example.com");
      await page.locator('[data-testid="input-password"]').fill("Test123!");
      await page
        .locator('[data-testid="input-confirm-password"]')
        .fill("Test123!");
      await page
        .locator('[data-testid="input-display-name"]')
        .fill("Test User");
      await page.locator('[data-testid="btn-submit"]').click();
    });

    // Step 2: Bio
    await expect(page).toHaveURL("/register/bio");
    await test.step("fill out bio", async () => {
      const bio = "Music producer and DJ from Test City";
      await page.locator('[data-testid="input-bio"]').fill(bio);
      await page.locator('[data-testid="btn-submit"]').click();
    });

    // Should redirect to device connection
    await expect(page).toHaveURL("/device");
  });

  test("should handle login flow", async ({ page }) => {
    await test.step("navigate to login page", async () => {
      await page.goto("/auth/login");
      await expect(page).toHaveURL("/auth/login");
    });

    await test.step("fill login form", async () => {
      await page.locator('[data-testid="input-email"]').fill(E2E_USER.email);
      await page
        .locator('[data-testid="input-password"]')
        .fill(E2E_USER.password);
      await page.locator('[data-testid="btn-login"]').click();
    });

    // Should redirect to device connection after login
    await expect(page).toHaveURL("/device");
  });

  test("device connection page", async ({ page }) => {
    await page.goto("/device");
    await expect(page.locator("h1")).toContainText("Connect Your Device");
    const connectionCode = page.locator('[data-testid="connection-code"]');
    await expect(connectionCode).toBeVisible();

    // Should be a 6-digit code
    const code = await connectionCode.textContent();
    expect(code).toMatch(/^\d{6}$/);
  });

  test("plugin download page", async ({ page }) => {
    await page.goto("/scan");

    // Verify download options are present
    await test.step("check download options", async () => {
      const macBtn = page.locator('[data-testid="btn-download-mac"]');
      const windowsBtn = page.locator('[data-testid="btn-download-windows"]');
      const linuxBtn = page.locator('[data-testid="btn-download-linux"]');
      const skipBtn = page.locator('[data-testid="btn-skip"]');

      await expect(macBtn).toBeVisible();
      await expect(windowsBtn).toBeVisible();
      await expect(linuxBtn).toBeVisible();
      await expect(skipBtn).toBeVisible();
    });

    // Test skip to dashboard
    await test.step("skip to dashboard", async () => {
      await page.locator('[data-testid="btn-skip"]').click();
      await expect(page).toHaveURL("/dashboard");
    });
  });
});
