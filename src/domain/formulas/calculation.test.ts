import { describe, expect, it } from "vitest";

import { reserveFormulaSeed } from "@/src/domain/development/phase-two-seeds";

import {
  calculateBatch,
  convertFluidOuncesToMilliliters,
  convertMillilitersToFluidOunces,
  formulaTotal,
} from "./calculation";
import { normalizePercentages } from "./decimal";

const reserveIngredients = reserveFormulaSeed.ingredients.map((line) => ({
  id: line.ingredientId,
  name: line.formulaRole,
  percentage: line.percentage,
  densityGramsPerMl: null,
}));

function reserveBatch(bottleCount: number) {
  return calculateBatch({
    basis: "volume_percentage",
    bottleCount,
    bottleSize: "2",
    bottleSizeUnit: "us_fluid_ounces",
    overagePercent: "5",
    ingredients: reserveIngredients,
  });
}

describe("formula calculation", () => {
  it("normalizes percentages without floating-point drift", () => {
    expect(normalizePercentages(["1", "1", "1"])).toEqual([
      "33.333333",
      "33.333333",
      "33.333334",
    ]);
    expect(() => normalizePercentages(["0", "0"])).toThrow(
      "A positive total is required.",
    );
  });
  it.each([
    [["50", "49.999999"], "99.999999", "incomplete"],
    [["76", "15", "5", "0.5", "3.5"], "100", "ready"],
    [["80", "25"], "105", "invalid"],
  ] as const)("classifies decimal-safe totals", (values, total, state) => {
    expect(formulaTotal(values)).toEqual({ total, state });
  });

  it("converts fl oz and mL using the documented constant", () => {
    expect(convertFluidOuncesToMilliliters("42")).toBe("1242.088241625");
    expect(convertMillilitersToFluidOunces("29.5735295625")).toBe("1");
  });

  it.each([
    [10, "21"],
    [20, "42"],
    [30, "63"],
    [40, "84"],
    [50, "105"],
  ])("calculates the canonical Reserve %i-bottle batch", (count, total) => {
    expect(reserveBatch(count).totalFluidOunces).toBe(total);
  });

  it("matches every supplied 20-bottle Reserve amount", () => {
    const result = reserveBatch(20);
    expect(result.requiredFill).toBe("40");
    expect(result.overage).toBe("2");
    expect(result.totalBatch).toBe("42");
    expect(result.totalFluidOunces).toBe("42");
    expect(result.totalMilliliters).toBe("1242.088241625");
    expect(result.ingredients.map((line) => line.fluidOunces)).toEqual([
      "31.92",
      "6.3",
      "2.1",
      "0.21",
      "1.47",
    ]);
    expect(result.ingredients.map((line) => line.milliliters)).toEqual([
      "943.987063635",
      "186.31323624375",
      "62.10441208125",
      "6.210441208125",
      "43.473088456875",
    ]);
    expect(result.ingredients.every((line) => line.grams === null)).toBe(true);
    expect(result.ingredients.every((line) => line.densityRequired)).toBe(true);
  });

  it("supports custom size, count, and overage", () => {
    const result = calculateBatch({
      basis: "volume_percentage",
      bottleCount: 7,
      bottleSize: "30",
      bottleSizeUnit: "milliliters",
      overagePercent: "3.5",
      ingredients: [{ id: "a", name: "A", percentage: "100" }],
    });
    expect(result.requiredFill).toBe("210");
    expect(result.overage).toBe("7.35");
    expect(result.totalBatch).toBe("217.35");
  });

  it("applies selected output precision without floating-point arithmetic", () => {
    expect(
      calculateBatch({
        basis: "volume_percentage",
        bottleCount: 20,
        bottleSize: "2",
        bottleSizeUnit: "us_fluid_ounces",
        overagePercent: "5",
        outputPrecision: 4,
        ingredients: reserveIngredients,
      }).totalMilliliters,
    ).toBe("1242.0882");
  });

  it("blocks calculation unless the formula totals exactly 100%", () => {
    expect(() =>
      calculateBatch({
        basis: "volume_percentage",
        bottleCount: 20,
        bottleSize: "2",
        bottleSizeUnit: "us_fluid_ounces",
        overagePercent: "5",
        ingredients: [{ id: "a", name: "A", percentage: "99.999999" }],
      }),
    ).toThrow("must equal exactly 100%");
  });

  it("calculates weight formulas in grams without volume assumptions", () => {
    const result = calculateBatch({
      basis: "weight_percentage",
      bottleCount: 10,
      bottleSize: "50",
      bottleSizeUnit: "grams",
      overagePercent: "0",
      ingredients: [
        { id: "a", name: "A", percentage: "75" },
        { id: "b", name: "B", percentage: "25" },
      ],
    });
    expect(result.totalGrams).toBe("500");
    expect(result.ingredients.map((line) => line.grams)).toEqual([
      "375",
      "125",
    ]);
    expect(result.totalMilliliters).toBeNull();
  });

  it("rejects invalid counts, sizes, overage, and mixed bases", () => {
    const base = {
      basis: "volume_percentage" as const,
      bottleCount: 1,
      bottleSize: "1",
      bottleSizeUnit: "us_fluid_ounces" as const,
      overagePercent: "0",
      ingredients: [{ id: "a", name: "A", percentage: "100" }],
    };
    expect(() => calculateBatch({ ...base, bottleCount: 0 })).toThrow();
    expect(() => calculateBatch({ ...base, bottleSize: "0" })).toThrow();
    expect(() => calculateBatch({ ...base, overagePercent: "-1" })).toThrow();
    expect(() =>
      calculateBatch({ ...base, bottleSizeUnit: "grams" }),
    ).toThrow();
    expect(() =>
      calculateBatch({
        ...base,
        basis: "weight_percentage",
        bottleSizeUnit: "milliliters",
      }),
    ).toThrow("requires grams");
  });
});
