import { test, expect } from "@playwright/test";

const SEED_LEAD = {
  id: "test-lead-1",
  createdAt: new Date("2026-01-15").toISOString(),
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "555-111-2222",
  address: "123 Oak Street, Columbus, OH 43215",
  footprintSqft: 1800,
  roofSqft: 2250,
  pitchLevel: "MEDIUM",
  details: {},
  estimateLow: 9000,
  estimateHigh: 12000,
  tierName: "Standard",
};

async function seedLeads(page: import("@playwright/test").Page, leads: object[]) {
  await page.addInitScript((leadsData: object[]) => {
    localStorage.setItem(
      "ere-leads",
      JSON.stringify({ state: { leads: leadsData }, version: 0 })
    );
  }, leads);
}

test.describe("Reporting page", () => {
  test("shows empty state when no leads", async ({ page }) => {
    await page.goto("/reporting");
    await expect(page.getByText(/no leads yet/i)).toBeVisible();
  });

  test("shows seeded leads in the table", async ({ page }) => {
    await seedLeads(page, [SEED_LEAD]);
    await page.goto("/reporting");
    await expect(page.getByText("Jane Smith")).toBeVisible();
    await expect(page.getByText("jane@example.com")).toBeVisible();
  });

  test("export CSV button is disabled when no leads", async ({ page }) => {
    await page.goto("/reporting");
    const exportBtn = page.getByRole("button", { name: /export csv/i });
    await expect(exportBtn).toBeDisabled();
  });

  test("export CSV button is enabled when leads exist", async ({ page }) => {
    await seedLeads(page, [SEED_LEAD]);
    await page.goto("/reporting");
    const exportBtn = page.getByRole("button", { name: /export csv/i });
    await expect(exportBtn).toBeEnabled();
  });

  test("CSV download triggers on export click", async ({ page }) => {
    await seedLeads(page, [SEED_LEAD]);
    await page.goto("/reporting");

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /export csv/i }).click(),
    ]);

    expect(download.suggestedFilename()).toMatch(/^leads-\d{4}-\d{2}-\d{2}\.csv$/);
  });

  test("deletes lead after confirmation", async ({ page }) => {
    await seedLeads(page, [SEED_LEAD]);
    await page.goto("/reporting");

    // Accept the confirm dialog
    page.on("dialog", (dialog) => dialog.accept());

    await page.getByRole("button", { name: "Delete lead" }).first().click();
    await expect(page.getByText("Jane Smith")).not.toBeVisible();
    await expect(page.getByText(/no leads yet/i)).toBeVisible();
  });
});
