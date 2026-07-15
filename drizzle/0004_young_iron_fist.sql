CREATE TABLE "batch_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"formula_version_id" uuid NOT NULL,
	"bottle_count" integer NOT NULL,
	"bottle_size" numeric(18, 12) NOT NULL,
	"bottle_size_unit" text NOT NULL,
	"overage_percent" numeric(10, 6) NOT NULL,
	"output_precision" integer NOT NULL,
	"calculation_snapshot" jsonb NOT NULL,
	"notes" text,
	"status" text DEFAULT 'planned' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "batch_plans" ADD CONSTRAINT "batch_plans_formula_version_id_formula_versions_id_fk" FOREIGN KEY ("formula_version_id") REFERENCES "public"."formula_versions"("id") ON DELETE restrict ON UPDATE no action;