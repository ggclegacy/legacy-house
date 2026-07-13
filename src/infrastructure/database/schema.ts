import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const role = pgEnum("role", [
  "founder",
  "product_operator",
  "operations_operator",
  "quality_operator",
  "analyst",
]);

export const physicalDimension = pgEnum("physical_dimension", [
  "mass",
  "volume",
  "count",
]);

export const productLineAccentTheme = pgEnum("product_line_accent_theme", [
  "reserve",
  "sanctum",
  "house",
]);

export const productType = pgEnum("product_type", [
  "hair_beard_care",
  "skin_care",
  "shave_care",
  "supplement",
  "wellness",
  "apparel",
  "accessory",
  "digital_product",
  "other",
]);
export const developmentPath = pgEnum("development_path", [
  "custom_formula",
  "white_label",
  "private_label",
  "manufacturer_custom",
  "curated_resale",
  "undecided",
]);
export const pipelineStatus = pgEnum("pipeline_status", [
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
]);
export const productPriority = pgEnum("product_priority", [
  "low",
  "standard",
  "high",
  "critical",
]);
export const productNoteType = pgEnum("product_note_type", [
  "research",
  "product_idea",
  "sourcing",
  "packaging",
  "testing",
  "launch",
  "market_feedback",
  "general",
]);
export const productDecisionStatus = pgEnum("product_decision_status", [
  "recorded",
  "awaiting_review",
  "validated",
  "reversed",
  "superseded",
]);
export const ingredientCategory = pgEnum("ingredient_category", [
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
]);
export const formulaBasis = pgEnum("formula_basis", [
  "volume_percentage",
  "weight_percentage",
]);
export const formulaStatus = pgEnum("formula_status", [
  "draft",
  "experimental",
  "under_review",
  "approved",
  "production_ready",
  "superseded",
  "archived",
]);
export const bottleSizeUnit = pgEnum("bottle_size_unit", [
  "us_fluid_ounces",
  "milliliters",
  "grams",
]);
export const experimentStatus = pgEnum("experiment_status", [
  "planned",
  "in_progress",
  "resting",
  "observation_period",
  "completed",
  "abandoned",
  "archived",
]);
export const experimentResult = pgEnum("experiment_result", [
  "passed",
  "needs_revision",
  "failed",
  "inconclusive",
  "not_evaluated",
]);
export const observationType = pgEnum("observation_type", [
  "immediate",
  "24_hours",
  "7_days",
  "14_days",
  "30_days",
  "custom",
]);

export const productLines = pgTable(
  "product_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    accentTheme: productLineAccentTheme("accent_theme").notNull(),
    active: boolean("active").default(true).notNull(),
    sortOrder: integer("sort_order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("product_lines_slug_unique").on(table.slug)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productLineId: uuid("product_line_id")
      .notNull()
      .references(() => productLines.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    internalCodeName: text("internal_code_name"),
    sku: text("sku"),
    description: text("description"),
    productType: productType("product_type"),
    developmentPath: developmentPath("development_path").notNull(),
    pipelineStatus: pipelineStatus("pipeline_status").notNull(),
    priority: productPriority("priority").default("standard").notNull(),
    targetCustomer: text("target_customer"),
    problemToSolve: text("problem_to_solve"),
    desiredBenefits: text("desired_benefits"),
    desiredFormat: text("desired_format"),
    desiredTexture: text("desired_texture"),
    desiredAbsorption: text("desired_absorption"),
    desiredColor: text("desired_color"),
    desiredAroma: text("desired_aroma"),
    targetRetailPrice: numeric("target_retail_price", {
      precision: 14,
      scale: 2,
    }),
    targetWholesalePrice: numeric("target_wholesale_price", {
      precision: 14,
      scale: 2,
    }),
    maximumTargetCogs: numeric("maximum_target_cogs", {
      precision: 14,
      scale: 2,
    }),
    targetPackaging: text("target_packaging"),
    targetLaunchDate: date("target_launch_date"),
    whiteLabelPartner: text("white_label_partner"),
    externalManufacturer: text("external_manufacturer"),
    notes: text("notes"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),
    index("products_pipeline_idx").on(
      table.productLineId,
      table.pipelineStatus,
      table.priority,
    ),
  ],
);

export const productBriefs = pgTable("product_briefs", {
  productId: uuid("product_id")
    .primaryKey()
    .references(() => products.id, { onDelete: "cascade" }),
  ingredientsToExplore: text("ingredients_to_explore"),
  ingredientsToAvoid: text("ingredients_to_avoid"),
  competitiveReferences: text("competitive_references"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const productNotes = pgTable(
  "product_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    noteType: productNoteType("note_type").notNull(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("product_notes_product_idx").on(table.productId)],
);

export const productDecisions = pgTable(
  "product_decisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    decision: text("decision").notNull(),
    reason: text("reason").notNull(),
    evidence: text("evidence"),
    expectedOutcome: text("expected_outcome"),
    actualOutcome: text("actual_outcome"),
    decisionDate: date("decision_date").notNull(),
    reviewDate: date("review_date"),
    status: productDecisionStatus("status").default("recorded").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("product_decisions_product_idx").on(table.productId)],
);

export const ingredients = pgTable(
  "ingredients",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    commonName: text("common_name").notNull(),
    inciName: text("inci_name"),
    casNumber: text("cas_number"),
    category: ingredientCategory("category").notNull(),
    description: text("description"),
    functions: text("functions").array().notNull().default([]),
    physicalForm: text("physical_form"),
    naturalColor: text("natural_color"),
    naturalAroma: text("natural_aroma"),
    densityGramsPerMl: numeric("density_grams_per_ml", {
      precision: 12,
      scale: 6,
    }),
    recommendedUsageMinimum: numeric("recommended_usage_minimum", {
      precision: 12,
      scale: 6,
    }),
    recommendedUsageMaximum: numeric("recommended_usage_maximum", {
      precision: 12,
      scale: 6,
    }),
    solubility: text("solubility"),
    heatSensitivity: text("heat_sensitivity"),
    oxidationSensitivity: text("oxidation_sensitivity"),
    storageConditions: text("storage_conditions"),
    shelfLifeMonths: integer("shelf_life_months"),
    formulationConcerns: text("formulation_concerns"),
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
    uniqueIndex("ingredients_common_name_unique").on(table.commonName),
    index("ingredients_category_idx").on(table.category),
  ],
);

export const formulaFamilies = pgTable(
  "formula_families",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    description: text("description"),
    activeVersionId: uuid("active_version_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [index("formula_families_product_idx").on(table.productId)],
);

export const formulaVersions = pgTable(
  "formula_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formulaFamilyId: uuid("formula_family_id")
      .notNull()
      .references(() => formulaFamilies.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    version: text("version").notNull(),
    description: text("description"),
    formulaBasis: formulaBasis("formula_basis").notNull(),
    status: formulaStatus("status").default("draft").notNull(),
    defaultBottleSize: numeric("default_bottle_size", {
      precision: 14,
      scale: 6,
    }),
    defaultBottleSizeUnit: bottleSizeUnit("default_bottle_size_unit"),
    defaultBottleCount: integer("default_bottle_count"),
    defaultOveragePercent: numeric("default_overage_percent", {
      precision: 8,
      scale: 4,
    }),
    changeReason: text("change_reason"),
    previousVersionId: uuid("previous_version_id"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("formula_versions_family_version_unique").on(
      table.formulaFamilyId,
      table.version,
    ),
    index("formula_versions_status_idx").on(table.status),
  ],
);

export const formulaIngredients = pgTable(
  "formula_ingredients",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formulaVersionId: uuid("formula_version_id")
      .notNull()
      .references(() => formulaVersions.id, { onDelete: "cascade" }),
    ingredientId: uuid("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "restrict" }),
    percentage: numeric("percentage", { precision: 12, scale: 6 }).notNull(),
    sortOrder: integer("sort_order").notNull(),
    formulaRole: text("formula_role"),
    processingNotes: text("processing_notes"),
    isConcentratedExtract: boolean("is_concentrated_extract")
      .default(false)
      .notNull(),
    isFragrance: boolean("is_fragrance").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("formula_ingredients_version_ingredient_unique").on(
      table.formulaVersionId,
      table.ingredientId,
    ),
  ],
);

export const formulaProductionSteps = pgTable(
  "formula_production_steps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formulaVersionId: uuid("formula_version_id")
      .notNull()
      .references(() => formulaVersions.id, { onDelete: "cascade" }),
    phase: text("phase").notNull(),
    stepNumber: integer("step_number").notNull(),
    instruction: text("instruction").notNull(),
    required: boolean("required").default(true).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("formula_steps_version_number_unique").on(
      table.formulaVersionId,
      table.stepNumber,
    ),
  ],
);

export const experiments = pgTable(
  "experiments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    formulaVersionId: uuid("formula_version_id")
      .notNull()
      .references(() => formulaVersions.id, { onDelete: "restrict" }),
    experimentNumber: text("experiment_number").notNull(),
    name: text("name").notNull(),
    objective: text("objective").notNull(),
    hypothesis: text("hypothesis").notNull(),
    testBatchSize: numeric("test_batch_size", {
      precision: 14,
      scale: 6,
    }).notNull(),
    testBatchUnit: bottleSizeUnit("test_batch_unit").notNull(),
    status: experimentStatus("status").default("planned").notNull(),
    productionDate: date("production_date"),
    conclusion: text("conclusion"),
    nextChange: text("next_change"),
    result: experimentResult("result").default("not_evaluated").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("experiments_product_number_unique").on(
      table.productId,
      table.experimentNumber,
    ),
    index("experiments_status_idx").on(table.status),
  ],
);

export const experimentObservations = pgTable(
  "experiment_observations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    experimentId: uuid("experiment_id")
      .notNull()
      .references(() => experiments.id, { onDelete: "cascade" }),
    observationType: observationType("observation_type").notNull(),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    colorScore: integer("color_score"),
    aromaStrengthScore: integer("aroma_strength_score"),
    absorptionScore: integer("absorption_score"),
    greasinessScore: integer("greasiness_score"),
    slipScore: integer("slip_score"),
    hairFeelScore: integer("hair_feel_score"),
    beardFeelScore: integer("beard_feel_score"),
    skinFeelScore: integer("skin_feel_score"),
    stainingObserved: boolean("staining_observed"),
    separationObserved: boolean("separation_observed"),
    sedimentObserved: boolean("sediment_observed"),
    cloudinessObserved: boolean("cloudiness_observed"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("experiment_observations_experiment_idx").on(table.experimentId),
  ],
);

export const appSettings = pgTable(
  "app_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull(),
    valueJson: jsonb("value_json").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("app_settings_key_unique").on(table.key)],
);

export const activityEvents = pgTable(
  "activity_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    metadataJson: jsonb("metadata_json").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("activity_events_entity_idx").on(table.entityType, table.entityId),
    index("activity_events_created_at_idx").on(table.createdAt),
  ],
);

export const appUsers = pgTable(
  "app_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    externalSubject: text("external_subject").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("app_users_external_subject_unique").on(table.externalSubject),
  ],
);

export const appUserRoles = pgTable(
  "app_user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => appUsers.id, { onDelete: "cascade" }),
    role: role("role").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.role] })],
);

export const units = pgTable(
  "units",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    dimension: physicalDimension("dimension").notNull(),
  },
  (table) => [uniqueIndex("units_code_unique").on(table.code)],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => appUsers.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    reason: text("reason"),
    metadata: jsonb("metadata").notNull().default({}),
  },
  (table) => [
    index("audit_events_entity_idx").on(table.entityType, table.entityId),
    index("audit_events_occurred_at_idx").on(table.occurredAt),
  ],
);
