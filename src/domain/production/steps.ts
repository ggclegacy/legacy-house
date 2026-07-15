import type { DevelopmentFormula } from "@/src/domain/development/snapshot";

export interface BatchProductionStep {
  id: string;
  formulaVersionId: string;
  phase: string;
  stepNumber: number;
  instruction: string;
  required: boolean;
  notes: string | null;
  source: "stored" | "draft";
}

export const legacyReserveDraftStepHeadings = [
  "Preparation",
  "Measure Premixed Natural Oil Base",
  "Add Marula Oil",
  "Add Tamanu Oil",
  "Prepare and Add Sea Buckthorn CO₂ Extract",
  "Add Fragrance",
  "Mix Until Uniform",
  "Rest and Inspect",
  "Bottle",
  "Final Count and Notes",
] as const;

export function productionStepsForBatch(
  formula: DevelopmentFormula,
): BatchProductionStep[] {
  if (formula.productionSteps.length) {
    return formula.productionSteps.map((step) => ({
      ...step,
      formulaVersionId: formula.versionId,
      source: "stored" as const,
    }));
  }

  return legacyReserveDraftStepHeadings.map((phase, index) => ({
    id: `${formula.versionId}-draft-step-${index + 1}`,
    formulaVersionId: formula.versionId,
    phase,
    stepNumber: index + 1,
    instruction: "",
    required: false,
    notes: null,
    source: "draft" as const,
  }));
}
