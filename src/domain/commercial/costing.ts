import {
  add,
  compare,
  decimal,
  decimalString,
  divide,
  multiply,
  oneHundred,
  zero,
} from "@/src/domain/formulas/decimal";
import {
  normalizedBaseQuantity,
  type CommercialUnit,
  unitDimension,
} from "./units";

export interface SupplierPriceInput {
  packageSize: string;
  packageSizeUnit: CommercialUnit;
  packageQuantity: string;
  packagePrice: string;
  shippingAllocation?: string | null;
  taxAllocation?: string | null;
  discountAllocation?: string | null;
  otherAcquisitionCost?: string | null;
}
const d = (value?: string | null) => decimal(value ?? "0");
const rounded = (value: { units: bigint }, precision: number) => {
  const step = 10n ** BigInt(12 - precision);
  const half = step / 2n;
  return decimalString(
    { units: value.units >= 0n ? value.units + half : value.units - half },
    precision,
  );
};

export function calculateSupplierPrice(input: SupplierPriceInput) {
  if (
    compare(d(input.packageSize), zero) <= 0 ||
    compare(d(input.packageQuantity), zero) <= 0
  )
    throw new Error("Package size and quantity must be positive.");
  if (
    [
      input.packagePrice,
      input.shippingAllocation,
      input.taxAllocation,
      input.discountAllocation,
      input.otherAcquisitionCost,
    ]
      .filter(Boolean)
      .some((value) => compare(d(value), zero) < 0)
  )
    throw new Error("Prices and allocations cannot be negative.");
  const landed = add(
    d(input.packagePrice),
    d(input.shippingAllocation),
    d(input.taxAllocation),
    d(input.otherAcquisitionCost),
    { units: -d(input.discountAllocation).units },
  );
  if (compare(landed, zero) < 0)
    throw new Error("Discount cannot exceed acquisition cost.");
  const normalizedQuantity = multiply(
    decimal(normalizedBaseQuantity(input.packageSize, input.packageSizeUnit)),
    d(input.packageQuantity),
  );
  const normalizedCost = divide(landed, normalizedQuantity);
  return {
    landedCost: decimalString(landed, 4),
    normalizedCost: decimalString(normalizedCost, 8),
    dimension: unitDimension(input.packageSizeUnit),
  };
}

export function packagingUnitCost(
  packagePrice: string,
  shipping: string | null,
  packageQuantity: string,
) {
  if (compare(d(packageQuantity), zero) <= 0)
    throw new Error("Package quantity must be positive.");
  return decimalString(
    divide(add(d(packagePrice), d(shipping)), d(packageQuantity)),
    6,
  );
}

export function packagingCostPerUnit(
  lines: readonly {
    unitCost: string | null;
    quantityPerUnit: string;
    wastePercent: string;
    required: boolean;
  }[],
) {
  const missing = lines.filter(
    (line) => line.required && !line.unitCost,
  ).length;
  const total = add(
    ...lines
      .filter((line) => line.unitCost)
      .map((line) =>
        multiply(
          multiply(d(line.unitCost), d(line.quantityPerUnit)),
          add(decimal("1"), divide(d(line.wastePercent), oneHundred)),
        ),
      ),
  );
  return {
    cost: decimalString(total, 6),
    missingRequiredPrices: missing,
    complete: missing === 0,
  };
}

export function pricingMetrics(price: string, cogs: string, fees = "0") {
  if (compare(d(price), zero) <= 0)
    throw new Error("Selling price must be positive.");
  const grossProfit = add(
    d(price),
    { units: -d(cogs).units },
    { units: -d(fees).units },
  );
  return {
    grossProfit: decimalString(grossProfit, 4),
    marginPercent: rounded(
      multiply(divide(grossProfit, d(price)), oneHundred),
      4,
    ),
    markupPercent:
      compare(d(cogs), zero) === 0
        ? null
        : rounded(
            multiply(
              divide(add(d(price), { units: -d(cogs).units }), d(cogs)),
              oneHundred,
            ),
            4,
          ),
  };
}

export interface LoadedCostInput {
  plannedUnits: number;
  expectedLossPercent: string;
  formulaOrManufacturerCost: string | null;
  packagingCostPerUnit: string | null;
  laborCostPerBatch?: string | null;
  testingCostPerBatch?: string | null;
  manufacturerFeePerBatch?: string | null;
  fulfillmentCostPerUnit?: string | null;
  storageCostPerUnit?: string | null;
  overheadFixedPerBatch?: string | null;
  miscellaneousCostPerBatch?: string | null;
}
export function fullyLoadedCogs(input: LoadedCostInput) {
  if (!Number.isInteger(input.plannedUnits) || input.plannedUnits <= 0)
    throw new Error("Planned units must be a positive whole number.");
  const completed = Math.floor(
    input.plannedUnits * (1 - Number(input.expectedLossPercent) / 100),
  );
  if (completed <= 0)
    throw new Error("Expected loss leaves no completed units.");
  const missing = [
    !input.formulaOrManufacturerCost && "formula or manufacturer cost",
    !input.packagingCostPerUnit && "packaging cost",
  ].filter(Boolean) as string[];
  const unitVariable = add(
    d(input.formulaOrManufacturerCost),
    d(input.packagingCostPerUnit),
    d(input.fulfillmentCostPerUnit),
    d(input.storageCostPerUnit),
  );
  const batchFixed = add(
    d(input.laborCostPerBatch),
    d(input.testingCostPerBatch),
    d(input.manufacturerFeePerBatch),
    d(input.overheadFixedPerBatch),
    d(input.miscellaneousCostPerBatch),
  );
  const total = add(
    multiply(unitVariable, decimal(input.plannedUnits)),
    batchFixed,
  );
  return {
    expectedCompletedUnits: completed,
    totalBatchCost: decimalString(total, 4),
    cogsPerCompletedUnit: rounded(divide(total, decimal(completed)), 4),
    missing,
    complete: missing.length === 0,
  };
}

export function quoteLineTotal(quantity: string, unitPrice: string) {
  if (compare(d(quantity), zero) < 0 || compare(d(unitPrice), zero) < 0)
    throw new Error("Quote values cannot be negative.");
  return decimalString(multiply(d(quantity), d(unitPrice)), 4);
}

export function packagesRequired(
  requiredQuantity: string,
  packageSize: string,
  packageQuantity = "1",
) {
  const capacity = multiply(d(packageSize), d(packageQuantity));
  if (compare(capacity, zero) <= 0)
    throw new Error("Package capacity must be positive.");
  const ratio = divide(d(requiredQuantity), capacity);
  const whole = ratio.units / decimal("1").units;
  return Number(ratio.units % decimal("1").units === 0n ? whole : whole + 1n);
}

export function formulaConsumedCost(
  lines: readonly {
    ingredientName: string;
    requiredBaseQuantity: string;
    normalizedCostPerBaseUnit: string | null;
  }[],
) {
  const missing = lines
    .filter((line) => !line.normalizedCostPerBaseUnit)
    .map((line) => line.ingredientName);
  const costs = lines.map((line) =>
    line.normalizedCostPerBaseUnit
      ? multiply(
          d(line.requiredBaseQuantity),
          d(line.normalizedCostPerBaseUnit),
        )
      : zero,
  );
  return {
    consumedCost: decimalString(add(...costs), 6),
    missingSupplierPrices: missing,
    complete: missing.length === 0,
  };
}

export function whiteLabelCost(input: {
  units: number;
  unitAcquisitionCost: string | null;
  setupFee?: string | null;
  sampleFee?: string | null;
  shipping?: string | null;
  addedPackagingPerUnit?: string | null;
}) {
  if (!Number.isInteger(input.units) || input.units <= 0)
    throw new Error("Units must be a positive whole number.");
  const missing = input.unitAcquisitionCost ? [] : ["unit acquisition cost"];
  const acquisition = multiply(
    d(input.unitAcquisitionCost),
    decimal(input.units),
  );
  const packaging = multiply(
    d(input.addedPackagingPerUnit),
    decimal(input.units),
  );
  const upfrontOrderCost = add(
    acquisition,
    packaging,
    d(input.setupFee),
    d(input.sampleFee),
    d(input.shipping),
  );
  return {
    upfrontOrderCost: decimalString(upfrontOrderCost, 4),
    estimatedCostPerUnit: decimalString(
      divide(upfrontOrderCost, decimal(input.units)),
      4,
    ),
    missing,
    complete: missing.length === 0,
  };
}

export function purchaseCostEstimate(input: {
  requiredQuantity: string;
  packageSize: string;
  packageQuantity?: string;
  packagePrice: string;
  normalizedConsumedCost: string;
}) {
  const count = packagesRequired(
    input.requiredQuantity,
    input.packageSize,
    input.packageQuantity,
  );
  const purchaseCost = multiply(decimal(count), d(input.packagePrice));
  return {
    packagesRequired: count,
    purchaseCost: decimalString(purchaseCost, 4),
    consumedCost: decimalString(d(input.normalizedConsumedCost), 4),
    unusedCost: decimalString(
      add(purchaseCost, { units: -d(input.normalizedConsumedCost).units }),
      4,
    ),
  };
}

export function quoteComparisonBadges(
  quotes: readonly {
    id: string;
    total: string | null;
    unitCost: string | null;
    setupFee: string | null;
    minimum: string | null;
    leadTimeDays: number | null;
  }[],
) {
  const minimumId = (
    value: (quote: (typeof quotes)[number]) => string | number | null,
  ) =>
    quotes
      .filter((q) => value(q) !== null)
      .sort((a, b) => Number(value(a)) - Number(value(b)))[0]?.id;
  return {
    lowestTotal: minimumId((q) => q.total),
    lowestUnitCost: minimumId((q) => q.unitCost),
    lowestSetupFee: minimumId((q) => q.setupFee),
    lowestMinimum: minimumId((q) => q.minimum),
    fastestLeadTime: minimumId((q) => q.leadTimeDays),
  };
}
