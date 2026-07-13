import { and, eq } from "drizzle-orm";

import type { CommercialAction } from "@/src/domain/commercial/actions";
import { calculateSupplierPrice } from "@/src/domain/commercial/costing";
import {
  reserveConfigurationId,
  type CommercialSnapshot,
} from "@/src/domain/commercial/snapshot";
import {
  reserveFormulaVersionId,
  reserveProductId,
} from "@/src/domain/development/phase-two-seeds";
import type { Database } from "@/src/infrastructure/database/client";
import {
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

export function createDrizzleCommercialRepository(db: Database) {
  return {
    async getSnapshot(): Promise<CommercialSnapshot> {
      const [
        supplierRows,
        supplierProductRows,
        supplierPriceRows,
        selectionRows,
        manufacturerRows,
        catalogRows,
        candidateRows,
        quoteRows,
        quoteLineRows,
        packagingRows,
        packagingPriceRows,
        compatibilityRows,
        configurationRows,
        configurationPackagingRows,
        scenarioRows,
        snapshotRows,
        documentRows,
        documentLinkRows,
        readinessRows,
      ] = await Promise.all([
        db.select().from(suppliers),
        db.select().from(supplierProducts),
        db.select().from(supplierProductPriceHistory),
        db.select().from(formulaSupplierSelections),
        db.select().from(manufacturers),
        db.select().from(manufacturerCatalogProducts),
        db.select().from(productManufacturerCandidates),
        db.select().from(manufacturerQuotes),
        db.select().from(manufacturerQuoteLineItems),
        db.select().from(packagingComponents),
        db.select().from(packagingPriceHistory),
        db.select().from(packagingCompatibility),
        db.select().from(finishedProductConfigurations),
        db.select().from(productPackagingComponents),
        db.select().from(costScenarios),
        db.select().from(costSnapshots),
        db.select().from(documents),
        db.select().from(documentLinks),
        db.select().from(productReadinessItems),
      ]);
      return {
        persistence: "database",
        suppliers: supplierRows,
        supplierProducts: supplierProductRows,
        supplierPrices: supplierPriceRows,
        supplierSelections: selectionRows,
        manufacturers: manufacturerRows,
        catalogProducts: catalogRows,
        candidates: candidateRows,
        quotes: quoteRows,
        quoteLines: quoteLineRows,
        packaging: packagingRows,
        packagingPrices: packagingPriceRows,
        compatibility: compatibilityRows,
        configurations: configurationRows,
        configurationPackaging: configurationPackagingRows,
        scenarios: scenarioRows,
        snapshots: snapshotRows,
        documents: documentRows,
        documentLinks: documentLinkRows,
        readiness: readinessRows,
      };
    },

    async seedApprovedData() {
      await db
        .insert(finishedProductConfigurations)
        .values({
          id: reserveConfigurationId,
          productId: reserveProductId,
          formulaVersionId: reserveFormulaVersionId,
          name: "Legacy Reserve Hair & Beard Oil — 2 oz",
          fillSize: "2",
          fillSizeUnit: "us_fluid_ounces",
          active: true,
        })
        .onConflictDoNothing();
    },

    async execute(action: CommercialAction) {
      switch (action.type) {
        case "create_supplier":
          return (await db.insert(suppliers).values(action).returning())[0];
        case "archive_supplier":
          return (
            await db
              .update(suppliers)
              .set({
                archivedAt: new Date(),
                status: "archived",
                updatedAt: new Date(),
              })
              .where(eq(suppliers.id, action.id))
              .returning()
          )[0];
        case "create_supplier_product":
          return db.transaction(async (tx) => {
            const priced = action.packagePrice && action.currency;
            const calculation = priced
              ? calculateSupplierPrice({
                  packageSize: action.packageSize,
                  packageSizeUnit: action.packageSizeUnit,
                  packageQuantity: action.packageQuantity,
                  packagePrice: action.packagePrice!,
                })
              : null;
            const [product] = await tx
              .insert(supplierProducts)
              .values({ ...action, landedCost: calculation?.landedCost })
              .returning();
            if (product && priced && calculation) {
              const volume = calculation.dimension === "volume";
              const weight = calculation.dimension === "weight";
              await tx.insert(supplierProductPriceHistory).values({
                supplierProductId: product.id,
                packageSize: action.packageSize,
                packageSizeUnit: action.packageSizeUnit,
                packageQuantity: action.packageQuantity,
                packagePrice: action.packagePrice!,
                currency: action.currency!,
                landedCost: calculation.landedCost,
                effectiveDate: new Date().toISOString().slice(0, 10),
                source: action.source,
                normalizedCostPerMl: volume ? calculation.normalizedCost : null,
                normalizedCostPerFluidOunce: volume
                  ? String(Number(calculation.normalizedCost) * 29.5735295625)
                  : null,
                normalizedCostPerGram: weight
                  ? calculation.normalizedCost
                  : null,
                normalizedCostPerOunceWeight: weight
                  ? String(Number(calculation.normalizedCost) * 28.349523125)
                  : null,
                normalizedCostPerPound: weight
                  ? String(Number(calculation.normalizedCost) * 453.59237)
                  : null,
                normalizedCostPerKilogram: weight
                  ? String(Number(calculation.normalizedCost) * 1000)
                  : null,
              });
            }
            return product;
          });
        case "create_manufacturer":
          return (await db.insert(manufacturers).values(action).returning())[0];
        case "create_catalog_product":
          return (
            await db
              .insert(manufacturerCatalogProducts)
              .values(action)
              .returning()
          )[0];
        case "create_quote":
          return (
            await db.insert(manufacturerQuotes).values(action).returning()
          )[0];
        case "create_packaging":
          return (
            await db.insert(packagingComponents).values(action).returning()
          )[0];
        case "create_configuration":
          return (
            await db
              .insert(finishedProductConfigurations)
              .values(action)
              .returning()
          )[0];
        case "create_document":
          return (await db.insert(documents).values(action).returning())[0];
        case "create_cost_scenario":
          return (await db.insert(costScenarios).values(action).returning())[0];
        case "select_supplier_product":
          return db.transaction(async (tx) => {
            if (action.preferred)
              await tx
                .update(formulaSupplierSelections)
                .set({ preferred: false, updatedAt: new Date() })
                .where(
                  and(
                    eq(
                      formulaSupplierSelections.formulaIngredientId,
                      action.formulaIngredientId,
                    ),
                    eq(formulaSupplierSelections.preferred, true),
                  ),
                );
            return (
              await tx
                .insert(formulaSupplierSelections)
                .values(action)
                .returning()
            )[0];
          });
        case "link_manufacturer_candidate":
          return (
            await db
              .insert(productManufacturerCandidates)
              .values(action)
              .returning()
          )[0];
        case "add_quote_line":
          return (
            await db
              .insert(manufacturerQuoteLineItems)
              .values(action)
              .returning()
          )[0];
        case "record_packaging_compatibility":
          return (
            await db.insert(packagingCompatibility).values(action).returning()
          )[0];
        case "attach_packaging":
          return (
            await db
              .insert(productPackagingComponents)
              .values(action)
              .returning()
          )[0];
        case "link_document":
          return (await db.insert(documentLinks).values(action).returning())[0];
        case "create_readiness_item":
          return (
            await db.insert(productReadinessItems).values(action).returning()
          )[0];
      }
    },
  };
}
