import { expect, test } from "@playwright/test";

test("keeps the Production path bounded at required phone widths", async ({
  page,
}, testInfo) => {
  test.slow();
  test.skip(testInfo.project.name !== "desktop", "Run the width matrix once.");

  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 760 });
    await page.goto("/modules/production");
    await expect(
      page.getByRole("heading", { name: "Production", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Legacy Reserve Hair & Beard Oil",
      }),
    ).toBeVisible();
    const mobileCommands = page.getByRole("navigation", {
      name: "Mobile commands",
    });
    await expect(
      mobileCommands.getByRole("link", { name: "Production" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("link", { name: "Build Batch" }),
    ).toHaveAttribute("href", /\/production\/batch-builder\?formula=/);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `Production Home overflow at ${width}px`,
    ).toBeLessThanOrEqual(width);

    const builderHref = await page
      .getByRole("link", { name: "Build Batch" })
      .getAttribute("href");
    await page.goto(builderHref!);
    await expect(
      page.getByRole("heading", { name: "Exact Batch Builder" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "20" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Fill size" })).toHaveValue(
      "2",
    );
    await expect(page.getByRole("combobox", { name: "Fill unit" })).toHaveValue(
      "us_fluid_ounces",
    );
    await expect(page.getByRole("button", { name: "5%" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByText("Density required").first()).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `Batch Builder overflow at ${width}px`,
    ).toBeLessThanOrEqual(width);

    const rows = page.locator(
      ".production-builder-page .batch-lines > article",
    );
    for (let index = 0; index < (await rows.count()); index += 1) {
      const box = await rows.nth(index).boundingBox();
      expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width);
    }
  }
});

test("supports the one-handed Batch Plan workflow without stock effects", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Run the workflow once.");
  await page.setViewportSize({ width: 390, height: 760 });
  await page.addInitScript(() => {
    const state = window as typeof window & {
      __copiedBatchSheet?: string;
      __printedBatchSheet?: boolean;
    };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          state.__copiedBatchSheet = value;
        },
      },
    });
    window.print = () => {
      state.__printedBatchSheet = true;
    };
  });
  await page.route("**/api/production/batch-plans", async (route) => {
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    expect(payload).not.toHaveProperty("inventory");
    expect(payload).not.toHaveProperty("lots");
    expect(payload).not.toHaveProperty("consumption");
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ result: { id: "mobile-plan" } }),
    });
  });

  await page.goto("/modules/production");
  await page.getByRole("link", { name: "Build Batch" }).click();
  await page.getByRole("button", { name: "Custom" }).click();
  await page.getByRole("textbox", { name: "Custom count" }).fill("37");
  await page.getByRole("textbox", { name: "Fill size" }).fill("2.5");
  await page.getByRole("button", { name: "7%" }).click();
  await expect(page.getByText("98.975 US Fluid Ounces")).toBeVisible();
  await expect(page.getByText("Density required").first()).toBeVisible();

  await page.getByRole("link", { name: "Start Batch Mode" }).click();
  await expect(
    page.getByRole("heading", { name: "Ingredient amounts" }),
  ).toBeVisible();
  await expect(page.locator(".batch-mode-panel:visible")).toHaveCount(1);
  await expect(page.getByText("75.221", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Production steps" }).click();
  await expect(page.locator(".batch-mode-panel:visible")).toHaveCount(1);
  await page
    .getByRole("checkbox", { name: "Complete step 1", exact: true })
    .check();
  await expect(
    page.getByRole("checkbox", { name: "Complete step 1", exact: true }),
  ).toBeChecked();

  const actions = page.locator(".batch-mode-actions");
  const dock = page.getByRole("navigation", { name: "Mobile commands" });
  await actions.scrollIntoViewIfNeeded();
  await expect(actions).toBeVisible();
  const actionBox = await actions.boundingBox();
  const dockBox = await dock.boundingBox();
  expect((actionBox?.y ?? 0) + (actionBox?.height ?? 0)).toBeLessThanOrEqual(
    (dockBox?.y ?? 0) + 1,
  );

  await page.getByRole("button", { name: "Copy Batch Sheet" }).click();
  await expect(
    page.getByText("Batch sheet copied.", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      Boolean(
        (window as typeof window & { __copiedBatchSheet?: string })
          .__copiedBatchSheet,
      ),
    ),
  ).toBe(true);

  await page.getByRole("button", { name: "Print Batch Sheet" }).click();
  expect(
    await page.evaluate(() =>
      Boolean(
        (window as typeof window & { __printedBatchSheet?: boolean })
          .__printedBatchSheet,
      ),
    ),
  ).toBe(true);

  await page.getByRole("button", { name: "Save Batch Plan" }).click();
  await expect(
    page.getByText("Batch Plan saved. Inventory was not changed.", {
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
