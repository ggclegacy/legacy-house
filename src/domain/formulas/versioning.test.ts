import { describe, expect, it } from "vitest";

import {
  compareFormulaVersions,
  createFormulaRevision,
  formulaCanBeEditedInPlace,
  type FormulaRevisionSource,
} from "./versioning";

const source: FormulaRevisionSource = {
  id: "v1",
  version: "1.0",
  status: "production_ready",
  formulaBasis: "volume_percentage",
  defaultBottleSize: "2",
  defaultBottleSizeUnit: "us_fluid_ounces",
  defaultBottleCount: 20,
  defaultOveragePercent: "5",
  ingredients: [
    {
      ingredientId: "a",
      ingredientName: "A",
      percentage: "100",
      sortOrder: 10,
      isConcentratedExtract: false,
      isFragrance: false,
    },
  ],
  productionSteps: [
    {
      phase: "Preparation",
      stepNumber: 1,
      instruction: "Documented instruction",
      required: true,
    },
  ],
};

describe("formula versioning", () => {
  it("creates a draft revision with copied lines and steps", () => {
    const revision = createFormulaRevision(source, "Adjust sensory profile.");
    expect(revision.version).toBe("1.1");
    expect(revision.previousVersionId).toBe("v1");
    expect(revision.ingredients).toEqual(source.ingredients);
    expect(revision.productionSteps).toEqual(source.productionSteps);
    expect(revision.ingredients).not.toBe(source.ingredients);
  });

  it("rejects invalid numbering and missing change reasons", () => {
    expect(() => createFormulaRevision(source, "short")).toThrow(
      "change reason",
    );
    expect(() =>
      createFormulaRevision(
        { ...source, version: "version-one" },
        "Meaningful change reason.",
      ),
    ).toThrow("major.minor");
  });

  it("protects controlled versions from in-place edits", () => {
    expect(formulaCanBeEditedInPlace("draft")).toBe(true);
    expect(formulaCanBeEditedInPlace("approved")).toBe(false);
    expect(formulaCanBeEditedInPlace("production_ready")).toBe(false);
  });

  it("compares added, removed, changed, and production-step differences", () => {
    const after: FormulaRevisionSource = {
      ...source,
      ingredients: [
        { ...source.ingredients[0]!, percentage: "90" },
        {
          ...source.ingredients[0]!,
          ingredientId: "b",
          ingredientName: "B",
          percentage: "10",
        },
      ],
      productionSteps: [],
    };
    const comparison = compareFormulaVersions(source, after);
    expect(comparison.added.map((line) => line.ingredientId)).toEqual(["b"]);
    expect(comparison.changed).toEqual([
      { ingredientId: "a", ingredientName: "A", before: "100", after: "90" },
    ]);
    expect(comparison.productionStepsChanged).toBe(true);
    expect(
      compareFormulaVersions(source, {
        ...source,
        ingredients: [],
        productionSteps: source.productionSteps,
      }).removed.map((line) => line.ingredientId),
    ).toEqual(["a"]);
  });
});
