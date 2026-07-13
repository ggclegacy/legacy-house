import { describe, expect, it } from "vitest";
import {
  calculateSupplierPrice,
  formulaConsumedCost,
  fullyLoadedCogs,
  packagingCostPerUnit,
  packagingUnitCost,
  pricingMetrics,
  purchaseCostEstimate,
  quoteComparisonBadges,
  quoteLineTotal,
  whiteLabelCost,
} from "./costing";
import {
  documentStatus,
  evaluateCommercialReadiness,
  isSupplierPriceStale,
} from "./readiness";
import {
  convertCommercialUnit,
  normalizedBaseQuantity,
  unitDimension,
} from "./units";

describe("commercial calculation boundaries", () => {
  it("normalizes volume, weight, count, and allocated landed costs", () => {
    expect(
      calculateSupplierPrice({
        packageSize: "1",
        packageSizeUnit: "liters",
        packageQuantity: "2",
        packagePrice: "20",
        shippingAllocation: "4",
        taxAllocation: "2",
        discountAllocation: "1",
      }),
    ).toMatchObject({
      landedCost: "25",
      normalizedCost: "0.0125",
      dimension: "volume",
    });
    expect(
      calculateSupplierPrice({
        packageSize: "1",
        packageSizeUnit: "kilograms",
        packageQuantity: "1",
        packagePrice: "10",
      }).normalizedCost,
    ).toBe("0.01");
    expect(
      calculateSupplierPrice({
        packageSize: "12",
        packageSizeUnit: "each",
        packageQuantity: "1",
        packagePrice: "6",
      }).normalizedCost,
    ).toBe("0.5");
  });
  it("requires density across physical dimensions and explicit count factors", () => {
    expect(() => convertCommercialUnit("1", "milliliters", "grams")).toThrow(
      /density/,
    );
    expect(convertCommercialUnit("1", "us_fluid_ounces", "milliliters")).toBe(
      "29.5735295625",
    );
    expect(
      convertCommercialUnit("2", "pack", "each", { countFactor: "12" }),
    ).toBe("24");
    expect(
      convertCommercialUnit("24", "each", "pack", { countFactor: "12" }),
    ).toBe("2");
  });
  it("calculates packaging, quote, formula and white-label costs without hiding missing data", () => {
    expect(packagingUnitCost("100", "10", "50")).toBe("2.2");
    expect(
      packagingCostPerUnit([
        {
          unitCost: "1",
          quantityPerUnit: "2",
          wastePercent: "5",
          required: true,
        },
        {
          unitCost: null,
          quantityPerUnit: "1",
          wastePercent: "0",
          required: true,
        },
      ]),
    ).toEqual({ cost: "2.1", missingRequiredPrices: 1, complete: false });
    expect(quoteLineTotal("4", "2.5")).toBe("10");
    expect(
      formulaConsumedCost([
        {
          ingredientName: "A",
          requiredBaseQuantity: "10",
          normalizedCostPerBaseUnit: "0.5",
        },
        {
          ingredientName: "B",
          requiredBaseQuantity: "1",
          normalizedCostPerBaseUnit: null,
        },
      ]),
    ).toEqual({
      consumedCost: "5",
      missingSupplierPrices: ["B"],
      complete: false,
    });
    expect(
      whiteLabelCost({
        units: 100,
        unitAcquisitionCost: "4",
        setupFee: "50",
        shipping: "25",
      }),
    ).toMatchObject({
      upfrontOrderCost: "475",
      estimatedCostPerUnit: "4.75",
      complete: true,
    });
  });
  it("keeps margin distinct from markup and estimates purchases separately from consumption", () => {
    expect(pricingMetrics("30", "10")).toEqual({
      grossProfit: "20",
      marginPercent: "66.6667",
      markupPercent: "200",
    });
    expect(
      purchaseCostEstimate({
        requiredQuantity: "25",
        packageSize: "10",
        packagePrice: "8",
        normalizedConsumedCost: "20",
      }),
    ).toEqual({
      packagesRequired: 3,
      purchaseCost: "24",
      consumedCost: "20",
      unusedCost: "4",
    });
  });
  it("calculates expected-loss COGS and comparison badges", () => {
    expect(
      fullyLoadedCogs({
        plannedUnits: 100,
        expectedLossPercent: "5",
        formulaOrManufacturerCost: "2",
        packagingCostPerUnit: "1",
        laborCostPerBatch: "95",
      }),
    ).toMatchObject({
      expectedCompletedUnits: 95,
      totalBatchCost: "395",
      cogsPerCompletedUnit: "4.1579",
      complete: true,
    });
    expect(
      quoteComparisonBadges([
        {
          id: "a",
          total: "100",
          unitCost: "5",
          setupFee: "20",
          minimum: "50",
          leadTimeDays: 30,
        },
        {
          id: "b",
          total: "90",
          unitCost: "6",
          setupFee: "10",
          minimum: "40",
          leadTimeDays: 20,
        },
      ]),
    ).toEqual({
      lowestTotal: "b",
      lowestUnitCost: "a",
      lowestSetupFee: "b",
      lowestMinimum: "b",
      fastestLeadTime: "b",
    });
  });
  it("derives dates and readiness only from supplied records", () => {
    expect(documentStatus("2026-08-01", "2026-07-13")).toBe("expiring_soon");
    expect(documentStatus("2026-07-01", "2026-07-13")).toBe("expired");
    expect(isSupplierPriceStale("2026-01-01", "2026-07-13")).toBe(true);
    expect(
      evaluateCommercialReadiness({
        developmentPath: "white_label",
        hasFormula: false,
        ingredientCount: 0,
        sourcedIngredientCount: 0,
        hasManufacturerCandidate: false,
        hasPackaging: false,
        hasCostSnapshot: false,
        hasRetailPrice: false,
        documentCount: 0,
      }).complete,
    ).toBe(false);
  });

  it("covers unit conversion rejection and explicit density paths", () => {
    expect(unitDimension("pounds")).toBe("weight");
    expect(normalizedBaseQuantity("2", "dozen")).toBe("24");
    expect(convertCommercialUnit("1", "kilograms", "pounds")).toBe(
      "2.204622621848",
    );
    expect(
      convertCommercialUnit("10", "milliliters", "grams", {
        densityGramsPerMl: "0.8",
      }),
    ).toBe("8");
    expect(
      convertCommercialUnit("8", "grams", "milliliters", {
        densityGramsPerMl: "0.8",
      }),
    ).toBe("10");
    expect(() => convertCommercialUnit("1", "pack", "each")).toThrow(
      /count factor/,
    );
    expect(() =>
      convertCommercialUnit("1", "each", "grams", { densityGramsPerMl: "1" }),
    ).toThrow(/Count units/);
  });

  it("rejects invalid prices, quantities, and impossible loss", () => {
    expect(() =>
      calculateSupplierPrice({
        packageSize: "0",
        packageSizeUnit: "grams",
        packageQuantity: "1",
        packagePrice: "1",
      }),
    ).toThrow(/positive/);
    expect(() =>
      calculateSupplierPrice({
        packageSize: "1",
        packageSizeUnit: "grams",
        packageQuantity: "1",
        packagePrice: "1",
        taxAllocation: "-1",
      }),
    ).toThrow(/negative/);
    expect(() =>
      calculateSupplierPrice({
        packageSize: "1",
        packageSizeUnit: "grams",
        packageQuantity: "1",
        packagePrice: "1",
        discountAllocation: "2",
      }),
    ).toThrow(/exceed/);
    expect(() => packagingUnitCost("1", null, "0")).toThrow(/positive/);
    expect(() => quoteLineTotal("-1", "2")).toThrow(/negative/);
    expect(() =>
      fullyLoadedCogs({
        plannedUnits: 0,
        expectedLossPercent: "0",
        formulaOrManufacturerCost: "1",
        packagingCostPerUnit: "1",
      }),
    ).toThrow(/whole number/);
    expect(() =>
      fullyLoadedCogs({
        plannedUnits: 1,
        expectedLossPercent: "100",
        formulaOrManufacturerCost: "1",
        packagingCostPerUnit: "1",
      }),
    ).toThrow(/no completed/);
  });

  it("covers incomplete and zero-cost commercial cases", () => {
    expect(pricingMetrics("10", "0").markupPercent).toBeNull();
    expect(() => pricingMetrics("0", "1")).toThrow(/positive/);
    expect(
      whiteLabelCost({ units: 2, unitAcquisitionCost: null }),
    ).toMatchObject({ complete: false, missing: ["unit acquisition cost"] });
    expect(() =>
      whiteLabelCost({ units: -1, unitAcquisitionCost: "1" }),
    ).toThrow(/positive/);
    expect(() =>
      purchaseCostEstimate({
        requiredQuantity: "1",
        packageSize: "0",
        packagePrice: "1",
        normalizedConsumedCost: "1",
      }),
    ).toThrow(/capacity/);
  });

  it("covers every deterministic document and readiness status", () => {
    expect(documentStatus(null, "2026-07-13")).toBe("missing_information");
    expect(documentStatus("2027-07-13", "2026-07-13")).toBe("current");
    expect(documentStatus("2027-07-13", "2026-07-13", 60, true)).toBe(
      "needs_review",
    );
    expect(isSupplierPriceStale(null, "2026-07-13")).toBe(true);
    expect(isSupplierPriceStale("2026-07-01", "2026-07-13")).toBe(false);
    expect(
      evaluateCommercialReadiness({
        developmentPath: "custom_formula",
        hasFormula: true,
        ingredientCount: 2,
        sourcedIngredientCount: 2,
        hasManufacturerCandidate: false,
        hasPackaging: true,
        hasCostSnapshot: true,
        hasRetailPrice: true,
        documentCount: 1,
      }).complete,
    ).toBe(true);
  });
});
