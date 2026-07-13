import { describe, expect, it } from "vitest";

import {
  canonicalDevelopmentSnapshot,
  searchDevelopmentSnapshot,
} from "./snapshot";

describe("development search", () => {
  it("finds products, formulas, and ingredients across connected records", () => {
    expect(
      searchDevelopmentSnapshot(canonicalDevelopmentSnapshot, "VITALIS")
        .products,
    ).toHaveLength(1);
    expect(
      searchDevelopmentSnapshot(canonicalDevelopmentSnapshot, "1.0").formulas,
    ).toHaveLength(1);
    expect(
      searchDevelopmentSnapshot(canonicalDevelopmentSnapshot, "Marula")
        .ingredients,
    ).toHaveLength(1);
  });
});
