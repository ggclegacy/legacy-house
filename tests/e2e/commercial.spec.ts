import { expect, test } from "@playwright/test";

test.describe("Phase 03 commercial workspace", () => {
  test("shows honest commercial readiness and the authorized configuration", async ({
    page,
  }) => {
    await page.goto("/modules/costing");
    await expect(
      page.getByRole("heading", { name: "Configurations & Costing" }),
    ).toBeVisible();
    await expect(
      page
        .locator(".commercial-record-grid")
        .getByRole("link", { name: /Legacy Reserve Hair & Beard Oil — 2 oz/ }),
    ).toBeVisible();
    await expect(page.getByText("COGS incomplete")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add record" }),
    ).toBeDisabled();
  });

  test("keeps supplier, packaging, and document empty states truthful on mobile", async ({
    page,
  }) => {
    test.slow();
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["suppliers", "packaging", "documents"]) {
      await page.goto(`/modules/${route}`);
      await expect(page.getByText("No matching records.")).toBeVisible();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      ).toBe(true);
    }
  });

  test("exposes Phase 03 global search and navigation", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "desktop")
      await page
        .getByRole("button", { name: /Search/ })
        .first()
        .click();
    else
      await page
        .getByRole("navigation", { name: "Mobile commands" })
        .getByRole("button", { name: /Search/ })
        .click();
    const search = page.getByRole("textbox", { name: "Search destinations" });
    await search.fill("Legacy Reserve Hair & Beard Oil — 2 oz");
    await expect(
      page.getByRole("link", {
        name: /Legacy Reserve Hair & Beard Oil — 2 oz/,
      }),
    ).toBeVisible();
  });
});
