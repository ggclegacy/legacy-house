export interface CommercialReadinessContext {
  developmentPath: string;
  hasFormula: boolean;
  ingredientCount: number;
  sourcedIngredientCount: number;
  hasManufacturerCandidate: boolean;
  hasPackaging: boolean;
  hasCostSnapshot: boolean;
  hasRetailPrice: boolean;
  documentCount: number;
}
export function evaluateCommercialReadiness(
  context: CommercialReadinessContext,
) {
  const items = [
    {
      key: "source",
      label:
        context.developmentPath === "custom_formula"
          ? "Formula supplier coverage"
          : "Manufacturer candidate",
      complete:
        context.developmentPath === "custom_formula"
          ? context.ingredientCount > 0 &&
            context.sourcedIngredientCount === context.ingredientCount
          : context.hasManufacturerCandidate,
    },
    {
      key: "packaging",
      label: "Packaging configuration",
      complete: context.hasPackaging,
    },
    {
      key: "costing",
      label: "Cost snapshot",
      complete: context.hasCostSnapshot,
    },
    { key: "pricing", label: "Retail price", complete: context.hasRetailPrice },
    {
      key: "documents",
      label: "Commercial documents",
      complete: context.documentCount > 0,
    },
  ];
  return {
    items,
    complete: items.every((item) => item.complete),
    blockers: items.filter((item) => !item.complete).map((item) => item.label),
  };
}

export function documentStatus(
  expirationDate: string | null,
  today: string,
  thresholdDays = 60,
  manualNeedsReview = false,
) {
  if (manualNeedsReview) return "needs_review" as const;
  if (!expirationDate) return "missing_information" as const;
  const remaining = Math.ceil(
    (new Date(`${expirationDate}T00:00:00Z`).getTime() -
      new Date(`${today}T00:00:00Z`).getTime()) /
      86_400_000,
  );
  if (remaining < 0) return "expired" as const;
  if (remaining <= thresholdDays) return "expiring_soon" as const;
  return "current" as const;
}

export function isSupplierPriceStale(
  lastVerifiedAt: string | null,
  today: string,
  thresholdDays = 90,
) {
  if (!lastVerifiedAt) return true;
  return (
    (new Date(`${today}T00:00:00Z`).getTime() -
      new Date(lastVerifiedAt).getTime()) /
      86_400_000 >
    thresholdDays
  );
}
