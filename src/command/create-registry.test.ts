import { describe, expect, it } from "vitest";

import { createActionRegistry } from "./create-registry";

describe("global create registry", () => {
  it("registers only implemented foundation and Phase 02 actions", () => {
    expect(createActionRegistry.map((action) => action.kind)).toEqual([
      "product-line",
      "product",
      "formula",
      "ingredient",
      "experiment",
      "product-note",
      "product-decision",
    ]);
    expect(new Set(createActionRegistry.map((action) => action.id)).size).toBe(
      createActionRegistry.length,
    );
  });
});
