import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import {
  formulaIngredients,
  formulaVersions,
  ingredients,
  products,
} from "./schema";

const money = (name: string) => numeric(name, { precision: 16, scale: 4 });
const quantity = (name: string) => numeric(name, { precision: 18, scale: 6 });
const percent = (name: string) => numeric(name, { precision: 10, scale: 4 });

export const supplierType = pgEnum("supplier_type", [
  "raw_material",
  "packaging",
  "contract_manufacturer",
  "white_label",
  "private_label",
  "testing_laboratory",
  "general_vendor",
  "other",
]);
export const supplierStatus = pgEnum("supplier_status", [
  "prospect",
  "contacted",
  "active",
  "preferred",
  "on_hold",
  "rejected",
  "archived",
]);
export const availabilityStatus = pgEnum("availability_status", [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "special_order",
  "unknown",
  "discontinued",
]);
export const supplierProductStatus = pgEnum("supplier_product_status", [
  "researching",
  "testing",
  "approved_internally",
  "preferred",
  "alternate",
  "rejected",
  "archived",
]);
export const commercialUnit = pgEnum("commercial_unit", [
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
]);
export const supplierSelectionType = pgEnum("supplier_selection_type", [
  "preferred",
  "alternate",
  "testing",
  "emergency_backup",
  "historical",
]);
export const manufacturerType = pgEnum("manufacturer_type", [
  "custom",
  "contract",
  "white_label",
  "private_label",
  "bulk_blender",
  "supplement",
  "packaging_filling",
  "other",
]);
export const manufacturerStatus = pgEnum("manufacturer_status", [
  "discovered",
  "contacted",
  "awaiting_response",
  "catalog_reviewed",
  "sample_requested",
  "sample_received",
  "sample_testing",
  "quote_received",
  "approved_internally",
  "preferred",
  "rejected",
  "archived",
]);
export const catalogProductStatus = pgEnum("catalog_product_status", [
  "discovered",
  "researching",
  "sample_requested",
  "sample_received",
  "testing",
  "shortlisted",
  "selected",
  "rejected",
  "archived",
]);
export const candidateType = pgEnum("candidate_type", [
  "white_label",
  "private_label",
  "custom_formula",
  "bulk_blending",
  "packaging_filling",
  "alternate_manufacturer",
]);
export const candidateStatus = pgEnum("candidate_status", [
  "researching",
  "contacted",
  "sample_requested",
  "testing",
  "shortlisted",
  "selected",
  "rejected",
  "on_hold",
]);
export const quoteStatus = pgEnum("quote_status", [
  "draft",
  "requested",
  "received",
  "under_review",
  "shortlisted",
  "accepted",
  "rejected",
  "expired",
  "archived",
]);
export const quoteLineType = pgEnum("quote_line_type", [
  "setup",
  "formula_review",
  "sample",
  "raw_materials",
  "blending",
  "manufacturing",
  "testing",
  "filling",
  "container",
  "closure",
  "label",
  "carton",
  "packaging",
  "shipping",
  "storage",
  "other",
]);
export const packagingComponentType = pgEnum("packaging_component_type", [
  "bottle",
  "jar",
  "pump",
  "dropper",
  "cap",
  "lid",
  "label",
  "box",
  "carton",
  "insert",
  "tamper_seal",
  "shrink_band",
  "pouch",
  "scoop",
  "shaker",
  "shipping_box",
  "protective_fill",
  "other",
]);
export const compatibilityType = pgEnum("compatibility_type", [
  "bottle_closure",
  "jar_lid",
  "bottle_label",
  "container_carton",
  "container_seal",
  "other",
]);
export const compatibilityStatus = pgEnum("compatibility_status", [
  "unknown",
  "sample_ordered",
  "testing",
  "confirmed",
  "incompatible",
]);
export const documentType = pgEnum("document_type", [
  "certificate_of_analysis",
  "safety_data_sheet",
  "technical_data_sheet",
  "ifra_certificate",
  "allergen_statement",
  "organic_certificate",
  "ingredient_specification",
  "packaging_specification",
  "technical_drawing",
  "supplier_agreement",
  "manufacturer_agreement",
  "nda",
  "quote",
  "invoice",
  "formula_record",
  "test_report",
  "label_file",
  "product_artwork",
  "batch_record",
  "supplement_facts",
  "product_catalog",
  "sample_evaluation",
  "other",
]);
export const documentStatus = pgEnum("document_status", [
  "current",
  "expiring_soon",
  "expired",
  "missing_information",
  "needs_review",
  "archived",
]);
export const readinessCategory = pgEnum("readiness_category", [
  "product_brief",
  "formula",
  "ingredients",
  "suppliers",
  "manufacturer",
  "sample_testing",
  "packaging",
  "documentation",
  "costing",
  "pricing",
  "production",
  "labeling",
  "launch",
  "market",
]);
export const readinessStatus = pgEnum("readiness_status", [
  "complete",
  "in_progress",
  "missing",
  "needs_review",
  "blocked",
  "not_applicable",
]);
export const readinessSource = pgEnum("readiness_source", [
  "system_generated",
  "user_created",
]);

export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    supplierType: supplierType("supplier_type").notNull(),
    website: text("website"),
    location: text("location"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    wholesaleAvailable: boolean("wholesale_available"),
    sampleAvailable: boolean("sample_available"),
    preferred: boolean("preferred").default(false).notNull(),
    status: supplierStatus("status").default("prospect").notNull(),
    minimumOrderNotes: text("minimum_order_notes"),
    leadTimeNotes: text("lead_time_notes"),
    shippingNotes: text("shipping_notes"),
    paymentTerms: text("payment_terms"),
    reliabilityScore: integer("reliability_score"),
    qualityScore: integer("quality_score"),
    documentationScore: integer("documentation_score"),
    priceScore: integer("price_score"),
    communicationScore: integer("communication_score"),
    notes: text("notes"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("suppliers_slug_unique").on(table.slug),
    index("suppliers_type_status_idx").on(table.supplierType, table.status),
  ],
);

export const supplierProducts = pgTable(
  "supplier_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "restrict" }),
    ingredientId: uuid("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    sku: text("sku"),
    productUrl: text("product_url"),
    description: text("description"),
    packageSize: quantity("package_size"),
    packageSizeUnit: commercialUnit("package_size_unit"),
    packageQuantity: quantity("package_quantity"),
    packagePrice: money("package_price"),
    currency: text("currency"),
    shippingCost: money("shipping_cost"),
    shippingAllocation: money("shipping_allocation"),
    taxAllocation: money("tax_allocation"),
    discountAllocation: money("discount_allocation"),
    otherAcquisitionCost: money("other_acquisition_cost"),
    landedCost: money("landed_cost"),
    minimumOrderQuantity: quantity("minimum_order_quantity"),
    minimumOrderUnit: commercialUnit("minimum_order_unit"),
    leadTimeDays: integer("lead_time_days"),
    availabilityStatus: availabilityStatus("availability_status")
      .default("unknown")
      .notNull(),
    organicStatus: text("organic_status"),
    extractionMethod: text("extraction_method"),
    processingMethod: text("processing_method"),
    countryOfOrigin: text("country_of_origin"),
    sampleAvailable: boolean("sample_available"),
    status: supplierProductStatus("status").default("researching").notNull(),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("supplier_products_supplier_idx").on(table.supplierId),
    index("supplier_products_ingredient_idx").on(table.ingredientId),
  ],
);

export const supplierProductPriceHistory = pgTable(
  "supplier_product_price_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    supplierProductId: uuid("supplier_product_id")
      .notNull()
      .references(() => supplierProducts.id, { onDelete: "restrict" }),
    packageSize: quantity("package_size").notNull(),
    packageSizeUnit: commercialUnit("package_size_unit").notNull(),
    packageQuantity: quantity("package_quantity").notNull(),
    packagePrice: money("package_price").notNull(),
    currency: text("currency").notNull(),
    shippingCost: money("shipping_cost"),
    shippingAllocation: money("shipping_allocation"),
    taxAllocation: money("tax_allocation"),
    discountAllocation: money("discount_allocation"),
    otherAcquisitionCost: money("other_acquisition_cost"),
    landedCost: money("landed_cost").notNull(),
    normalizedCostPerMl: money("normalized_cost_per_ml"),
    normalizedCostPerFluidOunce: money("normalized_cost_per_fluid_ounce"),
    normalizedCostPerGram: money("normalized_cost_per_gram"),
    normalizedCostPerOunceWeight: money("normalized_cost_per_ounce_weight"),
    normalizedCostPerPound: money("normalized_cost_per_pound"),
    normalizedCostPerKilogram: money("normalized_cost_per_kilogram"),
    effectiveDate: date("effective_date").notNull(),
    source: text("source"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("supplier_price_history_product_date_idx").on(
      table.supplierProductId,
      table.effectiveDate,
    ),
  ],
);

export const formulaSupplierSelections = pgTable(
  "formula_supplier_selections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formulaVersionId: uuid("formula_version_id")
      .notNull()
      .references(() => formulaVersions.id, { onDelete: "restrict" }),
    formulaIngredientId: uuid("formula_ingredient_id")
      .notNull()
      .references(() => formulaIngredients.id, { onDelete: "restrict" }),
    ingredientId: uuid("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "restrict" }),
    supplierProductId: uuid("supplier_product_id")
      .notNull()
      .references(() => supplierProducts.id, { onDelete: "restrict" }),
    selectionType: supplierSelectionType("selection_type").notNull(),
    preferred: boolean("preferred").default(false).notNull(),
    approvedForProduction: boolean("approved_for_production")
      .default(false)
      .notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("formula_selection_line_product_unique").on(
      table.formulaIngredientId,
      table.supplierProductId,
    ),
    index("formula_selection_version_idx").on(table.formulaVersionId),
  ],
);

export const manufacturers = pgTable(
  "manufacturers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    manufacturerType: manufacturerType("manufacturer_type").notNull(),
    website: text("website"),
    location: text("location"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    customFormulaCapability: boolean("custom_formula_capability"),
    privateLabelCapability: boolean("private_label_capability"),
    whiteLabelCapability: boolean("white_label_capability"),
    bulkBlendingCapability: boolean("bulk_blending_capability"),
    supplementCapability: boolean("supplement_capability"),
    groomingCapability: boolean("grooming_capability"),
    skincareCapability: boolean("skincare_capability"),
    packagingCapability: boolean("packaging_capability"),
    fillingCapability: boolean("filling_capability"),
    labelingCapability: boolean("labeling_capability"),
    clientOwnedFormulaAccepted: boolean("client_owned_formula_accepted"),
    clientSuppliedMaterialsAccepted: boolean(
      "client_supplied_materials_accepted",
    ),
    manufacturerSourcedMaterials: boolean("manufacturer_sourced_materials"),
    minimumOrderNotes: text("minimum_order_notes"),
    minimumGallons: quantity("minimum_gallons"),
    minimumKilograms: quantity("minimum_kilograms"),
    minimumUnits: integer("minimum_units"),
    sampleFee: money("sample_fee"),
    setupFee: money("setup_fee"),
    typicalLeadTimeDays: integer("typical_lead_time_days"),
    certifications: text("certifications").array().default([]).notNull(),
    ndaStatus: text("nda_status"),
    formulaOwnershipNotes: text("formula_ownership_notes"),
    productOwnershipNotes: text("product_ownership_notes"),
    paymentTerms: text("payment_terms"),
    status: manufacturerStatus("status").default("discovered").notNull(),
    preferred: boolean("preferred").default(false).notNull(),
    notes: text("notes"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("manufacturers_slug_unique").on(table.slug),
    index("manufacturers_type_status_idx").on(
      table.manufacturerType,
      table.status,
    ),
  ],
);

export const manufacturerCatalogProducts = pgTable(
  "manufacturer_catalog_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    manufacturerId: uuid("manufacturer_id")
      .notNull()
      .references(() => manufacturers.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    manufacturerSku: text("manufacturer_sku"),
    productUrl: text("product_url"),
    productType: text("product_type"),
    dosageForm: text("dosage_form"),
    flavor: text("flavor"),
    servingSize: text("serving_size"),
    servingsPerContainer: integer("servings_per_container"),
    formulaSummary: text("formula_summary"),
    ingredientStatement: text("ingredient_statement"),
    labelClaims: text("label_claims").array().default([]).notNull(),
    packageOptions: text("package_options"),
    minimumOrderQuantity: integer("minimum_order_quantity"),
    sampleAvailable: boolean("sample_available"),
    sampleCost: money("sample_cost"),
    estimatedUnitCost: money("estimated_unit_cost"),
    currency: text("currency"),
    leadTimeDays: integer("lead_time_days"),
    status: catalogProductStatus("status").default("discovered").notNull(),
    notes: text("notes"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("catalog_products_manufacturer_idx").on(table.manufacturerId),
  ],
);

export const productManufacturerCandidates = pgTable(
  "product_manufacturer_candidates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    manufacturerId: uuid("manufacturer_id")
      .notNull()
      .references(() => manufacturers.id, { onDelete: "restrict" }),
    manufacturerCatalogProductId: uuid(
      "manufacturer_catalog_product_id",
    ).references(() => manufacturerCatalogProducts.id, {
      onDelete: "restrict",
    }),
    candidateType: candidateType("candidate_type").notNull(),
    status: candidateStatus("status").default("researching").notNull(),
    rank: integer("rank"),
    strengths: text("strengths"),
    concerns: text("concerns"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("product_manufacturer_candidate_unique").on(
      table.productId,
      table.manufacturerId,
      table.manufacturerCatalogProductId,
    ),
  ],
);

export const manufacturerQuotes = pgTable(
  "manufacturer_quotes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    manufacturerId: uuid("manufacturer_id")
      .notNull()
      .references(() => manufacturers.id, { onDelete: "restrict" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    formulaVersionId: uuid("formula_version_id").references(
      () => formulaVersions.id,
      { onDelete: "restrict" },
    ),
    manufacturerCatalogProductId: uuid(
      "manufacturer_catalog_product_id",
    ).references(() => manufacturerCatalogProducts.id, {
      onDelete: "restrict",
    }),
    quoteNumber: text("quote_number").notNull(),
    quoteDate: date("quote_date").notNull(),
    expirationDate: date("expiration_date"),
    currency: text("currency").notNull(),
    minimumQuantity: quantity("minimum_quantity"),
    quantityUnit: commercialUnit("quantity_unit"),
    setupFee: money("setup_fee"),
    sampleFee: money("sample_fee"),
    estimatedShipping: money("estimated_shipping"),
    estimatedLeadTimeDays: integer("estimated_lead_time_days"),
    materialSourcingTerms: text("material_sourcing_terms"),
    formulaOwnershipTerms: text("formula_ownership_terms"),
    productOwnershipTerms: text("product_ownership_terms"),
    paymentTerms: text("payment_terms"),
    totalQuotedCost: money("total_quoted_cost"),
    estimatedUnitCost: money("estimated_unit_cost"),
    quoteStatus: quoteStatus("quote_status").default("draft").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("manufacturer_quote_number_unique").on(
      table.manufacturerId,
      table.quoteNumber,
    ),
    index("manufacturer_quotes_product_idx").on(table.productId),
  ],
);

export const manufacturerQuoteLineItems = pgTable(
  "manufacturer_quote_line_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    manufacturerQuoteId: uuid("manufacturer_quote_id")
      .notNull()
      .references(() => manufacturerQuotes.id, { onDelete: "cascade" }),
    lineItemType: quoteLineType("line_item_type").notNull(),
    description: text("description").notNull(),
    quantity: quantity("quantity"),
    quantityUnit: commercialUnit("quantity_unit"),
    unitPrice: money("unit_price"),
    totalPrice: money("total_price").notNull(),
    notes: text("notes"),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("quote_line_items_quote_idx").on(table.manufacturerQuoteId),
  ],
);

export const packagingComponents = pgTable(
  "packaging_components",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    componentType: packagingComponentType("component_type").notNull(),
    description: text("description"),
    material: text("material"),
    color: text("color"),
    finish: text("finish"),
    capacity: quantity("capacity"),
    capacityUnit: commercialUnit("capacity_unit"),
    dimensions: text("dimensions"),
    neckFinish: text("neck_finish"),
    compatibilityNotes: text("compatibility_notes"),
    labelWidth: quantity("label_width"),
    labelHeight: quantity("label_height"),
    labelUnit: commercialUnit("label_unit"),
    supplierId: uuid("supplier_id").references(() => suppliers.id, {
      onDelete: "restrict",
    }),
    supplierProductName: text("supplier_product_name"),
    sku: text("sku"),
    productUrl: text("product_url"),
    packageQuantity: quantity("package_quantity"),
    packagePrice: money("package_price"),
    currency: text("currency"),
    shippingCost: money("shipping_cost"),
    shippingAllocation: money("shipping_allocation"),
    landedCost: money("landed_cost"),
    unitCost: money("unit_cost"),
    minimumOrderQuantity: quantity("minimum_order_quantity"),
    leadTimeDays: integer("lead_time_days"),
    availabilityStatus: availabilityStatus("availability_status")
      .default("unknown")
      .notNull(),
    preferred: boolean("preferred").default(false).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("packaging_components_type_idx").on(table.componentType),
    uniqueIndex("packaging_supplier_sku_unique").on(
      table.supplierId,
      table.sku,
    ),
  ],
);

export const packagingPriceHistory = pgTable(
  "packaging_price_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    packagingComponentId: uuid("packaging_component_id")
      .notNull()
      .references(() => packagingComponents.id, { onDelete: "restrict" }),
    packageQuantity: quantity("package_quantity").notNull(),
    packagePrice: money("package_price").notNull(),
    shippingCost: money("shipping_cost"),
    shippingAllocation: money("shipping_allocation"),
    landedCost: money("landed_cost").notNull(),
    unitCost: money("unit_cost").notNull(),
    effectiveDate: date("effective_date").notNull(),
    source: text("source"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("packaging_price_history_date_idx").on(
      table.packagingComponentId,
      table.effectiveDate,
    ),
  ],
);

export const packagingCompatibility = pgTable(
  "packaging_compatibility",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    primaryComponentId: uuid("primary_component_id")
      .notNull()
      .references(() => packagingComponents.id, { onDelete: "restrict" }),
    secondaryComponentId: uuid("secondary_component_id")
      .notNull()
      .references(() => packagingComponents.id, { onDelete: "restrict" }),
    compatibilityType: compatibilityType("compatibility_type").notNull(),
    status: compatibilityStatus("status").default("unknown").notNull(),
    testedDate: date("tested_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("packaging_compatibility_pair_unique").on(
      table.primaryComponentId,
      table.secondaryComponentId,
      table.compatibilityType,
    ),
  ],
);

export const finishedProductConfigurations = pgTable(
  "finished_product_configurations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    formulaVersionId: uuid("formula_version_id").references(
      () => formulaVersions.id,
      { onDelete: "restrict" },
    ),
    manufacturerCatalogProductId: uuid(
      "manufacturer_catalog_product_id",
    ).references(() => manufacturerCatalogProducts.id, {
      onDelete: "restrict",
    }),
    name: text("name").notNull(),
    sku: text("sku"),
    fillSize: quantity("fill_size").notNull(),
    fillSizeUnit: commercialUnit("fill_size_unit").notNull(),
    unitsPerCase: integer("units_per_case"),
    targetRetailPrice: money("target_retail_price"),
    targetWholesalePrice: money("target_wholesale_price"),
    promotionalPrice: money("promotional_price"),
    targetMaximumCogs: money("target_maximum_cogs"),
    targetRetailMarginPercent: percent("target_retail_margin_percent"),
    targetWholesaleMarginPercent: percent("target_wholesale_margin_percent"),
    expectedBatchLossPercent: percent("expected_batch_loss_percent"),
    expectedFillLossPercent: percent("expected_fill_loss_percent"),
    active: boolean("active").default(false).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("finished_configs_product_idx").on(table.productId),
    uniqueIndex("finished_configs_product_name_unique").on(
      table.productId,
      table.name,
    ),
  ],
);

export const productPackagingComponents = pgTable(
  "product_packaging_components",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    finishedProductConfigurationId: uuid("finished_product_configuration_id")
      .notNull()
      .references(() => finishedProductConfigurations.id, {
        onDelete: "cascade",
      }),
    packagingComponentId: uuid("packaging_component_id")
      .notNull()
      .references(() => packagingComponents.id, { onDelete: "restrict" }),
    quantityPerFinishedUnit: quantity("quantity_per_finished_unit").notNull(),
    wastePercent: percent("waste_percent").default("0").notNull(),
    required: boolean("required").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("config_packaging_component_unique").on(
      table.finishedProductConfigurationId,
      table.packagingComponentId,
    ),
  ],
);

export const costAssumptions = pgTable(
  "cost_assumptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    finishedProductConfigurationId: uuid("finished_product_configuration_id")
      .notNull()
      .references(() => finishedProductConfigurations.id, {
        onDelete: "cascade",
      }),
    laborMinutesPerBatch: quantity("labor_minutes_per_batch"),
    laborHourlyRate: money("labor_hourly_rate"),
    laborCostPerBatch: money("labor_cost_per_batch"),
    testingCostPerBatch: money("testing_cost_per_batch"),
    manufacturerFeePerBatch: money("manufacturer_fee_per_batch"),
    fulfillmentCostPerUnit: money("fulfillment_cost_per_unit"),
    paymentProcessingPercent: percent("payment_processing_percent"),
    paymentProcessingFixed: money("payment_processing_fixed"),
    marketplaceFeePercent: percent("marketplace_fee_percent"),
    storageCostPerUnit: money("storage_cost_per_unit"),
    overheadPercent: percent("overhead_percent"),
    overheadFixedPerBatch: money("overhead_fixed_per_batch"),
    miscellaneousCostPerBatch: money("miscellaneous_cost_per_batch"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("cost_assumption_config_unique").on(
      table.finishedProductConfigurationId,
    ),
  ],
);

export const costScenarios = pgTable(
  "cost_scenarios",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    finishedProductConfigurationId: uuid("finished_product_configuration_id")
      .notNull()
      .references(() => finishedProductConfigurations.id, {
        onDelete: "restrict",
      }),
    name: text("name").notNull(),
    description: text("description"),
    scenarioDataJson: jsonb("scenario_data_json").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    index("cost_scenarios_config_idx").on(table.finishedProductConfigurationId),
  ],
);

export const costSnapshots = pgTable(
  "cost_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    finishedProductConfigurationId: uuid("finished_product_configuration_id")
      .notNull()
      .references(() => finishedProductConfigurations.id, {
        onDelete: "restrict",
      }),
    formulaVersionId: uuid("formula_version_id").references(
      () => formulaVersions.id,
      { onDelete: "restrict" },
    ),
    manufacturerCatalogProductId: uuid(
      "manufacturer_catalog_product_id",
    ).references(() => manufacturerCatalogProducts.id, {
      onDelete: "restrict",
    }),
    calculatedAt: timestamp("calculated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    plannedUnitCount: integer("planned_unit_count").notNull(),
    productionOveragePercent: percent("production_overage_percent").notNull(),
    expectedLossPercent: percent("expected_loss_percent").notNull(),
    ingredientCost: money("ingredient_cost"),
    manufacturerProductCost: money("manufacturer_product_cost"),
    packagingCost: money("packaging_cost"),
    laborCost: money("labor_cost"),
    testingCost: money("testing_cost"),
    manufacturerFee: money("manufacturer_fee"),
    fulfillmentCost: money("fulfillment_cost"),
    paymentProcessingCost: money("payment_processing_cost"),
    marketplaceFee: money("marketplace_fee"),
    storageCost: money("storage_cost"),
    overheadCost: money("overhead_cost"),
    miscellaneousCost: money("miscellaneous_cost"),
    totalBatchCost: money("total_batch_cost").notNull(),
    expectedCompletedUnits: integer("expected_completed_units").notNull(),
    ingredientCostPerUnit: money("ingredient_cost_per_unit"),
    manufacturerProductCostPerUnit: money("manufacturer_product_cost_per_unit"),
    packagingCostPerUnit: money("packaging_cost_per_unit"),
    fullyLoadedCogsPerUnit: money("fully_loaded_cogs_per_unit").notNull(),
    retailPrice: money("retail_price"),
    wholesalePrice: money("wholesale_price"),
    promotionalPrice: money("promotional_price"),
    retailGrossProfitPerUnit: money("retail_gross_profit_per_unit"),
    wholesaleGrossProfitPerUnit: money("wholesale_gross_profit_per_unit"),
    promotionalGrossProfitPerUnit: money("promotional_gross_profit_per_unit"),
    retailGrossMarginPercent: percent("retail_gross_margin_percent"),
    wholesaleGrossMarginPercent: percent("wholesale_gross_margin_percent"),
    promotionalGrossMarginPercent: percent("promotional_gross_margin_percent"),
    assumptionsJson: jsonb("assumptions_json").notNull(),
    supplierSelectionsJson: jsonb("supplier_selections_json").notNull(),
    packagingSelectionsJson: jsonb("packaging_selections_json").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("cost_snapshots_config_date_idx").on(
      table.finishedProductConfigurationId,
      table.calculatedAt,
    ),
  ],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    documentType: documentType("document_type").notNull(),
    fileName: text("file_name").notNull(),
    storageKey: text("storage_key").notNull(),
    fileUrl: text("file_url"),
    mimeType: text("mime_type").notNull(),
    fileSize: integer("file_size").notNull(),
    issuer: text("issuer"),
    issueDate: date("issue_date"),
    expirationDate: date("expiration_date"),
    status: documentStatus("status").default("missing_information").notNull(),
    notes: text("notes"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("documents_storage_key_unique").on(table.storageKey),
    index("documents_status_expiration_idx").on(
      table.status,
      table.expirationDate,
    ),
  ],
);

export const documentLinks = pgTable(
  "document_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    relationshipType: text("relationship_type").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("document_link_unique").on(
      table.documentId,
      table.entityType,
      table.entityId,
      table.relationshipType,
    ),
    index("document_links_entity_idx").on(table.entityType, table.entityId),
  ],
);

export const productReadinessItems = pgTable(
  "product_readiness_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    finishedProductConfigurationId: uuid(
      "finished_product_configuration_id",
    ).references(() => finishedProductConfigurations.id, {
      onDelete: "cascade",
    }),
    readinessCategory: readinessCategory("readiness_category").notNull(),
    itemName: text("item_name").notNull(),
    itemDescription: text("item_description"),
    sourceType: readinessSource("source_type").notNull(),
    required: boolean("required").default(true).notNull(),
    status: readinessStatus("status").default("missing").notNull(),
    relatedEntityType: text("related_entity_type"),
    relatedEntityId: uuid("related_entity_id"),
    notApplicableReason: text("not_applicable_reason"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("readiness_product_category_idx").on(
      table.productId,
      table.readinessCategory,
    ),
  ],
);
