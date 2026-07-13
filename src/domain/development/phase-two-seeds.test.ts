import { describe, expect, it } from "vitest";

import { formulaTotal } from "@/src/domain/formulas/calculation";

import {
  phaseTwoProductSeeds,
  reserveFormulaSeed,
  reserveIngredientSeeds,
} from "./phase-two-seeds";

describe("approved Phase 02 seed definitions", () => {
  it("preserves the supplied Reserve formula exactly", () => {
    expect(
      reserveFormulaSeed.ingredients.map((line) => line.percentage),
    ).toEqual(["76", "15", "5", "0.5", "3.5"]);
    expect(
      formulaTotal(
        reserveFormulaSeed.ingredients.map((line) => line.percentage),
      ),
    ).toEqual({ total: "100", state: "ready" });
    expect(reserveFormulaSeed.version.status).toBe("production_ready");
  });

  it("creates exactly nine Sanctum research planning records without formulas", () => {
    const sanctum = phaseTwoProductSeeds.filter(
      (product) => product.developmentPath === "white_label",
    );
    expect(sanctum).toHaveLength(9);
    expect(
      sanctum.every((product) => product.pipelineStatus === "research"),
    ).toBe(true);
    expect(reserveFormulaSeed.family.productId).toBe(
      phaseTwoProductSeeds[0].id,
    );
  });

  it("keeps all ingredient densities unknown", () => {
    expect(
      reserveIngredientSeeds.every(
        (ingredient) => !("densityGramsPerMl" in ingredient),
      ),
    ).toBe(true);
  });
});
