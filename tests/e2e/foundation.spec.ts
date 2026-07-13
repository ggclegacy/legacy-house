import { expect, test } from "@playwright/test";

test("renders the Command experience and permanent navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "The house behind every product." }),
  ).toBeVisible();
  await expect(
    page.getByText(/command center behind every Groomed Gent Co. product/),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Legacy House emblem" }),
  ).toBeVisible();
  for (const pillar of ["Create", "Build", "Control", "Scale"]) {
    await expect(
      page
        .locator("#operating-systems")
        .getByRole("heading", { name: pillar, exact: true }),
    ).toBeVisible();
  }

  if (testInfo.project.name === "desktop") {
    await expect(
      page.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Settings/ })).toBeVisible();
  } else {
    await expect(
      page.getByRole("navigation", { name: "Mobile commands" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.getByRole("complementary", { name: "Mobile navigation drawer" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Formula Vault/ }),
    ).toBeVisible();
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test("opens grouped global search from its accessible trigger", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "desktop") {
    await page
      .getByRole("button", { name: /Search/ })
      .first()
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Mobile commands" })
      .getByRole("button", { name: /Search/ })
      .click();
  }
  await expect(
    page.getByRole("dialog", { name: /Find your way through the House/ }),
  ).toBeVisible();
  const search = page.getByRole("textbox", { name: "Search destinations" });
  await search.fill("sanctum");
  await expect(
    page
      .locator('a[href="/settings#product-lines"]')
      .filter({ hasText: "Legacy Sanctum" }),
  ).toBeVisible();
  await search.fill("record-that-does-not-exist");
  await expect(
    page.getByText(/No registered destination matches/),
  ).toBeVisible();
});

test("shows only honest global create availability", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "desktop") {
    await page
      .getByRole("button", { name: /Create/ })
      .first()
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Mobile commands" })
      .getByRole("button", { name: /Create/ })
      .click();
  }
  await expect(
    page.getByRole("dialog", { name: /Create a controlled record/ }),
  ).toBeVisible();
  await expect(
    page.getByText("No creation actions are currently available."),
  ).toBeVisible();
  await expect(
    page.getByText(/Configure a reachable PostgreSQL/),
  ).toBeVisible();
});

test("applies reduced motion and sidebar preferences", async ({ page }) => {
  await page.goto("/settings");
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Database settings are not configured."),
  ).toBeVisible();
  const reduceMotion = page.getByRole("checkbox", { name: /Reduce motion/ });
  await reduceMotion.check();
  await expect(page.locator("html")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await expect(
    page.getByRole("button", { name: "Save workspace settings" }),
  ).toBeDisabled();
});

test("preserves static hero meaning under operating-system reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByLabel(/Legacy House connects Create, Build, Control, and Scale/),
  ).toBeVisible();
  await expect(page.getByText("Intelligence core")).toBeVisible();
});

test("serves the Phase 02 Formula Vault with canonical facts", async ({
  page,
}) => {
  await page.goto("/modules/formula-vault");
  await expect(
    page.getByRole("heading", { name: "Formula Vault" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Legacy Reserve Hair & Beard Oil" }),
  ).toBeVisible();
  await expect(page.getByText(/100% · Ready/)).toBeVisible();
  await expect(page.getByText(/persistence unavailable/)).toBeVisible();
});

test("publishes liveness and truthful database readiness", async ({
  request,
}) => {
  const health = await request.get("/api/health");
  expect(health.ok()).toBe(true);
  expect(await health.json()).toEqual({
    status: "live",
    service: "legacy-house",
  });

  const readiness = await request.get("/api/ready");
  expect(readiness.status()).toBe(503);
  expect(await readiness.json()).toEqual({
    status: "not_ready",
    dependencies: { database: "unavailable" },
  });
});
