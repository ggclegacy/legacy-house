export const pipelineGroups = {
  concept: ["idea", "product_brief"],
  research: ["research"],
  formula_source: ["formulation", "testing", "refinement"],
  sourcing: ["supplier_sourcing"],
  packaging: ["packaging"],
  costing: ["costing"],
  launch_ready: ["production_ready", "launch_planning", "launched"],
} as const;

export function pipelineGroupFor(
  status: string,
): keyof typeof pipelineGroups | "inactive" {
  for (const [group, statuses] of Object.entries(pipelineGroups)) {
    if ((statuses as readonly string[]).includes(status))
      return group as keyof typeof pipelineGroups;
  }
  return "inactive";
}

export interface AttentionProduct {
  id: string;
  name: string;
  developmentPath: string;
  targetCustomer?: string | null;
  problemToSolve?: string | null;
  formulaCount: number;
}

export interface AttentionFormula {
  id: string;
  name: string;
  totalPercentage: string;
  productionStepCount: number;
}

export function generateAttentionItems(input: {
  products: readonly AttentionProduct[];
  formulas: readonly AttentionFormula[];
}) {
  return [
    ...input.products.flatMap((product) => {
      const items: { entityId: string; label: string; reason: string }[] = [];
      if (!product.targetCustomer || !product.problemToSolve)
        items.push({
          entityId: product.id,
          label: product.name,
          reason: "Product brief is missing required development context.",
        });
      if (
        product.developmentPath === "custom_formula" &&
        product.formulaCount === 0
      )
        items.push({
          entityId: product.id,
          label: product.name,
          reason: "Custom-formula product has no formula family.",
        });
      return items;
    }),
    ...input.formulas.flatMap((formula) => {
      const items: { entityId: string; label: string; reason: string }[] = [];
      if (formula.totalPercentage !== "100")
        items.push({
          entityId: formula.id,
          label: formula.name,
          reason: `Formula total is ${formula.totalPercentage}%, not 100%.`,
        });
      if (formula.productionStepCount === 0)
        items.push({
          entityId: formula.id,
          label: formula.name,
          reason: "Formula has no production steps.",
        });
      return items;
    }),
  ];
}
