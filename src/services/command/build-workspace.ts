import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import type {
  DevelopmentFormula,
  DevelopmentProduct,
  DevelopmentSnapshot,
} from "@/src/domain/development/snapshot";

const stageRank: Readonly<Record<string, number>> = {
  idea: 0,
  research: 1,
  product_brief: 2,
  formulation: 3,
  testing: 4,
  refinement: 5,
  supplier_sourcing: 6,
  packaging: 7,
  costing: 8,
  production_ready: 9,
  launch_planning: 10,
  launched: 11,
  discontinued: -1,
};

export interface ProductBuildWorkspaceModel {
  continuation: {
    basis: "recently_updated" | "most_advanced";
    product: DevelopmentProduct;
    formula: DevelopmentFormula | null;
    configuration: CommercialSnapshot["configurations"][number] | null;
  } | null;
  dockProducts: readonly DevelopmentProduct[];
}

function updatedTime(product: DevelopmentProduct): number | null {
  if (!product.updatedAt) return null;
  const parsed = Date.parse(product.updatedAt);
  return Number.isNaN(parsed) ? null : parsed;
}

export function buildProductWorkspaceModel(
  development: DevelopmentSnapshot,
  commercial: CommercialSnapshot,
): ProductBuildWorkspaceModel {
  const activeProducts = development.products.filter(
    (product) => product.active,
  );
  const hasRecordedUpdate = activeProducts.some(
    (product) => updatedTime(product) !== null,
  );
  const ranked = [...activeProducts].sort((left, right) => {
    if (hasRecordedUpdate) {
      const updateDifference =
        (updatedTime(right) ?? Number.NEGATIVE_INFINITY) -
        (updatedTime(left) ?? Number.NEGATIVE_INFINITY);
      if (updateDifference !== 0) return updateDifference;
    }
    const stageDifference =
      (stageRank[right.pipelineStatus] ?? 0) -
      (stageRank[left.pipelineStatus] ?? 0);
    return stageDifference || left.name.localeCompare(right.name);
  });
  const product = ranked[0];

  if (!product) {
    return { continuation: null, dockProducts: [] };
  }

  const productFormulas = development.formulas.filter(
    (formula) => formula.productId === product.id,
  );
  const formula =
    productFormulas.find(
      (candidate) => candidate.activeVersionId === candidate.versionId,
    ) ??
    productFormulas[0] ??
    null;
  const configuration =
    commercial.configurations.find(
      (candidate) =>
        candidate.productId === product.id &&
        candidate.active &&
        !candidate.archivedAt,
    ) ?? null;

  return {
    continuation: {
      basis: hasRecordedUpdate ? "recently_updated" : "most_advanced",
      product,
      formula,
      configuration,
    },
    dockProducts: ranked.slice(0, 5),
  };
}
