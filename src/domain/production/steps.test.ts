import { describe, expect, it } from "vitest";

import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import {
  legacyReserveDraftStepHeadings,
  productionStepsForBatch,
} from "./steps";

describe("productionStepsForBatch", () => {
  it("creates the authorized draft order for the exact formula version", () => {
    const formula = canonicalDevelopmentSnapshot.formulas[0]!;
    const steps = productionStepsForBatch(formula);

    expect(steps.map((step) => step.phase)).toEqual(
      legacyReserveDraftStepHeadings,
    );
    expect(steps.map((step) => step.stepNumber)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(
      steps.every((step) => step.formulaVersionId === formula.versionId),
    ).toBe(true);
    expect(steps.every((step) => step.source === "draft")).toBe(true);
    expect(steps.every((step) => step.instruction === "")).toBe(true);
  });

  it("keeps stored steps and ties them to the requested version", () => {
    const formula = canonicalDevelopmentSnapshot.formulas[0]!;
    const steps = productionStepsForBatch({
      ...formula,
      productionSteps: [
        {
          id: "stored-1",
          phase: "Verified phase",
          stepNumber: 1,
          instruction: "Verified instruction",
          required: true,
          notes: null,
        },
      ],
    });

    expect(steps).toEqual([
      expect.objectContaining({
        id: "stored-1",
        formulaVersionId: formula.versionId,
        source: "stored",
      }),
    ]);
  });
});
