import { test, expect } from "@playwright/test";

test.describe("Settings page", () => {
  test("displays all settings sections", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Financing" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Branding" })).toBeVisible();
  });

  test("price per square input is present and numeric", async ({ page }) => {
    await page.goto("/settings");
    const input = page.getByLabel(/price per square/i);
    await expect(input).toBeVisible();
    await expect(input).toHaveValue("450");
  });

  test("persists price change across navigation", async ({ page }) => {
    await page.goto("/settings");
    const input = page.getByLabel(/price per square/i);
    await input.fill("600");

    // Navigate away and back
    await page.getByRole("link", { name: /leads/i }).click();
    await page.getByRole("link", { name: /settings/i }).click();

    await expect(page.getByLabel(/price per square/i)).toHaveValue("600");
  });

  test("company name input updates value", async ({ page }) => {
    await page.goto("/settings");
    const nameInput = page.getByLabel(/company name/i);
    await nameInput.fill("Acme Roofing");
    await expect(nameInput).toHaveValue("Acme Roofing");
  });

  test("financing toggle shows additional options when enabled", async ({ page }) => {
    await page.goto("/settings");
    const toggle = page.getByRole("switch");
    await expect(page.getByLabel(/annual interest rate/i)).not.toBeVisible();
    await toggle.click();
    await expect(page.getByLabel(/annual interest rate/i)).toBeVisible();
  });

  test("add tier button adds a new tier input", async ({ page }) => {
    await page.goto("/settings");
    const addBtn = page.getByRole("button", { name: /add tier/i });
    await addBtn.click();
    // Should now show 2 tier inputs
    const tierInputs = page.getByPlaceholder("Tier name");
    await expect(tierInputs).toHaveCount(2);
  });
});
