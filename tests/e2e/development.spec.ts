import { expect, test } from "@playwright/test";

test("supports pipeline, list, and product-line views without page overflow", async ({
  page,
}) => {
  await page.goto("/modules/product-pipeline");
  await expect(
    page.getByRole("heading", { name: "Product Pipeline" }),
  ).toBeVisible();
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
    page.getByRole("navigation", { name: "Product workspace tabs" }),
  ).toBeVisible();
  await expect(page.getByText("Founder Decision Journal")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save product brief" }),
  ).toBeDisabled();
  await expect(page.getByText("Edit product")).toBeVisible();
  await expect(page.getByText("Archive product")).toBeVisible();
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
    page.getByRole("heading", { name: "Product development command" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create Product" }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  const search = page.getByRole("textbox", { name: "Search destinations" });
  await search.fill("Marula");
  await expect(page.getByRole("link", { name: /Marula Oil/ })).toBeVisible();
});
