import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import {
  labelFor,
  pipelineStatuses,
} from "@/src/domain/development/development";
import type {
  DevelopmentProduct,
  DevelopmentSnapshot,
} from "@/src/domain/development/snapshot";

type PipelineStatus = (typeof pipelineStatuses)[number];

export const developmentPortfolioStages = [
  { id: "concept", label: "Concept", icon: "spark" },
  { id: "research", label: "Research", icon: "search" },
  { id: "formula_source", label: "Formula / Source", icon: "vessel" },
  { id: "sourcing", label: "Sourcing", icon: "link" },
  { id: "packaging", label: "Packaging", icon: "package" },
  { id: "costing", label: "Costing", icon: "measure" },
  { id: "launch_ready", label: "Launch Ready", icon: "launch" },
] as const;

export type PortfolioStageId =
  (typeof developmentPortfolioStages)[number]["id"];

export const portfolioStageByDetailedStatus = {
  idea: "concept",
  research: "research",
  product_brief: "concept",
  formulation: "formula_source",
  supplier_sourcing: "sourcing",
  testing: "formula_source",
  refinement: "formula_source",
  packaging: "packaging",
  costing: "costing",
  production_ready: "launch_ready",
  launch_planning: "launch_ready",
  launched: "launch_ready",
  on_hold: null,
  archived: null,
} as const satisfies Record<PipelineStatus, PortfolioStageId | null>;

export interface PortfolioProduct {
  id: string;
  slug: string;
  name: string;
  productLineId: string;
  productLineName: string;
  productLineSlug: string;
  accent: "reserve" | "sanctum" | "house";
  developmentPath: string;
  detailedStatus: string;
  stageId: PortfolioStageId | null;
  supportingDetail: string;
  openHref: string;
  continueHref: string | null;
  updatedAt: string | null;
}

export interface DevelopmentPortfolioModel {
  products: readonly PortfolioProduct[];
  productLines: readonly {
    id: string;
    name: string;
    slug: string;
  }[];
}

export function portfolioStageFor(status: string): PortfolioStageId | null {
  return portfolioStageByDetailedStatus[status as PipelineStatus] ?? null;
}

function productAccent(productLineSlug: string): PortfolioProduct["accent"] {
  if (productLineSlug === "legacy-reserve") return "reserve";
  if (productLineSlug === "legacy-sanctum") return "sanctum";
  return "house";
}

function updatedTime(product: DevelopmentProduct): number | null {
  if (!product.updatedAt) return null;
  const parsed = Date.parse(product.updatedAt);
  return Number.isNaN(parsed) ? null : parsed;
}

function stageOrder(stageId: PortfolioStageId | null): number {
  if (!stageId) return -1;
  return developmentPortfolioStages.findIndex((stage) => stage.id === stageId);
}

export function buildDevelopmentPortfolioModel(
  development: DevelopmentSnapshot,
  commercial: CommercialSnapshot,
): DevelopmentPortfolioModel {
  const activeProducts = development.products.filter(
    (product) => product.active,
  );
  const hasRecordedUpdate = activeProducts.some(
    (product) => updatedTime(product) !== null,
  );
  const rankedProducts = [...activeProducts].sort((left, right) => {
    if (hasRecordedUpdate) {
      const updateDifference =
        (updatedTime(right) ?? Number.NEGATIVE_INFINITY) -
        (updatedTime(left) ?? Number.NEGATIVE_INFINITY);
      if (updateDifference !== 0) return updateDifference;
    }
    const stageDifference =
      stageOrder(portfolioStageFor(right.pipelineStatus)) -
      stageOrder(portfolioStageFor(left.pipelineStatus));
    return (
      stageDifference ||
      left.productLineName.localeCompare(right.productLineName) ||
      left.name.localeCompare(right.name)
    );
  });

  const products = rankedProducts.map((product): PortfolioProduct => {
    const activeFormula =
      development.formulas.find(
        (formula) =>
          formula.productId === product.id &&
          formula.activeVersionId === formula.versionId,
      ) ?? null;
    const activeConfiguration =
      commercial.configurations.find(
        (configuration) =>
          configuration.productId === product.id &&
          configuration.active &&
          !configuration.archivedAt,
      ) ?? null;
    const candidate = commercial.candidates.find(
      (item) => item.productId === product.id,
    );
    const catalogProduct = candidate?.manufacturerCatalogProductId
      ? commercial.catalogProducts.find(
          (item) => item.id === candidate.manufacturerCatalogProductId,
        )
      : null;
    const experiment = development.experiments.find(
      (item) => item.productId === product.id,
    );
    const configurationSnapshot = activeConfiguration
      ? commercial.snapshots.find(
          (item) =>
            item.finishedProductConfigurationId === activeConfiguration.id,
        )
      : null;
    const configurationScenario = activeConfiguration
      ? commercial.scenarios.find(
          (item) =>
            item.finishedProductConfigurationId === activeConfiguration.id &&
            !item.archivedAt,
        )
      : null;

    let supportingDetail: string;
    let continueHref: string | null = null;
    if (activeFormula) {
      supportingDetail = `Formula ${activeFormula.version} · ${labelFor(activeFormula.status)}`;
      continueHref = `/formulas/${activeFormula.versionId}`;
    } else if (catalogProduct) {
      supportingDetail = `Source candidate · ${catalogProduct.name}`;
      continueHref = "/modules/manufacturers";
    } else if (candidate) {
      supportingDetail = `Manufacturer candidate · ${labelFor(candidate.status)}`;
      continueHref = "/modules/manufacturers";
    } else if (configurationSnapshot) {
      supportingDetail = "Completed costing snapshot recorded";
      continueHref = `/configurations/${activeConfiguration!.id}`;
    } else if (configurationScenario) {
      supportingDetail = `Cost scenario · ${configurationScenario.name}`;
      continueHref = `/configurations/${activeConfiguration!.id}`;
    } else if (activeConfiguration) {
      supportingDetail = `Active configuration · ${activeConfiguration.name}`;
      continueHref = `/configurations/${activeConfiguration.id}`;
    } else if (experiment) {
      supportingDetail = `${experiment.experimentNumber} · ${labelFor(experiment.status)}`;
      continueHref = `/experiments/${experiment.id}`;
    } else if (product.developmentPath === "white_label") {
      supportingDetail = "White-label research · No manufacturer selected";
    } else if (product.developmentPath === "undecided") {
      supportingDetail = "Development path not selected";
    } else {
      supportingDetail = `Detailed status · ${labelFor(product.pipelineStatus)}`;
    }

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      productLineId: product.productLineId,
      productLineName: product.productLineName,
      productLineSlug: product.productLineSlug,
      accent: productAccent(product.productLineSlug),
      developmentPath: product.developmentPath,
      detailedStatus: product.pipelineStatus,
      stageId: portfolioStageFor(product.pipelineStatus),
      supportingDetail,
      openHref: `/products/${product.slug}`,
      continueHref,
      updatedAt: product.updatedAt,
    };
  });

  return {
    products,
    productLines: [
      ...new Map(
        products.map((product) => [
          product.productLineId,
          {
            id: product.productLineId,
            name: product.productLineName,
            slug: product.productLineSlug,
          },
        ]),
      ).values(),
    ].sort((left, right) => left.name.localeCompare(right.name)),
  };
}
