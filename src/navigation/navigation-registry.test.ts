import { describe, expect, it } from "vitest";

import { navigationDestinations } from "./navigation-registry";

describe("navigation registry", () => {
  it("registers the permanent destination set once", () => {
    expect(
      navigationDestinations.map((destination) => destination.label),
    ).toEqual([
      "Command",
      "Product Pipeline",
      "Formula Vault",
      "Ingredients",
      "R&D Lab",
      "Suppliers",
      "Manufacturers",
      "Packaging",
      "Costing",
      "Inventory",
      "Production",
      "Quality",
      "Launches",
      "Market",
      "Documents",
      "Settings",
    ]);
    expect(
      new Set(navigationDestinations.map((destination) => destination.href))
        .size,
    ).toBe(navigationDestinations.length);
  });

  it("marks only Command and Settings as Phase 1 destinations", () => {
    expect(
      navigationDestinations
        .filter((destination) => destination.phase === 1)
        .map((destination) => destination.id),
    ).toEqual(["command", "settings"]);
  });
});
