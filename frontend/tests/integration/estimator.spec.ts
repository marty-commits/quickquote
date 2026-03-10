import { test, expect, Page } from "@playwright/test";

// Inject a minimal google.maps stub so tests don't need a real API key
async function injectGoogleMapsMock(page: Page) {
  await page.addInitScript(() => {
    const mockAutocomplete = {
      _listener: null as ((place: object) => void) | null,
      addListener(_event: string, cb: () => void) {
        this._listener = cb;
      },
      getPlace: () => ({
        formatted_address: "123 Main St, Columbus, OH 43215",
        geometry: {
          location: {
            lat: () => 39.9612,
            lng: () => -82.9988,
          },
        },
      }),
      triggerChange() {
        if (this._listener) this._listener({});
      },
    };

    (window as unknown as Record<string, unknown>).google = {
      maps: {
        places: {
          Autocomplete: function (_input: HTMLInputElement) {
            Object.assign(this, mockAutocomplete);
          },
        },
        Map: function () {
          return {
            data: {
              add: () => {},
              forEach: () => {},
              remove: () => {},
              addGeoJson: () => {},
              setStyle: () => {},
            },
          };
        },
        Data: function () {
          return {};
        },
      },
    };
  });
}

async function mockFootprintApi(page: Page) {
  await page.route("**/api/footprint*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        polygon: {
          type: "Polygon",
          coordinates: [
            [
              [-82.999, 39.961],
              [-82.998, 39.961],
              [-82.998, 39.962],
              [-82.999, 39.962],
              [-82.999, 39.961],
            ],
          ],
        },
        areaSqft: 1800,
      }),
    });
  });
}

test.describe("Estimator wizard", () => {
  test.beforeEach(async ({ page }) => {
    await injectGoogleMapsMock(page);
    await mockFootprintApi(page);
  });

  test("loads the address step on the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Get Your Free Roof Estimate")).toBeVisible();
    await expect(page.getByPlaceholder(/enter your home address/i)).toBeVisible();
  });

  test("step indicator shows correct number of dots", async ({ page }) => {
    await page.goto("/");
    // There are 5 step dots total (ADDRESS through CONTACT, not THANK_YOU)
    await expect(page.locator(".flex.items-center.justify-center.gap-2 .rounded-full")).toHaveCount(5);
  });

  test("navbar shows company name and navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Easy Roof Estimate").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /settings/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /leads/i })).toBeVisible();
  });

  test("navigates to settings page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /settings/i }).click();
    await expect(page).toHaveURL("/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("navigates to reporting page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /leads/i }).click();
    await expect(page).toHaveURL("/reporting");
    await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
  });
});
