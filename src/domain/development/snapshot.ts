import {
  phaseTwoProductSeeds,
  reserveFormulaSeed,
  reserveIngredientSeeds,
} from "./phase-two-seeds";

export interface DevelopmentProduct {
  id: string;
  productLineId: string;
  productLineName: string;
  productLineSlug: string;
  name: string;
  slug: string;
  description: string | null;
  productType: string | null;
  developmentPath: string;
  pipelineStatus: string;
  priority: string;
  targetCustomer: string | null;
  problemToSolve: string | null;
  desiredBenefits: string | null;
  desiredFormat: string | null;
  desiredTexture: string | null;
  desiredAbsorption: string | null;
  desiredColor: string | null;
  desiredAroma: string | null;
  targetRetailPrice: string | null;
  targetWholesalePrice: string | null;
  maximumTargetCogs: string | null;
  targetPackaging: string | null;
  targetLaunchDate: string | null;
  active: boolean;
  updatedAt: string | null;
}

export interface DevelopmentIngredient {
  id: string;
  commonName: string;
  inciName: string | null;
  casNumber: string | null;
  category: string;
  description: string | null;
  functions: readonly string[];
  densityGramsPerMl: string | null;
  physicalForm: string | null;
  naturalColor: string | null;
  naturalAroma: string | null;
  recommendedUsageMinimum: string | null;
  recommendedUsageMaximum: string | null;
  solubility: string | null;
  heatSensitivity: string | null;
  oxidationSensitivity: string | null;
  storageConditions: string | null;
  shelfLifeMonths: number | null;
  formulationConcerns: string | null;
  notes: string | null;
  archivedAt: string | null;
}

export interface DevelopmentFormulaLine {
  id: string;
  ingredientId: string;
  ingredientName: string;
  category: string;
  percentage: string;
  sortOrder: number;
  formulaRole: string | null;
  processingNotes: string | null;
  isConcentratedExtract: boolean;
  isFragrance: boolean;
  densityGramsPerMl: string | null;
}

export interface DevelopmentFormula {
  familyId: string;
  productId: string;
  productName: string;
  productSlug: string;
  productLineName: string;
  familyName: string;
  description: string | null;
  activeVersionId: string | null;
  versionId: string;
  versionName: string;
  version: string;
  formulaBasis: "volume_percentage" | "weight_percentage";
  status: string;
  defaultBottleSize: string | null;
  defaultBottleSizeUnit: "us_fluid_ounces" | "milliliters" | "grams" | null;
  defaultBottleCount: number | null;
  defaultOveragePercent: string | null;
  changeReason: string | null;
  previousVersionId: string | null;
  updatedAt: string | null;
  ingredients: readonly DevelopmentFormulaLine[];
  productionSteps: readonly {
    id: string;
    phase: string;
    stepNumber: number;
    instruction: string;
    required: boolean;
    notes: string | null;
  }[];
}

export interface DevelopmentExperiment {
  id: string;
  productId: string;
  formulaVersionId: string;
  experimentNumber: string;
  name: string;
  objective: string;
  hypothesis: string;
  testBatchSize: string;
  testBatchUnit: "us_fluid_ounces" | "milliliters" | "grams";
  status: string;
  result: string;
  productionDate: string | null;
  conclusion: string | null;
  nextChange: string | null;
  observationCount: number;
}

export interface DevelopmentSnapshot {
  persistence: "database" | "unavailable";
  products: readonly DevelopmentProduct[];
  briefs: readonly {
    productId: string;
    ingredientsToExplore: string | null;
    ingredientsToAvoid: string | null;
    competitiveReferences: string | null;
    notes: string | null;
  }[];
  ingredients: readonly DevelopmentIngredient[];
  formulas: readonly DevelopmentFormula[];
  experiments: readonly DevelopmentExperiment[];
  notes: readonly {
    id: string;
    productId: string;
    noteType: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
  decisions: readonly {
    id: string;
    productId: string;
    title: string;
    decision: string;
    reason: string;
    evidence: string | null;
    expectedOutcome: string | null;
    actualOutcome: string | null;
    status: string;
    decisionDate: string;
    reviewDate: string | null;
  }[];
  activity: readonly {
    id: string;
    entityType: string;
    entityId: string;
    action: string;
    title: string;
    description: string | null;
    createdAt: string;
  }[];
}

const lineNames = new Map<string, (typeof reserveIngredientSeeds)[number]>(
  reserveIngredientSeeds.map((ingredient) => [ingredient.id, ingredient]),
);

export const canonicalDevelopmentSnapshot: DevelopmentSnapshot = {
  persistence: "unavailable",
  products: phaseTwoProductSeeds.map((product) => ({
    ...product,
    productLineName:
      product.productLineId === phaseTwoProductSeeds[0].productLineId
        ? "Legacy Reserve"
        : "Legacy Sanctum",
    productLineSlug:
      product.productLineId === phaseTwoProductSeeds[0].productLineId
        ? "legacy-reserve"
        : "legacy-sanctum",
    targetCustomer: null,
    problemToSolve: null,
    desiredBenefits: null,
    desiredFormat: null,
    desiredTexture: null,
    desiredAbsorption: null,
    desiredColor: null,
    desiredAroma: null,
    targetRetailPrice: null,
    targetWholesalePrice: null,
    maximumTargetCogs: null,
    targetPackaging: null,
    targetLaunchDate: null,
    active: true,
    updatedAt: null,
  })),
  briefs: [],
  ingredients: reserveIngredientSeeds.map((ingredient) => ({
    ...ingredient,
    inciName: null,
    casNumber: null,
    densityGramsPerMl: null,
    physicalForm: null,
    naturalColor: null,
    naturalAroma: null,
    recommendedUsageMinimum: null,
    recommendedUsageMaximum: null,
    solubility: null,
    heatSensitivity: null,
    oxidationSensitivity: null,
    storageConditions: null,
    shelfLifeMonths: null,
    formulationConcerns: null,
    archivedAt: null,
  })),
  formulas: [
    {
      familyId: reserveFormulaSeed.family.id,
      productId: reserveFormulaSeed.family.productId,
      productName: "Legacy Reserve Hair & Beard Oil",
      productSlug: "legacy-reserve-hair-beard-oil",
      productLineName: "Legacy Reserve",
      familyName: reserveFormulaSeed.family.name,
      description: reserveFormulaSeed.family.description,
      activeVersionId: reserveFormulaSeed.family.activeVersionId,
      versionId: reserveFormulaSeed.version.id,
      versionName: reserveFormulaSeed.version.name,
      version: reserveFormulaSeed.version.version,
      formulaBasis: reserveFormulaSeed.version.formulaBasis,
      status: reserveFormulaSeed.version.status,
      defaultBottleSize: reserveFormulaSeed.version.defaultBottleSize,
      defaultBottleSizeUnit: reserveFormulaSeed.version.defaultBottleSizeUnit,
      defaultBottleCount: reserveFormulaSeed.version.defaultBottleCount,
      defaultOveragePercent: reserveFormulaSeed.version.defaultOveragePercent,
      changeReason: reserveFormulaSeed.version.changeReason,
      previousVersionId: null,
      updatedAt: null,
      ingredients: reserveFormulaSeed.ingredients.map((line) => ({
        ...line,
        ingredientName:
          lineNames.get(line.ingredientId)?.commonName ?? "Unknown",
        category: lineNames.get(line.ingredientId)?.category ?? "other",
        densityGramsPerMl: null,
      })),
      productionSteps: [],
    },
  ],
  experiments: [],
  notes: [],
  decisions: [],
  activity: [],
};

export function searchDevelopmentSnapshot(
  snapshot: DevelopmentSnapshot,
  query: string,
) {
  const normalized = query.trim().toLocaleLowerCase();
  const matches = (...values: (string | null | undefined)[]) =>
    values.join(" ").toLocaleLowerCase().includes(normalized);
  return {
    products: snapshot.products.filter((item) =>
      matches(item.name, item.description, item.productLineName),
    ),
    ingredients: snapshot.ingredients.filter((item) =>
      matches(item.commonName, item.inciName, item.description),
    ),
    formulas: snapshot.formulas.filter((item) =>
      matches(item.familyName, item.version, item.productName),
    ),
    experiments: snapshot.experiments.filter((item) =>
      matches(item.name, item.experimentNumber, item.objective),
    ),
  };
}
