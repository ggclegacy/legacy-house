import { describe, expect, it } from "vitest";
import { commercialActionSchema } from "./actions";

const id = "00000000-0000-4000-8000-000000000001";
const parse = (value: Record<string, unknown>) =>
  commercialActionSchema.safeParse(value).success;

describe("commercial action boundary", () => {
  it("accepts every supported command shape", () => {
    const commands = [
      {
        type: "create_supplier",
        name: "Supplier",
        slug: "supplier",
        supplierType: "raw_material",
      },
      { type: "archive_supplier", id },
      {
        type: "create_supplier_product",
        supplierId: id,
        ingredientId: id,
        name: "Oil",
        packageSize: "1",
        packageSizeUnit: "liters",
        packageQuantity: "1",
        packagePrice: "12.50",
        currency: "USD",
      },
      {
        type: "create_manufacturer",
        name: "Partner",
        slug: "partner",
        manufacturerType: "white_label",
      },
      {
        type: "create_catalog_product",
        manufacturerId: id,
        name: "Catalog item",
      },
      {
        type: "create_quote",
        manufacturerId: id,
        productId: id,
        quoteNumber: "Q-1",
        quoteDate: "2026-07-13",
        currency: "USD",
      },
      { type: "create_packaging", name: "Bottle", componentType: "bottle" },
      {
        type: "create_configuration",
        productId: id,
        formulaVersionId: id,
        name: "Two ounce",
        fillSize: "2",
        fillSizeUnit: "us_fluid_ounces",
      },
      {
        type: "create_document",
        title: "Quote",
        documentType: "quote",
        fileName: "quote.pdf",
        storageKey: "quotes/quote.pdf",
        mimeType: "application/pdf",
        fileSize: 20,
      },
      {
        type: "create_cost_scenario",
        finishedProductConfigurationId: id,
        name: "Run",
        scenarioDataJson: {},
      },
      {
        type: "select_supplier_product",
        formulaVersionId: id,
        formulaIngredientId: id,
        ingredientId: id,
        supplierProductId: id,
        selectionType: "preferred",
        preferred: true,
      },
      {
        type: "link_manufacturer_candidate",
        productId: id,
        manufacturerId: id,
        candidateType: "white_label",
      },
      {
        type: "add_quote_line",
        manufacturerQuoteId: id,
        lineItemType: "setup",
        description: "Setup",
        quantity: "1",
        totalPrice: "10",
        sortOrder: 0,
      },
      {
        type: "record_packaging_compatibility",
        primaryComponentId: id,
        secondaryComponentId: id,
        compatibilityType: "bottle_closure",
        status: "testing",
      },
      {
        type: "attach_packaging",
        finishedProductConfigurationId: id,
        packagingComponentId: id,
        quantityPerFinishedUnit: "1",
        sortOrder: 0,
      },
      {
        type: "link_document",
        documentId: id,
        entityType: "product",
        entityId: id,
        relationshipType: "evidence",
      },
      {
        type: "create_readiness_item",
        productId: id,
        readinessCategory: "costing",
        itemName: "COGS",
        sourceType: "user_created",
        status: "missing",
      },
    ];
    expect(commands.every(parse)).toBe(true);
  });

  it("rejects invalid currencies and ambiguous configuration sources", () => {
    expect(
      parse({
        type: "create_quote",
        manufacturerId: id,
        productId: id,
        quoteNumber: "Q",
        quoteDate: "2026-07-13",
        currency: "usd",
      }),
    ).toBe(false);
    expect(
      parse({
        type: "create_configuration",
        productId: id,
        formulaVersionId: id,
        manufacturerCatalogProductId: id,
        name: "Invalid",
        fillSize: "2",
        fillSizeUnit: "each",
      }),
    ).toBe(false);
    expect(
      parse({
        type: "create_readiness_item",
        productId: id,
        readinessCategory: "costing",
        itemName: "COGS",
        sourceType: "user_created",
        status: "not_applicable",
      }),
    ).toBe(false);
  });
});
