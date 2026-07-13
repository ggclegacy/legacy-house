import type {
  costScenarios,
  costSnapshots,
  documentLinks,
  documents,
  finishedProductConfigurations,
  formulaSupplierSelections,
  manufacturerCatalogProducts,
  manufacturerQuoteLineItems,
  manufacturerQuotes,
  manufacturers,
  packagingCompatibility,
  packagingComponents,
  packagingPriceHistory,
  productManufacturerCandidates,
  productPackagingComponents,
  productReadinessItems,
  supplierProductPriceHistory,
  supplierProducts,
  suppliers,
} from "@/src/infrastructure/database/commercial-schema";

type Row<Table extends { $inferSelect: unknown }> = Table["$inferSelect"];

export interface CommercialSnapshot {
  persistence: "database" | "unavailable";
  suppliers: readonly Row<typeof suppliers>[];
  supplierProducts: readonly Row<typeof supplierProducts>[];
  supplierPrices: readonly Row<typeof supplierProductPriceHistory>[];
  supplierSelections: readonly Row<typeof formulaSupplierSelections>[];
  manufacturers: readonly Row<typeof manufacturers>[];
  catalogProducts: readonly Row<typeof manufacturerCatalogProducts>[];
  candidates: readonly Row<typeof productManufacturerCandidates>[];
  quotes: readonly Row<typeof manufacturerQuotes>[];
  quoteLines: readonly Row<typeof manufacturerQuoteLineItems>[];
  packaging: readonly Row<typeof packagingComponents>[];
  packagingPrices: readonly Row<typeof packagingPriceHistory>[];
  compatibility: readonly Row<typeof packagingCompatibility>[];
  configurations: readonly Row<typeof finishedProductConfigurations>[];
  configurationPackaging: readonly Row<typeof productPackagingComponents>[];
  scenarios: readonly Row<typeof costScenarios>[];
  snapshots: readonly Row<typeof costSnapshots>[];
  documents: readonly Row<typeof documents>[];
  documentLinks: readonly Row<typeof documentLinks>[];
  readiness: readonly Row<typeof productReadinessItems>[];
}

export const reserveConfigurationId = "f15d00f7-2f5e-4a50-91ef-3735beb3e447";

export const canonicalCommercialSnapshot: CommercialSnapshot = {
  persistence: "unavailable",
  suppliers: [],
  supplierProducts: [],
  supplierPrices: [],
  supplierSelections: [],
  manufacturers: [],
  catalogProducts: [],
  candidates: [],
  quotes: [],
  quoteLines: [],
  packaging: [],
  packagingPrices: [],
  compatibility: [],
  configurations: [
    {
      id: reserveConfigurationId,
      productId: "e750bc0b-cb47-4aa3-9e5a-97134080d7a2",
      formulaVersionId: "938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8",
      manufacturerCatalogProductId: null,
      name: "Legacy Reserve Hair & Beard Oil — 2 oz",
      sku: null,
      fillSize: "2",
      fillSizeUnit: "us_fluid_ounces",
      unitsPerCase: null,
      targetRetailPrice: null,
      targetWholesalePrice: null,
      promotionalPrice: null,
      targetMaximumCogs: null,
      targetRetailMarginPercent: null,
      targetWholesaleMarginPercent: null,
      expectedBatchLossPercent: null,
      expectedFillLossPercent: null,
      active: true,
      notes: null,
      createdAt: new Date(0),
      updatedAt: new Date(0),
      archivedAt: null,
    },
  ],
  configurationPackaging: [],
  scenarios: [],
  snapshots: [],
  documents: [],
  documentLinks: [],
  readiness: [],
};
