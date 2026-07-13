import { z } from "zod";

export const productTypes = [
  "hair_beard_care",
  "skin_care",
  "shave_care",
  "supplement",
  "wellness",
  "apparel",
  "accessory",
  "digital_product",
  "other",
] as const;
export const developmentPaths = [
  "custom_formula",
  "white_label",
  "private_label",
  "manufacturer_custom",
  "curated_resale",
  "undecided",
] as const;
export const pipelineStatuses = [
  "idea",
  "research",
  "product_brief",
  "formulation",
  "supplier_sourcing",
  "testing",
  "refinement",
  "packaging",
  "costing",
  "production_ready",
  "launch_planning",
  "launched",
  "on_hold",
  "archived",
] as const;
export const productPriorities = [
  "low",
  "standard",
  "high",
  "critical",
] as const;
export const ingredientCategories = [
  "base_blend",
  "carrier_oil",
  "active_oil",
  "botanical_extract",
  "fragrance",
  "antioxidant",
  "emulsifier",
  "preservative",
  "surfactant",
  "humectant",
  "thickener",
  "powder",
  "flavor",
  "sweetener",
  "mineral",
  "vitamin",
  "amino_acid",
  "other",
] as const;
export const formulaStatuses = [
  "draft",
  "experimental",
  "under_review",
  "approved",
  "production_ready",
  "superseded",
  "archived",
] as const;

const optionalText = z.string().trim().max(5000).nullable().optional();
const nullableDecimal = z
  .union([z.string().regex(/^\d+(?:\.\d{1,6})?$/), z.null()])
  .optional();

export const createProductSchema = z.object({
  productLineId: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: optionalText,
  productType: z.enum(productTypes),
  developmentPath: z.enum(developmentPaths),
  pipelineStatus: z.enum(pipelineStatuses).default("idea"),
  priority: z.enum(productPriorities).default("standard"),
  targetCustomer: optionalText,
  problemToSolve: optionalText,
  desiredBenefits: optionalText,
  targetLaunchDate: z.string().date().nullable().optional(),
});

export const updateProductSchema = createProductSchema
  .omit({ productLineId: true, name: true, slug: true, productType: true })
  .partial()
  .extend({ expectedUpdatedAt: z.string().datetime().optional() });

export const productBriefSchema = z.object({
  targetCustomer: optionalText,
  problemToSolve: optionalText,
  desiredBenefits: optionalText,
  desiredFormat: optionalText,
  desiredTexture: optionalText,
  desiredAbsorption: optionalText,
  desiredColor: optionalText,
  desiredAroma: optionalText,
  targetPackaging: optionalText,
  targetRetailPrice: nullableDecimal,
  targetWholesalePrice: nullableDecimal,
  maximumTargetCogs: nullableDecimal,
  targetLaunchDate: z.string().date().nullable().optional(),
  ingredientsToExplore: optionalText,
  ingredientsToAvoid: optionalText,
  competitiveReferences: optionalText,
  notes: optionalText,
});

export const createIngredientSchema = z.object({
  commonName: z.string().trim().min(2).max(160),
  inciName: z.string().trim().max(300).nullable().optional(),
  casNumber: z.string().trim().max(80).nullable().optional(),
  category: z.enum(ingredientCategories),
  description: optionalText,
  functions: z.array(z.string().trim().min(1).max(120)).default([]),
  densityGramsPerMl: nullableDecimal,
  notes: optionalText,
});

export const updateIngredientSchema = createIngredientSchema.partial().extend({
  physicalForm: optionalText,
  naturalColor: optionalText,
  naturalAroma: optionalText,
  recommendedUsageMinimum: nullableDecimal,
  recommendedUsageMaximum: nullableDecimal,
  solubility: optionalText,
  heatSensitivity: optionalText,
  oxidationSensitivity: optionalText,
  storageConditions: optionalText,
  shelfLifeMonths: z.number().int().positive().nullable().optional(),
  formulationConcerns: optionalText,
});

export const createFormulaFamilySchema = z.object({
  productId: z.string().uuid(),
  name: z.string().trim().min(2).max(160),
  description: optionalText,
  formulaBasis: z.enum(["volume_percentage", "weight_percentage"]),
  defaultBottleSize: z.string().regex(/^\d+(?:\.\d{1,6})?$/),
  defaultBottleSizeUnit: z.enum(["us_fluid_ounces", "milliliters", "grams"]),
  defaultBottleCount: z.number().int().positive(),
  defaultOveragePercent: z.string().regex(/^\d+(?:\.\d{1,4})?$/),
});

export const formulaLineSchema = z.object({
  ingredientId: z.string().uuid(),
  percentage: z.string().regex(/^\d+(?:\.\d{1,6})?$/),
  sortOrder: z.number().int().nonnegative(),
  formulaRole: optionalText,
  processingNotes: optionalText,
  isConcentratedExtract: z.boolean().default(false),
  isFragrance: z.boolean().default(false),
});

export const createFormulaVersionSchema = z.object({
  formulaFamilyId: z.string().uuid(),
  previousVersionId: z.string().uuid(),
  changeReason: z.string().trim().min(8).max(1000),
  initialStatus: z.enum(["draft", "experimental"]).default("draft"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductBriefInput = z.infer<typeof productBriefSchema>;
export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

export const labels = {
  hair_beard_care: "Hair and Beard Care",
  skin_care: "Skin Care",
  shave_care: "Shave Care",
  supplement: "Supplement",
  wellness: "Wellness",
  apparel: "Apparel",
  accessory: "Accessory",
  digital_product: "Digital Product",
  other: "Other",
  custom_formula: "Custom Formula",
  white_label: "White Label",
  private_label: "Private Label",
  manufacturer_custom: "Manufacturer Custom",
  curated_resale: "Curated Resale",
  undecided: "Undecided",
  product_brief: "Product Brief",
  supplier_sourcing: "Supplier Sourcing",
  production_ready: "Production Ready",
  launch_planning: "Launch Planning",
  on_hold: "On Hold",
  formula_source: "Formula / Source",
  launch_ready: "Launch Ready",
  under_review: "Under Review",
  volume_percentage: "Volume Percentage",
  weight_percentage: "Weight Percentage",
  us_fluid_ounces: "US Fluid Ounces",
  milliliters: "Milliliters",
  grams: "Grams",
} as const;

export function labelFor(value: string): string {
  return (
    labels[value as keyof typeof labels] ??
    value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}
