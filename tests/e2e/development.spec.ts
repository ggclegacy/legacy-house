import { expect, test } from "@playwright/test";

test("supports pipeline, list, and product-line views without page overflow", async ({
  page,
}) => {
  await page.goto("/modules/product-pipeline");
  await expect(
    page.getByRole("heading", { name: "Product Development", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create Product" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open Product Pipeline" }),
  ).toHaveAttribute("href", "#product-pipeline");
  await expect(
    page.getByRole("link", { name: "VITALIS — NMN 500 mg" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "List" }).click();
  await expect(
    page.getByRole("region", { name: "Product list" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Product-line view" }).click();
  await expect(
    page.getByRole("heading", { name: "Legacy Sanctum" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test("keeps Product Development and Product Detail bounded across required widths", async ({
  page,
}, testInfo) => {
  test.slow();
  test.skip(
    testInfo.project.name !== "desktop",
    "Run the viewport matrix once.",
  );
  const viewports = [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 430, height: 820 },
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/modules/product-pipeline");
    await expect(
      page.getByRole("heading", { name: "Product Development", level: 1 }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `Pipeline overflow at ${viewport.width}px`,
    ).toBeLessThanOrEqual(viewport.width);
    if (viewport.width <= 700) {
      await expect(page.getByLabel("Focused product list")).toBeVisible();
      await expect(page.locator(".pipeline-board")).toBeHidden();
    }

    await page.goto("/products/legacy-reserve-hair-beard-oil");
    await expect(
      page.getByRole("navigation", { name: "Product build navigation" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `Product workspace overflow at ${viewport.width}px`,
    ).toBeLessThanOrEqual(viewport.width);
    const productName = page.getByRole("heading", {
      name: "Legacy Reserve Hair & Beard Oil",
      level: 1,
    });
    const nameBox = await productName.boundingBox();
    expect(nameBox?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((nameBox?.x ?? 0) + (nameBox?.width ?? 0)).toBeLessThanOrEqual(
      viewport.width,
    );
  }
});

test("opens the connected product workspace and phase-aware tabs", async ({
  page,
}) => {
  await page.goto("/products/legacy-reserve-hair-beard-oil");
  await expect(
    page.getByRole("heading", {
      name: "Legacy Reserve Hair & Beard Oil",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Product build navigation" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Overview" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect(page.getByRole("link", { name: "Research" })).toHaveAttribute(
    "href",
    "/modules/r-and-d?product=legacy-reserve-hair-beard-oil",
  );
  await expect(
    page.getByText("Launch Readiness · Unavailable"),
  ).toHaveAttribute("aria-disabled", "true");
  await expect(
    page.getByRole("link", { name: "Edit Product" }),
  ).toHaveAttribute("href", "#product-controls");
  await expect(
    page.getByRole("link", { name: "Continue Build" }),
  ).toHaveAttribute("href", "#product-brief");
  await expect(
    page
      .locator("#overview")
      .getByText("Legacy Reserve Hair & Beard Oil — 2 oz"),
  ).toBeVisible();
  await expect(page.getByText("Launch Ready").first()).toBeVisible();
  await expect(page.getByText("Founder Decision Journal")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save product brief" }),
  ).toBeDisabled();
  await expect(page.getByText("Edit product", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Archive product", { exact: true }),
  ).toBeVisible();
});

test("calculates the supplied Reserve batch and preserves missing density", async ({
  page,
}) => {
  await page.goto(
    "/formulas/938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8#batch-calculator",
  );
  await expect(
    page.getByRole("heading", { name: "Legacy Reserve Hair & Beard Oil" }),
  ).toBeVisible();
  await expect(page.getByText("42 US Fluid Ounces")).toBeVisible();
  await expect(page.getByText("943.987063635", { exact: true })).toBeVisible();
  await expect(page.getByText("Density required").first()).toBeVisible();
  await expect(page.getByText(/Running total: 100%/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Save draft" })).toBeDisabled();
  await page.getByRole("button", { name: "30" }).click();
  await expect(page.getByText("63 US Fluid Ounces")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test("shows ingredient intelligence without inferred technical values", async ({
  page,
}) => {
  await page.goto("/ingredients/1fca9d52-1439-43da-999d-ea1b0b25162f");
  await expect(page.getByRole("heading", { name: "Marula Oil" })).toBeVisible();
  await expect(
    page.getByText("Premium emollient and sensory-enhancing oil.").first(),
  ).toBeVisible();
  await expect(page.getByText("Missing density")).toBeVisible();
  await expect(
    page.getByText(/does not imply regulatory approval/),
  ).toBeVisible();
});

test("expands Command and global search with real Phase 02 definitions", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Product Build Workspace" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Custom Formula/ }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  const search = page.getByRole("textbox", { name: "Search destinations" });
  await search.fill("Marula");
  await expect(page.getByRole("link", { name: /Marula Oil/ })).toBeVisible();
});
