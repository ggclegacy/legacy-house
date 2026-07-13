import { expect, test } from "@playwright/test";

test("renders the Command experience and permanent navigation", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const hero = page.locator(".command-hero");
  await expect(
    hero.getByRole("heading", { name: "Legacy House", exact: true }),
  ).toBeVisible();
  await expect(
    hero.getByText("Groomed Gent Co. Product Intelligence OS"),
  ).toBeVisible();
  await expect(
    hero.getByRole("img", { name: "Legacy House emblem" }),
  ).toBeVisible();
  await expect(page.locator('.sidebar-brand img[src="/emblem"]')).toHaveCount(
    1,
  );
  const pillarRoutes = {
    Create: "/modules/product-pipeline",
    Build: "/modules/suppliers",
    Control: "/modules/inventory",
    Scale: "/modules/launches",
  } as const;
  for (const [pillar, href] of Object.entries(pillarRoutes)) {
    const link = hero.getByRole("link", { name: new RegExp(`^${pillar}:`) });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", href);
  }
  await expect(page.getByText("The house behind every product.")).toHaveCount(
    0,
  );
  await expect(page.locator(".system-section")).toHaveCount(0);

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
      page
        .getByRole("complementary", { name: "Mobile navigation drawer" })
        .getByRole("link", { name: /Formula Vault/ }),
    ).toBeVisible();
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
  ).toBe(false);
});

test("integrates the complete evidence-backed Command sequence", async ({
  page,
}) => {
  await page.goto("/");
  for (const heading of [
    "Product Build Workspace",
    "Development Portfolio",
    "Research & Formula Lab",
    "Sourcing & Packaging Network",
    "Costing & Margin Studio",
    "Product Memory",
    "Launch Readiness",
  ]) {
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
  await expect(page.locator(".foundation-dashboard")).toHaveCount(0);
  await expect(page.locator(".foundation-note")).toHaveCount(0);
  await expect(page.getByText("COGS not calculated")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "No manufacturer selected",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText("1 completed · 5 incomplete")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Calculate Legacy Reserve Batch" }),
  ).toHaveAttribute(
    "href",
    "/formulas/938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8#batch-calculator",
  );
  await expect(
    page.getByRole("link", { name: "View Launch Products" }),
  ).toHaveAttribute("href", "/modules/product-pipeline");
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
    page.getByLabel(
      /Legacy House intelligence core connects Create, Build, Control, and Scale/,
    ),
  ).toBeVisible();
  await expect(page.locator(".core-connections")).toBeVisible();
  await expect(page.locator(".core-ring-outer")).toHaveCSS(
    "animation-iteration-count",
    "1",
  );
});

test("keeps the hero bounded and separated across required viewport widths", async ({
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
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const geometry = await page.locator(".command-hero").evaluate((hero) => {
      const heroRect = hero.getBoundingClientRect();
      const emblemRect = hero
        .querySelector(".core-emblem img")!
        .getBoundingClientRect();
      const nodeRects = Array.from(
        hero.querySelectorAll<HTMLElement>(".command-pillar"),
      ).map((node) => node.getBoundingClientRect());
      const overlaps = nodeRects.some((node, index) =>
        nodeRects
          .slice(index + 1)
          .some(
            (other) =>
              node.left < other.right &&
              node.right > other.left &&
              node.top < other.bottom &&
              node.bottom > other.top,
          ),
      );
      return {
        heroLeft: heroRect.left,
        heroRight: heroRect.right,
        heroBottom: heroRect.bottom,
        emblemWidth: emblemRect.width,
        overlaps,
        documentWidth: document.documentElement.scrollWidth,
      };
    });
    expect(geometry.heroLeft).toBeGreaterThanOrEqual(0);
    expect(geometry.heroRight).toBeLessThanOrEqual(viewport.width + 1);
    expect(
      geometry.heroBottom,
      `Hero geometry at ${viewport.width}x${viewport.height}: ${JSON.stringify(geometry)}`,
    ).toBeLessThanOrEqual(viewport.height + 1);
    expect(geometry.emblemWidth).toBeGreaterThanOrEqual(145);
    expect(geometry.overlaps).toBe(false);
    expect(geometry.documentWidth).toBeLessThanOrEqual(viewport.width);
  }
});

test("keeps the Product Build Workspace compact and bounded at required widths", async ({
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
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const geometry = await page
      .locator(".product-build-workspace")
      .evaluate((workspace) => {
        const box = workspace.getBoundingClientRect();
        const heroBox = document
          .querySelector(".command-hero")!
          .getBoundingClientRect();
        const nextSectionBox =
          workspace.nextElementSibling!.getBoundingClientRect();
        const headingBox = workspace
          .querySelector(".product-build-heading")!
          .getBoundingClientRect();
        const primaryBox = workspace
          .querySelector(".product-build-primary")!
          .getBoundingClientRect();
        const dockBox = workspace
          .querySelector(".product-dock-block")!
          .getBoundingClientRect();
        const railBox = workspace
          .querySelector(".build-stage-rail")!
          .getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          height: box.height,
          followsHero: box.top >= heroBox.bottom - 1,
          precedesNextSection: nextSectionBox.top >= box.bottom - 1,
          documentWidth: document.documentElement.scrollWidth,
          sections: {
            heading: headingBox.height,
            primary: primaryBox.height,
            dock: dockBox.height,
            rail: railBox.height,
            paddingTop: getComputedStyle(workspace).paddingTop,
            paddingBottom: getComputedStyle(workspace).paddingBottom,
          },
        };
      });

    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(viewport.width + 1);
    expect(
      geometry.height,
      `Workspace height at ${viewport.width}x${viewport.height}: ${JSON.stringify(geometry.sections)}`,
    ).toBeLessThan(1200);
    expect(geometry.followsHero).toBe(true);
    expect(geometry.precedesNextSection).toBe(true);
    expect(geometry.documentWidth).toBeLessThanOrEqual(viewport.width);
  }
});

test("offers real product continuation, creation paths, dock, and stage routes", async ({
  page,
}) => {
  await page.goto("/");
  const workspace = page.locator(".product-build-workspace");
  await expect(
    workspace.getByRole("heading", { name: "Product Build Workspace" }),
  ).toBeVisible();
  await expect(
    workspace.getByText("Most advanced active product"),
  ).toBeVisible();
  await expect(
    workspace.getByRole("link", { name: "Continue product" }),
  ).toHaveAttribute("href", "/products/legacy-reserve-hair-beard-oil");
  await expect(workspace.getByRole("button")).toHaveCount(3);
  for (const path of ["Custom Formula", "White-Label", "Product Concept"]) {
    await expect(
      workspace.getByRole("button", { name: new RegExp(path) }),
    ).toBeVisible();
  }
  await expect(
    workspace.getByRole("link", { name: "View all products" }),
  ).toHaveAttribute("href", "/modules/product-pipeline");
  await expect(
    workspace.getByRole("link", { name: /Launch Readiness/ }),
  ).toHaveAttribute("href", "/modules/product-pipeline");
  await expect(
    page.getByRole("heading", { name: "Product development command" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Development Portfolio" }),
  ).toBeVisible();
});

test("filters and focuses the real Development Portfolio", async ({ page }) => {
  await page.goto("/");
  const portfolio = page.locator(".development-portfolio");
  await expect(
    portfolio.getByRole("heading", { name: "Development Portfolio" }),
  ).toBeVisible();
  await expect(
    portfolio.getByRole("link", { name: "View full portfolio" }),
  ).toHaveAttribute("href", "/modules/product-pipeline");
  await expect(
    portfolio.getByRole("button", { name: /Launch Ready, 1 product/ }),
  ).toBeVisible();
  await expect(portfolio.getByRole("button", { name: /^Focus / })).toHaveCount(
    6,
  );
  await expect(
    portfolio.getByRole("link", { name: "Open product" }),
  ).toHaveAttribute("href", "/products/legacy-reserve-hair-beard-oil");
  await expect(
    portfolio.getByRole("link", { name: "Continue build" }),
  ).toHaveAttribute("href", "/formulas/938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8");

  const sanctumFilter = portfolio.getByRole("button", {
    name: /Legacy Sanctum.*9/,
  });
  await sanctumFilter.focus();
  await page.keyboard.press("Enter");
  await expect(sanctumFilter).toHaveAttribute("aria-pressed", "true");
  await expect(portfolio.getByText("Showing 6 of 9")).toBeVisible();
  await expect(
    portfolio
      .getByText("White-label research · No manufacturer selected")
      .first(),
  ).toBeVisible();

  const launchStage = portfolio.getByRole("button", {
    name: /Launch Ready, 0 products/,
  });
  await launchStage.focus();
  await page.keyboard.press("Enter");
  await expect(launchStage).toHaveAttribute("aria-pressed", "true");
  await expect(
    portfolio.getByRole("heading", {
      name: "No products are currently in this stage.",
    }),
  ).toBeVisible();
});

test("keeps the Development Portfolio compact and bounded at required widths", async ({
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
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const geometry = await page
      .locator(".development-portfolio")
      .evaluate((portfolio) => {
        const box = portfolio.getBoundingClientRect();
        const previousBox =
          portfolio.previousElementSibling!.getBoundingClientRect();
        const nextBox = portfolio.nextElementSibling!.getBoundingClientRect();
        const stageTrack = portfolio
          .querySelector(".portfolio-stage-track")!
          .getBoundingClientRect();
        const capsule = portfolio
          .querySelector(".portfolio-capsule")!
          .getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          height: box.height,
          followsWorkspace: box.top >= previousBox.bottom - 1,
          precedesLowerSection: nextBox.top >= box.bottom - 1,
          stageTrackWidth: stageTrack.width,
          capsuleWidth: capsule.width,
          documentWidth: document.documentElement.scrollWidth,
        };
      });
    expect(geometry.left).toBeGreaterThanOrEqual(0);
    expect(geometry.right).toBeLessThanOrEqual(viewport.width + 1);
    expect(
      geometry.height,
      `Portfolio height at ${viewport.width}x${viewport.height}`,
    ).toBeLessThan(1250);
    expect(geometry.followsWorkspace).toBe(true);
    expect(geometry.precedesLowerSection).toBe(true);
    expect(geometry.stageTrackWidth).toBeGreaterThanOrEqual(700);
    expect(geometry.capsuleWidth).toBeGreaterThanOrEqual(180);
    expect(geometry.documentWidth).toBeLessThanOrEqual(viewport.width);
  }
});

test("preserves Development Portfolio selection under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const portfolio = page.locator(".development-portfolio");
  await portfolio.getByRole("button", { name: /Research, 9 products/ }).click();
  await expect(
    portfolio.getByRole("button", { name: /Research, 9 products/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(portfolio.locator(".portfolio-selected-actions")).toBeVisible();
  const duration = await portfolio
    .locator(".portfolio-selected-actions")
    .evaluate((element) => getComputedStyle(element).animationDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});

test("opens every registered pillar destination without a dead route", async ({
  page,
}) => {
  const destinations = [
    ["/modules/product-pipeline", "Product Pipeline"],
    ["/modules/suppliers", "Suppliers"],
    ["/modules/inventory", "Inventory"],
    ["/modules/launches", "Launches"],
  ] as const;
  for (const [href, heading] of destinations) {
    const response = await page.goto(href);
    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
  }
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
