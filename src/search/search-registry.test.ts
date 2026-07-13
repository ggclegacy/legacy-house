import { describe, expect, it } from "vitest";

import { searchEntries, searchRegistry } from "./search-registry";

describe("global search registry", () => {
  it("groups foundation and Phase 02 records", () => {
    const groups = new Set(searchRegistry.map((entry) => entry.group));
    for (const group of [
      "Navigation",
      "Products",
      "Formulas",
      "Ingredients",
      "Product lines",
      "Settings",
      "Documentation",
    ])
      expect(groups.has(group as never)).toBe(true);
  });

  it("searches registered facts without generated records", () => {
    expect(searchEntries("sanctum").map((entry) => entry.label)).toContain(
      "Legacy Sanctum",
    );
    expect(searchEntries("currency").map((entry) => entry.label)).toContain(
      "Formatting defaults",
    );
    expect(searchEntries("Marula").map((entry) => entry.label)).toContain(
      "Marula Oil",
    );
    expect(searchEntries("not-a-real-record")).toEqual([]);
  });
});
