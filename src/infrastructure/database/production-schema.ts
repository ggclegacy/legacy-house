import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { formulaVersions } from "./schema";

export const batchPlans = pgTable("batch_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  formulaVersionId: uuid("formula_version_id")
    .notNull()
    .references(() => formulaVersions.id, { onDelete: "restrict" }),
  bottleCount: integer("bottle_count").notNull(),
  bottleSize: numeric("bottle_size", { precision: 18, scale: 12 }).notNull(),
  bottleSizeUnit: text("bottle_size_unit").notNull(),
  overagePercent: numeric("overage_percent", {
    precision: 10,
    scale: 6,
  }).notNull(),
  outputPrecision: integer("output_precision").notNull(),
  calculationSnapshot: jsonb("calculation_snapshot").notNull(),
  notes: text("notes"),
  status: text("status").default("planned").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const batchPlanRelations = relations(batchPlans, ({ one }) => ({
  formulaVersion: one(formulaVersions, {
    fields: [batchPlans.formulaVersionId],
    references: [formulaVersions.id],
  }),
}));
