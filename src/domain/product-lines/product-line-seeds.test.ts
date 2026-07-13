import { describe, expect, it } from "vitest";

import { productLineSeedDefinitions } from "./product-line-seeds";

describe("product-line seed definitions", () => {
  it("contains only the two authorized real product lines", () => {
    expect(productLineSeedDefinitions.map((line) => line.name)).toEqual([
      "Legacy Reserve",
      "Legacy Sanctum",
    ]);
    expect(
      productLineSeedDefinitions.every((line) => line.id && line.description),
    ).toBe(true);
  });

  it("uses stable unique identities and ordering", () => {
    expect(
      new Set(productLineSeedDefinitions.map((line) => line.id)).size,
    ).toBe(2);
    expect(
      new Set(productLineSeedDefinitions.map((line) => line.slug)).size,
    ).toBe(2);
    expect(productLineSeedDefinitions.map((line) => line.sortOrder)).toEqual([
      10, 20,
    ]);
  });
});
