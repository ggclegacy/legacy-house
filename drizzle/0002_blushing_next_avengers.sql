CREATE TYPE "public"."bottle_size_unit" AS ENUM('us_fluid_ounces', 'milliliters', 'grams');--> statement-breakpoint
CREATE TYPE "public"."development_path" AS ENUM('custom_formula', 'white_label', 'private_label', 'manufacturer_custom', 'curated_resale', 'undecided');--> statement-breakpoint
CREATE TYPE "public"."experiment_result" AS ENUM('passed', 'needs_revision', 'failed', 'inconclusive', 'not_evaluated');--> statement-breakpoint
CREATE TYPE "public"."experiment_status" AS ENUM('planned', 'in_progress', 'resting', 'observation_period', 'completed', 'abandoned', 'archived');--> statement-breakpoint
CREATE TYPE "public"."formula_basis" AS ENUM('volume_percentage', 'weight_percentage');--> statement-breakpoint
CREATE TYPE "public"."formula_status" AS ENUM('draft', 'experimental', 'under_review', 'approved', 'production_ready', 'superseded', 'archived');--> statement-breakpoint
CREATE TYPE "public"."ingredient_category" AS ENUM('base_blend', 'carrier_oil', 'active_oil', 'botanical_extract', 'fragrance', 'antioxidant', 'emulsifier', 'preservative', 'surfactant', 'humectant', 'thickener', 'powder', 'flavor', 'sweetener', 'mineral', 'vitamin', 'amino_acid', 'other');--> statement-breakpoint
CREATE TYPE "public"."observation_type" AS ENUM('immediate', '24_hours', '7_days', '14_days', '30_days', 'custom');--> statement-breakpoint
CREATE TYPE "public"."pipeline_status" AS ENUM('idea', 'research', 'product_brief', 'formulation', 'supplier_sourcing', 'testing', 'refinement', 'packaging', 'costing', 'production_ready', 'launch_planning', 'launched', 'on_hold', 'archived');--> statement-breakpoint
CREATE TYPE "public"."product_decision_status" AS ENUM('recorded', 'awaiting_review', 'validated', 'reversed', 'superseded');--> statement-breakpoint
CREATE TYPE "public"."product_note_type" AS ENUM('research', 'product_idea', 'sourcing', 'packaging', 'testing', 'launch', 'market_feedback', 'general');--> statement-breakpoint
CREATE TYPE "public"."product_priority" AS ENUM('low', 'standard', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."product_type" AS ENUM('hair_beard_care', 'skin_care', 'shave_care', 'supplement', 'wellness', 'apparel', 'accessory', 'digital_product', 'other');--> statement-breakpoint
CREATE TABLE "experiment_observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experiment_id" uuid NOT NULL,
	"observation_type" "observation_type" NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"color_score" integer,
	"aroma_strength_score" integer,
	"absorption_score" integer,
	"greasiness_score" integer,
	"slip_score" integer,
	"hair_feel_score" integer,
	"beard_feel_score" integer,
	"skin_feel_score" integer,
	"staining_observed" boolean,
	"separation_observed" boolean,
	"sediment_observed" boolean,
	"cloudiness_observed" boolean,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"formula_version_id" uuid NOT NULL,
	"experiment_number" text NOT NULL,
	"name" text NOT NULL,
	"objective" text NOT NULL,
	"hypothesis" text NOT NULL,
	"test_batch_size" numeric(14, 6) NOT NULL,
	"test_batch_unit" "bottle_size_unit" NOT NULL,
	"status" "experiment_status" DEFAULT 'planned' NOT NULL,
	"production_date" date,
	"conclusion" text,
	"next_change" text,
	"result" "experiment_result" DEFAULT 'not_evaluated' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "formula_families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"active_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "formula_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formula_version_id" uuid NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"percentage" numeric(12, 6) NOT NULL,
	"sort_order" integer NOT NULL,
	"formula_role" text,
	"processing_notes" text,
	"is_concentrated_extract" boolean DEFAULT false NOT NULL,
	"is_fragrance" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formula_production_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formula_version_id" uuid NOT NULL,
	"phase" text NOT NULL,
	"step_number" integer NOT NULL,
	"instruction" text NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "formula_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formula_family_id" uuid NOT NULL,
	"name" text NOT NULL,
	"version" text NOT NULL,
	"description" text,
	"formula_basis" "formula_basis" NOT NULL,
	"status" "formula_status" DEFAULT 'draft' NOT NULL,
	"default_bottle_size" numeric(14, 6),
	"default_bottle_size_unit" "bottle_size_unit",
	"default_bottle_count" integer,
	"default_overage_percent" numeric(8, 4),
	"change_reason" text,
	"previous_version_id" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"common_name" text NOT NULL,
	"inci_name" text,
	"cas_number" text,
	"category" "ingredient_category" NOT NULL,
	"description" text,
	"functions" text[] DEFAULT '{}' NOT NULL,
	"physical_form" text,
	"natural_color" text,
	"natural_aroma" text,
	"density_grams_per_ml" numeric(12, 6),
	"recommended_usage_minimum" numeric(12, 6),
	"recommended_usage_maximum" numeric(12, 6),
	"solubility" text,
	"heat_sensitivity" text,
	"oxidation_sensitivity" text,
	"storage_conditions" text,
	"shelf_life_months" integer,
	"formulation_concerns" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "product_briefs" (
	"product_id" uuid PRIMARY KEY NOT NULL,
	"ingredients_to_explore" text,
	"ingredients_to_avoid" text,
	"competitive_references" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"title" text NOT NULL,
	"decision" text NOT NULL,
	"reason" text NOT NULL,
	"evidence" text,
	"expected_outcome" text,
	"actual_outcome" text,
	"decision_date" date NOT NULL,
	"review_date" date,
	"status" "product_decision_status" DEFAULT 'recorded' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"note_type" "product_note_type" NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_line_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"internal_code_name" text,
	"sku" text,
	"description" text,
	"product_type" "product_type",
	"development_path" "development_path" NOT NULL,
	"pipeline_status" "pipeline_status" NOT NULL,
	"priority" "product_priority" DEFAULT 'standard' NOT NULL,
	"target_customer" text,
	"problem_to_solve" text,
	"desired_benefits" text,
	"desired_format" text,
	"desired_texture" text,
	"desired_absorption" text,
	"desired_color" text,
	"desired_aroma" text,
	"target_retail_price" numeric(14, 2),
	"target_wholesale_price" numeric(14, 2),
	"maximum_target_cogs" numeric(14, 2),
	"target_packaging" text,
	"target_launch_date" date,
	"white_label_partner" text,
	"external_manufacturer" text,
	"notes" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "experiment_observations" ADD CONSTRAINT "experiment_observations_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_families" ADD CONSTRAINT "formula_families_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_ingredients" ADD CONSTRAINT "formula_ingredients_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_ingredients" ADD CONSTRAINT "formula_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_production_steps" ADD CONSTRAINT "formula_production_steps_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "formula_versions" ADD CONSTRAINT "formula_versions_formula_family_id_formula_families_id_fk" FOREIGN KEY ("formula_family_id") REFERENCES "public"."formula_families"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_briefs" ADD CONSTRAINT "product_briefs_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_decisions" ADD CONSTRAINT "product_decisions_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_notes" ADD CONSTRAINT "product_notes_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_product_line_id_product_lines_id_fk" FOREIGN KEY ("product_line_id") REFERENCES "public"."product_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "experiment_observations_experiment_idx" ON "experiment_observations" USING btree ("experiment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "experiments_product_number_unique" ON "experiments" USING btree ("product_id","experiment_number");--> statement-breakpoint
CREATE INDEX "experiments_status_idx" ON "experiments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "formula_families_product_idx" ON "formula_families" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "formula_ingredients_version_ingredient_unique" ON "formula_ingredients" USING btree ("formula_version_id","ingredient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "formula_steps_version_number_unique" ON "formula_production_steps" USING btree ("formula_version_id","step_number");--> statement-breakpoint
CREATE UNIQUE INDEX "formula_versions_family_version_unique" ON "formula_versions" USING btree ("formula_family_id","version");--> statement-breakpoint
CREATE INDEX "formula_versions_status_idx" ON "formula_versions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "ingredients_common_name_unique" ON "ingredients" USING btree ("common_name");--> statement-breakpoint
CREATE INDEX "ingredients_category_idx" ON "ingredients" USING btree ("category");--> statement-breakpoint
CREATE INDEX "product_decisions_product_idx" ON "product_decisions" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_notes_product_idx" ON "product_notes" USING btree ("product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_pipeline_idx" ON "products" USING btree ("product_line_id","pipeline_status","priority");