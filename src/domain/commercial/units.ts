import {
  decimal,
  decimalString,
  divide,
  multiply,
  type DecimalValue,
} from "@/src/domain/formulas/decimal";

export const commercialUnits = [
  "milliliters",
  "liters",
  "us_fluid_ounces",
  "us_gallons",
  "grams",
  "kilograms",
  "ounces_weight",
  "pounds",
  "each",
  "dozen",
  "pack",
  "case",
] as const;
export type CommercialUnit = (typeof commercialUnits)[number];
export type UnitDimension = "volume" | "weight" | "count";

const definitions: Record<
  CommercialUnit,
  { dimension: UnitDimension; baseFactor: string }
> = {
  milliliters: { dimension: "volume", baseFactor: "1" },
  liters: { dimension: "volume", baseFactor: "1000" },
  us_fluid_ounces: { dimension: "volume", baseFactor: "29.5735295625" },
  us_gallons: { dimension: "volume", baseFactor: "3785.411784" },
  grams: { dimension: "weight", baseFactor: "1" },
  kilograms: { dimension: "weight", baseFactor: "1000" },
  ounces_weight: { dimension: "weight", baseFactor: "28.349523125" },
  pounds: { dimension: "weight", baseFactor: "453.59237" },
  each: { dimension: "count", baseFactor: "1" },
  dozen: { dimension: "count", baseFactor: "12" },
  pack: { dimension: "count", baseFactor: "1" },
  case: { dimension: "count", baseFactor: "1" },
};

export function unitDimension(unit: CommercialUnit): UnitDimension {
  return definitions[unit].dimension;
}

export function convertCommercialUnit(
  value: string,
  from: CommercialUnit,
  to: CommercialUnit,
  options?: { densityGramsPerMl?: string | null; countFactor?: string | null },
): string {
  const source = definitions[from];
  const target = definitions[to];
  const base: DecimalValue = multiply(
    decimal(value),
    decimal(source.baseFactor),
  );
  if (source.dimension === target.dimension) {
    if (
      source.dimension === "count" &&
      from !== to &&
      ([from, to].includes("pack") || [from, to].includes("case"))
    ) {
      if (!options?.countFactor)
        throw new Error(
          "A pack or case conversion requires an explicit count factor.",
        );
      const sourceFactor =
        from === "pack" || from === "case"
          ? decimal(options.countFactor)
          : decimal(source.baseFactor);
      const targetFactor =
        to === "pack" || to === "case"
          ? decimal(options.countFactor)
          : decimal(target.baseFactor);
      return decimalString(
        divide(multiply(decimal(value), sourceFactor), targetFactor),
      );
    }
    return decimalString(divide(base, decimal(target.baseFactor)));
  }
  if (!options?.densityGramsPerMl)
    throw new Error(
      "Volume and weight conversion requires an explicit density.",
    );
  if (source.dimension === "volume" && target.dimension === "weight")
    return decimalString(
      divide(
        multiply(base, decimal(options.densityGramsPerMl)),
        decimal(target.baseFactor),
      ),
    );
  if (source.dimension === "weight" && target.dimension === "volume")
    return decimalString(
      divide(
        divide(base, decimal(options.densityGramsPerMl)),
        decimal(target.baseFactor),
      ),
    );
  throw new Error(
    "Count units cannot be converted to physical volume or weight.",
  );
}

export function normalizedBaseQuantity(
  value: string,
  unit: CommercialUnit,
): string {
  return decimalString(
    multiply(decimal(value), decimal(definitions[unit].baseFactor)),
  );
}
