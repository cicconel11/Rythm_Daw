import { test, expect } from "@playwright/test";
import { E2E_USER } from "./auth.setup";

test.describe("Landing → Login → Dashboard", () => {
  test("happy path: credentials login", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.locator("h1")).toContainText("Rythm");
    await page.locator('[data-testid="btn-get-started"]').click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await page.locator('[data-testid="input-email"]').fill(E2E_USER.email);
    await page
      .locator('[data-testid="input-password"]')
      .fill(E2E_USER.password);
    await page.locator('[data-testid="btn-credentials"]').click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("body")).not.toContainText("Sign in");
  });
});
