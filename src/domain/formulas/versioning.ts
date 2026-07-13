export interface VersionedFormulaLine {
  ingredientId: string;
  ingredientName: string;
  percentage: string;
  sortOrder: number;
  formulaRole?: string | null;
  processingNotes?: string | null;
  isConcentratedExtract: boolean;
  isFragrance: boolean;
}

export interface VersionedProductionStep {
  phase: string;
  stepNumber: number;
  instruction: string;
  required: boolean;
  notes?: string | null;
}

export interface FormulaRevisionSource {
  id: string;
  version: string;
  status: string;
  formulaBasis: string;
  defaultBottleSize?: string | null;
  defaultBottleSizeUnit?: string | null;
  defaultBottleCount?: number | null;
  defaultOveragePercent?: string | null;
  ingredients: readonly VersionedFormulaLine[];
  productionSteps: readonly VersionedProductionStep[];
}

export function nextFormulaVersion(version: string): string {
  const match = /^(\d+)\.(\d+)$/.exec(version);
  if (!match)
    throw new Error("Formula versions must use major.minor numbering.");
  return `${match[1]}.${Number(match[2]) + 1}`;
}

export function createFormulaRevision(
  source: FormulaRevisionSource,
  changeReason: string,
  status: "draft" | "experimental" = "draft",
) {
  if (changeReason.trim().length < 8)
    throw new Error("A meaningful change reason is required.");
  return {
    version: nextFormulaVersion(source.version),
    previousVersionId: source.id,
    changeReason: changeReason.trim(),
    status,
    formulaBasis: source.formulaBasis,
    defaultBottleSize: source.defaultBottleSize,
    defaultBottleSizeUnit: source.defaultBottleSizeUnit,
    defaultBottleCount: source.defaultBottleCount,
    defaultOveragePercent: source.defaultOveragePercent,
    ingredients: source.ingredients.map((line) => ({ ...line })),
    productionSteps: source.productionSteps.map((step) => ({ ...step })),
  };
}

export function formulaCanBeEditedInPlace(status: string): boolean {
  return !["approved", "production_ready", "superseded", "archived"].includes(
    status,
  );
}

export interface FormulaComparison {
  added: readonly VersionedFormulaLine[];
  removed: readonly VersionedFormulaLine[];
  changed: readonly {
    ingredientId: string;
    ingredientName: string;
    before: string;
    after: string;
  }[];
  productionStepsChanged: boolean;
}

export function compareFormulaVersions(
  before: FormulaRevisionSource,
  after: FormulaRevisionSource,
): FormulaComparison {
  const beforeByIngredient = new Map(
    before.ingredients.map((line) => [line.ingredientId, line]),
  );
  const afterByIngredient = new Map(
    after.ingredients.map((line) => [line.ingredientId, line]),
  );
  return {
    added: after.ingredients.filter(
      (line) => !beforeByIngredient.has(line.ingredientId),
    ),
    removed: before.ingredients.filter(
      (line) => !afterByIngredient.has(line.ingredientId),
    ),
    changed: after.ingredients.flatMap((line) => {
      const previous = beforeByIngredient.get(line.ingredientId);
      return previous && previous.percentage !== line.percentage
        ? [
            {
              ingredientId: line.ingredientId,
              ingredientName: line.ingredientName,
              before: previous.percentage,
              after: line.percentage,
            },
          ]
        : [];
    }),
    productionStepsChanged:
      JSON.stringify(before.productionSteps) !==
      JSON.stringify(after.productionSteps),
  };
}
