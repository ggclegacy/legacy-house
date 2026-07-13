import { describe, expect, it } from "vitest";

import { createProductLineInput } from "./product-line";

describe("product-line input", () => {
  it("accepts a controlled product-line definition", () => {
    expect(
      createProductLineInput.safeParse({
        name: "Future Line",
        slug: "future-line",
        description: "A deliberately generic validation-test description.",
        accentTheme: "house",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid slugs and incomplete descriptions", () => {
    expect(
      createProductLineInput.safeParse({
        name: "Future Line",
        slug: "Future Line",
        description: "short",
        accentTheme: "house",
      }).success,
    ).toBe(false);
  });
});
