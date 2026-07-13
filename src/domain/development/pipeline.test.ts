import { describe, expect, it } from "vitest";

import { generateAttentionItems, pipelineGroupFor } from "./pipeline";

describe("pipeline intelligence", () => {
  it("maps detailed state without replacing it", () => {
    expect(pipelineGroupFor("product_brief")).toBe("concept");
    expect(pipelineGroupFor("testing")).toBe("formula_source");
    expect(pipelineGroupFor("production_ready")).toBe("launch_ready");
    expect(pipelineGroupFor("on_hold")).toBe("inactive");
  });

  it("generates only deterministic attention reasons", () => {
    const items = generateAttentionItems({
      products: [
        {
          id: "p",
          name: "Product",
          developmentPath: "custom_formula",
          targetCustomer: null,
          problemToSolve: null,
          formulaCount: 0,
        },
      ],
      formulas: [
        {
          id: "f",
          name: "Formula",
          totalPercentage: "99.5",
          productionStepCount: 0,
        },
      ],
    });
    expect(items.map((item) => item.reason)).toEqual([
      "Product brief is missing required development context.",
      "Custom-formula product has no formula family.",
      "Formula total is 99.5%, not 100%.",
      "Formula has no production steps.",
    ]);
    expect(
      generateAttentionItems({
        products: [
          {
            id: "complete",
            name: "Complete",
            developmentPath: "white_label",
            targetCustomer: "Entered",
            problemToSolve: "Entered",
            formulaCount: 0,
          },
        ],
        formulas: [
          {
            id: "ready",
            name: "Ready",
            totalPercentage: "100",
            productionStepCount: 1,
          },
        ],
      }),
    ).toEqual([]);
  });
});
