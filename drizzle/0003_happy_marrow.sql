CREATE TYPE "public"."availability_status" AS ENUM('in_stock', 'low_stock', 'out_of_stock', 'special_order', 'unknown', 'discontinued');--> statement-breakpoint
CREATE TYPE "public"."candidate_status" AS ENUM('researching', 'contacted', 'sample_requested', 'testing', 'shortlisted', 'selected', 'rejected', 'on_hold');--> statement-breakpoint
CREATE TYPE "public"."candidate_type" AS ENUM('white_label', 'private_label', 'custom_formula', 'bulk_blending', 'packaging_filling', 'alternate_manufacturer');--> statement-breakpoint
CREATE TYPE "public"."catalog_product_status" AS ENUM('discovered', 'researching', 'sample_requested', 'sample_received', 'testing', 'shortlisted', 'selected', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."commercial_unit" AS ENUM('milliliters', 'liters', 'us_fluid_ounces', 'us_gallons', 'grams', 'kilograms', 'ounces_weight', 'pounds', 'each', 'dozen', 'pack', 'case');--> statement-breakpoint
CREATE TYPE "public"."compatibility_status" AS ENUM('unknown', 'sample_ordered', 'testing', 'confirmed', 'incompatible');--> statement-breakpoint
CREATE TYPE "public"."compatibility_type" AS ENUM('bottle_closure', 'jar_lid', 'bottle_label', 'container_carton', 'container_seal', 'other');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('current', 'expiring_soon', 'expired', 'missing_information', 'needs_review', 'archived');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('certificate_of_analysis', 'safety_data_sheet', 'technical_data_sheet', 'ifra_certificate', 'allergen_statement', 'organic_certificate', 'ingredient_specification', 'packaging_specification', 'technical_drawing', 'supplier_agreement', 'manufacturer_agreement', 'nda', 'quote', 'invoice', 'formula_record', 'test_report', 'label_file', 'product_artwork', 'batch_record', 'supplement_facts', 'product_catalog', 'sample_evaluation', 'other');--> statement-breakpoint
CREATE TYPE "public"."manufacturer_status" AS ENUM('discovered', 'contacted', 'awaiting_response', 'catalog_reviewed', 'sample_requested', 'sample_received', 'sample_testing', 'quote_received', 'approved_internally', 'preferred', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."manufacturer_type" AS ENUM('custom', 'contract', 'white_label', 'private_label', 'bulk_blender', 'supplement', 'packaging_filling', 'other');--> statement-breakpoint
CREATE TYPE "public"."packaging_component_type" AS ENUM('bottle', 'jar', 'pump', 'dropper', 'cap', 'lid', 'label', 'box', 'carton', 'insert', 'tamper_seal', 'shrink_band', 'pouch', 'scoop', 'shaker', 'shipping_box', 'protective_fill', 'other');--> statement-breakpoint
CREATE TYPE "public"."quote_line_type" AS ENUM('setup', 'formula_review', 'sample', 'raw_materials', 'blending', 'manufacturing', 'testing', 'filling', 'container', 'closure', 'label', 'carton', 'packaging', 'shipping', 'storage', 'other');--> statement-breakpoint
CREATE TYPE "public"."quote_status" AS ENUM('draft', 'requested', 'received', 'under_review', 'shortlisted', 'accepted', 'rejected', 'expired', 'archived');--> statement-breakpoint
CREATE TYPE "public"."readiness_category" AS ENUM('product_brief', 'formula', 'ingredients', 'suppliers', 'manufacturer', 'sample_testing', 'packaging', 'documentation', 'costing', 'pricing', 'production', 'labeling', 'launch', 'market');--> statement-breakpoint
CREATE TYPE "public"."readiness_source" AS ENUM('system_generated', 'user_created');--> statement-breakpoint
CREATE TYPE "public"."readiness_status" AS ENUM('complete', 'in_progress', 'missing', 'needs_review', 'blocked', 'not_applicable');--> statement-breakpoint
CREATE TYPE "public"."supplier_product_status" AS ENUM('researching', 'testing', 'approved_internally', 'preferred', 'alternate', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."supplier_selection_type" AS ENUM('preferred', 'alternate', 'testing', 'emergency_backup', 'historical');--> statement-breakpoint
CREATE TYPE "public"."supplier_status" AS ENUM('prospect', 'contacted', 'active', 'preferred', 'on_hold', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."supplier_type" AS ENUM('raw_material', 'packaging', 'contract_manufacturer', 'white_label', 'private_label', 'testing_laboratory', 'general_vendor', 'other');--> statement-breakpoint
CREATE TABLE "cost_assumptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"finished_product_configuration_id" uuid NOT NULL,
	"labor_minutes_per_batch" numeric(18, 6),
	"labor_hourly_rate" numeric(16, 4),
	"labor_cost_per_batch" numeric(16, 4),
	"testing_cost_per_batch" numeric(16, 4),
	"manufacturer_fee_per_batch" numeric(16, 4),
	"fulfillment_cost_per_unit" numeric(16, 4),
	"payment_processing_percent" numeric(10, 4),
	"payment_processing_fixed" numeric(16, 4),
	"marketplace_fee_percent" numeric(10, 4),
	"storage_cost_per_unit" numeric(16, 4),
	"overhead_percent" numeric(10, 4),
	"overhead_fixed_per_batch" numeric(16, 4),
	"miscellaneous_cost_per_batch" numeric(16, 4),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cost_scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"finished_product_configuration_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"scenario_data_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cost_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"finished_product_configuration_id" uuid NOT NULL,
	"formula_version_id" uuid,
	"manufacturer_catalog_product_id" uuid,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"planned_unit_count" integer NOT NULL,
	"production_overage_percent" numeric(10, 4) NOT NULL,
	"expected_loss_percent" numeric(10, 4) NOT NULL,
	"ingredient_cost" numeric(16, 4),
	"manufacturer_product_cost" numeric(16, 4),
	"packaging_cost" numeric(16, 4),
	"labor_cost" numeric(16, 4),
	"testing_cost" numeric(16, 4),
	"manufacturer_fee" numeric(16, 4),
	"fulfillment_cost" numeric(16, 4),
	"payment_processing_cost" numeric(16, 4),
	"marketplace_fee" numeric(16, 4),
	"storage_cost" numeric(16, 4),
	"overhead_cost" numeric(16, 4),
	"miscellaneous_cost" numeric(16, 4),
	"total_batch_cost" numeric(16, 4) NOT NULL,
	"expected_completed_units" integer NOT NULL,
	"ingredient_cost_per_unit" numeric(16, 4),
	"manufacturer_product_cost_per_unit" numeric(16, 4),
	"packaging_cost_per_unit" numeric(16, 4),
	"fully_loaded_cogs_per_unit" numeric(16, 4) NOT NULL,
	"retail_price" numeric(16, 4),
	"wholesale_price" numeric(16, 4),
	"promotional_price" numeric(16, 4),
	"retail_gross_profit_per_unit" numeric(16, 4),
	"wholesale_gross_profit_per_unit" numeric(16, 4),
	"promotional_gross_profit_per_unit" numeric(16, 4),
	"retail_gross_margin_percent" numeric(10, 4),
	"wholesale_gross_margin_percent" numeric(10, 4),
	"promotional_gross_margin_percent" numeric(10, 4),
	"assumptions_json" jsonb NOT NULL,
	"supplier_selections_json" jsonb NOT NULL,
	"packaging_selections_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"relationship_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"document_type" "document_type" NOT NULL,
	"file_name" text NOT NULL,
	"storage_key" text NOT NULL,
	"file_url" text,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"issuer" text,
	"issue_date" date,
	"expiration_date" date,
	"status" "document_status" DEFAULT 'missing_information' NOT NULL,
	"notes" text,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "finished_product_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"formula_version_id" uuid,
	"manufacturer_catalog_product_id" uuid,
	"name" text NOT NULL,
	"sku" text,
	"fill_size" numeric(18, 6) NOT NULL,
	"fill_size_unit" "commercial_unit" NOT NULL,
	"units_per_case" integer,
	"target_retail_price" numeric(16, 4),
	"target_wholesale_price" numeric(16, 4),
	"promotional_price" numeric(16, 4),
	"target_maximum_cogs" numeric(16, 4),
	"target_retail_margin_percent" numeric(10, 4),
	"target_wholesale_margin_percent" numeric(10, 4),
	"expected_batch_loss_percent" numeric(10, 4),
	"expected_fill_loss_percent" numeric(10, 4),
	"active" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "formula_supplier_selections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formula_version_id" uuid NOT NULL,
	"formula_ingredient_id" uuid NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"supplier_product_id" uuid NOT NULL,
	"selection_type" "supplier_selection_type" NOT NULL,
	"preferred" boolean DEFAULT false NOT NULL,
	"approved_for_production" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manufacturer_catalog_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" uuid NOT NULL,
	"name" text NOT NULL,
	"manufacturer_sku" text,
	"product_url" text,
	"product_type" text,
	"dosage_form" text,
	"flavor" text,
	"serving_size" text,
	"servings_per_container" integer,
	"formula_summary" text,
	"ingredient_statement" text,
	"label_claims" text[] DEFAULT '{}' NOT NULL,
	"package_options" text,
	"minimum_order_quantity" integer,
	"sample_available" boolean,
	"sample_cost" numeric(16, 4),
	"estimated_unit_cost" numeric(16, 4),
	"currency" text,
	"lead_time_days" integer,
	"status" "catalog_product_status" DEFAULT 'discovered' NOT NULL,
	"notes" text,
	"last_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "manufacturer_quote_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_quote_id" uuid NOT NULL,
	"line_item_type" "quote_line_type" NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric(18, 6),
	"quantity_unit" "commercial_unit",
	"unit_price" numeric(16, 4),
	"total_price" numeric(16, 4) NOT NULL,
	"notes" text,
	"sort_order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manufacturer_quotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manufacturer_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"formula_version_id" uuid,
	"manufacturer_catalog_product_id" uuid,
	"quote_number" text NOT NULL,
	"quote_date" date NOT NULL,
	"expiration_date" date,
	"currency" text NOT NULL,
	"minimum_quantity" numeric(18, 6),
	"quantity_unit" "commercial_unit",
	"setup_fee" numeric(16, 4),
	"sample_fee" numeric(16, 4),
	"estimated_shipping" numeric(16, 4),
	"estimated_lead_time_days" integer,
	"material_sourcing_terms" text,
	"formula_ownership_terms" text,
	"product_ownership_terms" text,
	"payment_terms" text,
	"total_quoted_cost" numeric(16, 4),
	"estimated_unit_cost" numeric(16, 4),
	"quote_status" "quote_status" DEFAULT 'draft' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "manufacturers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"manufacturer_type" "manufacturer_type" NOT NULL,
	"website" text,
	"location" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"custom_formula_capability" boolean,
	"private_label_capability" boolean,
	"white_label_capability" boolean,
	"bulk_blending_capability" boolean,
	"supplement_capability" boolean,
	"grooming_capability" boolean,
	"skincare_capability" boolean,
	"packaging_capability" boolean,
	"filling_capability" boolean,
	"labeling_capability" boolean,
	"client_owned_formula_accepted" boolean,
	"client_supplied_materials_accepted" boolean,
	"manufacturer_sourced_materials" boolean,
	"minimum_order_notes" text,
	"minimum_gallons" numeric(18, 6),
	"minimum_kilograms" numeric(18, 6),
	"minimum_units" integer,
	"sample_fee" numeric(16, 4),
	"setup_fee" numeric(16, 4),
	"typical_lead_time_days" integer,
	"certifications" text[] DEFAULT '{}' NOT NULL,
	"nda_status" text,
	"formula_ownership_notes" text,
	"product_ownership_notes" text,
	"payment_terms" text,
	"status" "manufacturer_status" DEFAULT 'discovered' NOT NULL,
	"preferred" boolean DEFAULT false NOT NULL,
	"notes" text,
	"last_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "packaging_compatibility" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_component_id" uuid NOT NULL,
	"secondary_component_id" uuid NOT NULL,
	"compatibility_type" "compatibility_type" NOT NULL,
	"status" "compatibility_status" DEFAULT 'unknown' NOT NULL,
	"tested_date" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packaging_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"component_type" "packaging_component_type" NOT NULL,
	"description" text,
	"material" text,
	"color" text,
	"finish" text,
	"capacity" numeric(18, 6),
	"capacity_unit" "commercial_unit",
	"dimensions" text,
	"neck_finish" text,
	"compatibility_notes" text,
	"label_width" numeric(18, 6),
	"label_height" numeric(18, 6),
	"label_unit" "commercial_unit",
	"supplier_id" uuid,
	"supplier_product_name" text,
	"sku" text,
	"product_url" text,
	"package_quantity" numeric(18, 6),
	"package_price" numeric(16, 4),
	"currency" text,
	"shipping_cost" numeric(16, 4),
	"shipping_allocation" numeric(16, 4),
	"landed_cost" numeric(16, 4),
	"unit_cost" numeric(16, 4),
	"minimum_order_quantity" numeric(18, 6),
	"lead_time_days" integer,
	"availability_status" "availability_status" DEFAULT 'unknown' NOT NULL,
	"preferred" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "packaging_price_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"packaging_component_id" uuid NOT NULL,
	"package_quantity" numeric(18, 6) NOT NULL,
	"package_price" numeric(16, 4) NOT NULL,
	"shipping_cost" numeric(16, 4),
	"shipping_allocation" numeric(16, 4),
	"landed_cost" numeric(16, 4) NOT NULL,
	"unit_cost" numeric(16, 4) NOT NULL,
	"effective_date" date NOT NULL,
	"source" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_manufacturer_candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"manufacturer_id" uuid NOT NULL,
	"manufacturer_catalog_product_id" uuid,
	"candidate_type" "candidate_type" NOT NULL,
	"status" "candidate_status" DEFAULT 'researching' NOT NULL,
	"rank" integer,
	"strengths" text,
	"concerns" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_packaging_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"finished_product_configuration_id" uuid NOT NULL,
	"packaging_component_id" uuid NOT NULL,
	"quantity_per_finished_unit" numeric(18, 6) NOT NULL,
	"waste_percent" numeric(10, 4) DEFAULT '0' NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"sort_order" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_readiness_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"finished_product_configuration_id" uuid,
	"readiness_category" "readiness_category" NOT NULL,
	"item_name" text NOT NULL,
	"item_description" text,
	"source_type" "readiness_source" NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"status" "readiness_status" DEFAULT 'missing' NOT NULL,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"not_applicable_reason" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_product_price_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_product_id" uuid NOT NULL,
	"package_size" numeric(18, 6) NOT NULL,
	"package_size_unit" "commercial_unit" NOT NULL,
	"package_quantity" numeric(18, 6) NOT NULL,
	"package_price" numeric(16, 4) NOT NULL,
	"currency" text NOT NULL,
	"shipping_cost" numeric(16, 4),
	"shipping_allocation" numeric(16, 4),
	"tax_allocation" numeric(16, 4),
	"discount_allocation" numeric(16, 4),
	"other_acquisition_cost" numeric(16, 4),
	"landed_cost" numeric(16, 4) NOT NULL,
	"normalized_cost_per_ml" numeric(16, 4),
	"normalized_cost_per_fluid_ounce" numeric(16, 4),
	"normalized_cost_per_gram" numeric(16, 4),
	"normalized_cost_per_ounce_weight" numeric(16, 4),
	"normalized_cost_per_pound" numeric(16, 4),
	"normalized_cost_per_kilogram" numeric(16, 4),
	"effective_date" date NOT NULL,
	"source" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"product_url" text,
	"description" text,
	"package_size" numeric(18, 6),
	"package_size_unit" "commercial_unit",
	"package_quantity" numeric(18, 6),
	"package_price" numeric(16, 4),
	"currency" text,
	"shipping_cost" numeric(16, 4),
	"shipping_allocation" numeric(16, 4),
	"tax_allocation" numeric(16, 4),
	"discount_allocation" numeric(16, 4),
	"other_acquisition_cost" numeric(16, 4),
	"landed_cost" numeric(16, 4),
	"minimum_order_quantity" numeric(18, 6),
	"minimum_order_unit" "commercial_unit",
	"lead_time_days" integer,
	"availability_status" "availability_status" DEFAULT 'unknown' NOT NULL,
	"organic_status" text,
	"extraction_method" text,
	"processing_method" text,
	"country_of_origin" text,
	"sample_available" boolean,
	"status" "supplier_product_status" DEFAULT 'researching' NOT NULL,
	"last_verified_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"supplier_type" "supplier_type" NOT NULL,
	"website" text,
	"location" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"wholesale_available" boolean,
	"sample_available" boolean,
	"preferred" boolean DEFAULT false NOT NULL,
	"status" "supplier_status" DEFAULT 'prospect' NOT NULL,
	"minimum_order_notes" text,
	"lead_time_notes" text,
	"shipping_notes" text,
	"payment_terms" text,
	"reliability_score" integer,
	"quality_score" integer,
	"documentation_score" integer,
	"price_score" integer,
	"communication_score" integer,
	"notes" text,
	"last_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "cost_assumptions" ADD CONSTRAINT "cost_assumptions_finished_product_configuration_id_finished_product_configurations_id_fk" FOREIGN KEY ("finished_product_configuration_id") REFERENCES "public"."finished_product_configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_scenarios" ADD CONSTRAINT "cost_scenarios_finished_product_configuration_id_finished_product_configurations_id_fk" FOREIGN KEY ("finished_product_configuration_id") REFERENCES "public"."finished_product_configurations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_snapshots" ADD CONSTRAINT "cost_snapshots_finished_product_configuration_id_finished_product_configurations_id_fk" FOREIGN KEY ("finished_product_configuration_id") REFERENCES "public"."finished_product_configurations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_snapshots" ADD CONSTRAINT "cost_snapshots_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_snapshots" ADD CONSTRAINT "cost_snapshots_manufacturer_catalog_product_id_manufacturer_catalog_products_id_fk" FOREIGN KEY ("manufacturer_catalog_product_id") REFERENCES "public"."manufacturer_catalog_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_links" ADD CONSTRAINT "document_links_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finished_product_configurations" ADD CONSTRAINT "finished_product_configurations_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finished_product_configurations" ADD CONSTRAINT "finished_product_configurations_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finished_product_configurations" ADD CONSTRAINT "finished_product_configurations_manufacturer_catalog_product_id_manufacturer_catalog_products_id_fk" FOREIGN KEY ("manufacturer_catalog_product_id") REFERENCES "public"."manufacturer_catalog_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_supplier_selections" ADD CONSTRAINT "formula_supplier_selections_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_supplier_selections" ADD CONSTRAINT "formula_supplier_selections_formula_ingredient_id_formula_ingredients_id_fk" FOREIGN KEY ("formula_ingredient_id") REFERENCES "public"."formula_ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_supplier_selections" ADD CONSTRAINT "formula_supplier_selections_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_supplier_selections" ADD CONSTRAINT "formula_supplier_selections_supplier_product_id_supplier_products_id_fk" FOREIGN KEY ("supplier_product_id") REFERENCES "public"."supplier_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_catalog_products" ADD CONSTRAINT "manufacturer_catalog_products_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_quote_line_items" ADD CONSTRAINT "manufacturer_quote_line_items_manufacturer_quote_id_manufacturer_quotes_id_fk" FOREIGN KEY ("manufacturer_quote_id") REFERENCES "public"."manufacturer_quotes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_quotes" ADD CONSTRAINT "manufacturer_quotes_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_quotes" ADD CONSTRAINT "manufacturer_quotes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_quotes" ADD CONSTRAINT "manufacturer_quotes_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manufacturer_quotes" ADD CONSTRAINT "manufacturer_quotes_manufacturer_catalog_product_id_manufacturer_catalog_products_id_fk" FOREIGN KEY ("manufacturer_catalog_product_id") REFERENCES "public"."manufacturer_catalog_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packaging_compatibility" ADD CONSTRAINT "packaging_compatibility_primary_component_id_packaging_components_id_fk" FOREIGN KEY ("primary_component_id") REFERENCES "public"."packaging_components"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packaging_compatibility" ADD CONSTRAINT "packaging_compatibility_secondary_component_id_packaging_components_id_fk" FOREIGN KEY ("secondary_component_id") REFERENCES "public"."packaging_components"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packaging_components" ADD CONSTRAINT "packaging_components_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "packaging_price_history" ADD CONSTRAINT "packaging_price_history_packaging_component_id_packaging_components_id_fk" FOREIGN KEY ("packaging_component_id") REFERENCES "public"."packaging_components"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_manufacturer_candidates" ADD CONSTRAINT "product_manufacturer_candidates_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_manufacturer_candidates" ADD CONSTRAINT "product_manufacturer_candidates_manufacturer_id_manufacturers_id_fk" FOREIGN KEY ("manufacturer_id") REFERENCES "public"."manufacturers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_manufacturer_candidates" ADD CONSTRAINT "product_manufacturer_candidates_manufacturer_catalog_product_id_manufacturer_catalog_products_id_fk" FOREIGN KEY ("manufacturer_catalog_product_id") REFERENCES "public"."manufacturer_catalog_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_packaging_components" ADD CONSTRAINT "product_packaging_components_finished_product_configuration_id_finished_product_configurations_id_fk" FOREIGN KEY ("finished_product_configuration_id") REFERENCES "public"."finished_product_configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_packaging_components" ADD CONSTRAINT "product_packaging_components_packaging_component_id_packaging_components_id_fk" FOREIGN KEY ("packaging_component_id") REFERENCES "public"."packaging_components"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_readiness_items" ADD CONSTRAINT "product_readiness_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_readiness_items" ADD CONSTRAINT "product_readiness_items_finished_product_configuration_id_finished_product_configurations_id_fk" FOREIGN KEY ("finished_product_configuration_id") REFERENCES "public"."finished_product_configurations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_product_price_history" ADD CONSTRAINT "supplier_product_price_history_supplier_product_id_supplier_products_id_fk" FOREIGN KEY ("supplier_product_id") REFERENCES "public"."supplier_products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_products" ADD CONSTRAINT "supplier_products_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_products" ADD CONSTRAINT "supplier_products_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cost_assumption_config_unique" ON "cost_assumptions" USING btree ("finished_product_configuration_id");--> statement-breakpoint
CREATE INDEX "cost_scenarios_config_idx" ON "cost_scenarios" USING btree ("finished_product_configuration_id");--> statement-breakpoint
CREATE INDEX "cost_snapshots_config_date_idx" ON "cost_snapshots" USING btree ("finished_product_configuration_id","calculated_at");--> statement-breakpoint
CREATE UNIQUE INDEX "document_link_unique" ON "document_links" USING btree ("document_id","entity_type","entity_id","relationship_type");--> statement-breakpoint
CREATE INDEX "document_links_entity_idx" ON "document_links" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "documents_storage_key_unique" ON "documents" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "documents_status_expiration_idx" ON "documents" USING btree ("status","expiration_date");--> statement-breakpoint
CREATE INDEX "finished_configs_product_idx" ON "finished_product_configurations" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "finished_configs_product_name_unique" ON "finished_product_configurations" USING btree ("product_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "formula_selection_line_product_unique" ON "formula_supplier_selections" USING btree ("formula_ingredient_id","supplier_product_id");--> statement-breakpoint
CREATE INDEX "formula_selection_version_idx" ON "formula_supplier_selections" USING btree ("formula_version_id");--> statement-breakpoint
CREATE INDEX "catalog_products_manufacturer_idx" ON "manufacturer_catalog_products" USING btree ("manufacturer_id");--> statement-breakpoint
CREATE INDEX "quote_line_items_quote_idx" ON "manufacturer_quote_line_items" USING btree ("manufacturer_quote_id");--> statement-breakpoint
CREATE UNIQUE INDEX "manufacturer_quote_number_unique" ON "manufacturer_quotes" USING btree ("manufacturer_id","quote_number");--> statement-breakpoint
CREATE INDEX "manufacturer_quotes_product_idx" ON "manufacturer_quotes" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "manufacturers_slug_unique" ON "manufacturers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "manufacturers_type_status_idx" ON "manufacturers" USING btree ("manufacturer_type","status");--> statement-breakpoint
CREATE UNIQUE INDEX "packaging_compatibility_pair_unique" ON "packaging_compatibility" USING btree ("primary_component_id","secondary_component_id","compatibility_type");--> statement-breakpoint
CREATE INDEX "packaging_components_type_idx" ON "packaging_components" USING btree ("component_type");--> statement-breakpoint
CREATE UNIQUE INDEX "packaging_supplier_sku_unique" ON "packaging_components" USING btree ("supplier_id","sku");--> statement-breakpoint
CREATE INDEX "packaging_price_history_date_idx" ON "packaging_price_history" USING btree ("packaging_component_id","effective_date");--> statement-breakpoint
CREATE UNIQUE INDEX "product_manufacturer_candidate_unique" ON "product_manufacturer_candidates" USING btree ("product_id","manufacturer_id","manufacturer_catalog_product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "config_packaging_component_unique" ON "product_packaging_components" USING btree ("finished_product_configuration_id","packaging_component_id");--> statement-breakpoint
CREATE INDEX "readiness_product_category_idx" ON "product_readiness_items" USING btree ("product_id","readiness_category");--> statement-breakpoint
CREATE INDEX "supplier_price_history_product_date_idx" ON "supplier_product_price_history" USING btree ("supplier_product_id","effective_date");--> statement-breakpoint
CREATE INDEX "supplier_products_supplier_idx" ON "supplier_products" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "supplier_products_ingredient_idx" ON "supplier_products" USING btree ("ingredient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "suppliers_slug_unique" ON "suppliers" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "suppliers_type_status_idx" ON "suppliers" USING btree ("supplier_type","status");