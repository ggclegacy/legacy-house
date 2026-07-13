import {
  add,
  compare,
  decimal,
  decimalString,
  divide,
  multiply,
  oneHundred,
  zero,
} from "./decimal";

export const millilitersPerUsFluidOunce = "29.5735295625";

export interface FormulaCalculationLine {
  id: string;
  name: string;
  percentage: string;
  densityGramsPerMl?: string | null;
}

export interface BatchCalculationInput {
  basis: "volume_percentage" | "weight_percentage";
  bottleCount: number;
  bottleSize: string;
  bottleSizeUnit: "us_fluid_ounces" | "milliliters" | "grams";
  overagePercent: string;
  ingredients: readonly FormulaCalculationLine[];
}

export interface BatchIngredientResult extends FormulaCalculationLine {
  fluidOunces: string | null;
  milliliters: string | null;
  grams: string | null;
  densityRequired: boolean;
}

export interface BatchCalculationResult {
  validFormula: boolean;
  formulaTotal: string;
  requiredFill: string;
  overage: string;
  totalBatch: string;
  batchUnit: "us_fluid_ounces" | "milliliters" | "grams";
  totalFluidOunces: string | null;
  totalMilliliters: string | null;
  totalGrams: string | null;
  ingredients: readonly BatchIngredientResult[];
}

export function formulaTotal(percentages: readonly string[]) {
  const total = add(...percentages.map(decimal));
  return {
    total: decimalString(total, 6),
    state:
      compare(total, oneHundred) < 0
        ? ("incomplete" as const)
        : compare(total, oneHundred) > 0
          ? ("invalid" as const)
          : ("ready" as const),
  };
}

export function calculateBatch(
  input: BatchCalculationInput,
): BatchCalculationResult {
  if (!Number.isInteger(input.bottleCount) || input.bottleCount <= 0)
    throw new Error("Bottle count must be a positive whole number.");
  const bottleSize = decimal(input.bottleSize);
  const overageRate = decimal(input.overagePercent);
  if (compare(bottleSize, zero) <= 0)
    throw new Error("Bottle size must be positive.");
  if (compare(overageRate, zero) < 0)
    throw new Error("Overage cannot be negative.");
  if (input.basis === "volume_percentage" && input.bottleSizeUnit === "grams")
    throw new Error("A volume formula cannot use grams as its fill unit.");
  if (input.basis === "weight_percentage" && input.bottleSizeUnit !== "grams")
    throw new Error("A weight formula requires grams as its fill unit.");

  const count = decimal(input.bottleCount);
  const requiredFill = multiply(bottleSize, count);
  const overage = divide(multiply(requiredFill, overageRate), oneHundred);
  const totalBatch = add(requiredFill, overage);
  const total = formulaTotal(input.ingredients.map((line) => line.percentage));
  const mlPerFlOz = decimal(millilitersPerUsFluidOunce);
  const totalFluidOunces =
    input.bottleSizeUnit === "us_fluid_ounces"
      ? totalBatch
      : input.bottleSizeUnit === "milliliters"
        ? divide(totalBatch, mlPerFlOz)
        : null;
  const totalMilliliters =
    input.bottleSizeUnit === "milliliters"
      ? totalBatch
      : input.bottleSizeUnit === "us_fluid_ounces"
        ? multiply(totalBatch, mlPerFlOz)
        : null;
  const totalGrams = input.bottleSizeUnit === "grams" ? totalBatch : null;

  return {
    validFormula: total.state === "ready",
    formulaTotal: total.total,
    requiredFill: decimalString(requiredFill),
    overage: decimalString(overage),
    totalBatch: decimalString(totalBatch),
    batchUnit: input.bottleSizeUnit,
    totalFluidOunces: totalFluidOunces ? decimalString(totalFluidOunces) : null,
    totalMilliliters: totalMilliliters ? decimalString(totalMilliliters) : null,
    totalGrams: totalGrams ? decimalString(totalGrams) : null,
    ingredients: input.ingredients.map((line) => {
      const ratio = divide(decimal(line.percentage), oneHundred);
      const fluidOunces = totalFluidOunces
        ? multiply(totalFluidOunces, ratio)
        : null;
      const milliliters = totalMilliliters
        ? multiply(totalMilliliters, ratio)
        : null;
      const grams = totalGrams
        ? multiply(totalGrams, ratio)
        : milliliters && line.densityGramsPerMl
          ? multiply(milliliters, decimal(line.densityGramsPerMl))
          : null;
      return {
        ...line,
        fluidOunces: fluidOunces ? decimalString(fluidOunces) : null,
        milliliters: milliliters ? decimalString(milliliters) : null,
        grams: grams ? decimalString(grams) : null,
        densityRequired:
          input.basis === "volume_percentage" && !line.densityGramsPerMl,
      };
    }),
  };
}

export function convertFluidOuncesToMilliliters(value: string): string {
  return decimalString(
    multiply(decimal(value), decimal(millilitersPerUsFluidOunce)),
  );
}

export function convertMillilitersToFluidOunces(value: string): string {
  return decimalString(
    divide(decimal(value), decimal(millilitersPerUsFluidOunce)),
  );
}
