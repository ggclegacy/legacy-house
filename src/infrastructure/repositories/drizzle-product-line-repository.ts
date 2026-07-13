import { asc, eq } from "drizzle-orm";

import type {
  CreateProductLineInput,
  ProductLineRepository,
  ProductLineSeedDefinition,
} from "@/src/domain/product-lines/product-line";
import type { Database } from "@/src/infrastructure/database/client";
import {
  activityEvents,
  productLines,
} from "@/src/infrastructure/database/schema";

export function createDrizzleProductLineRepository(
  database: Database,
): ProductLineRepository {
  return {
    async listActive() {
      return database
        .select()
        .from(productLines)
        .where(eq(productLines.active, true))
        .orderBy(asc(productLines.sortOrder), asc(productLines.name));
    },

    async create(input: CreateProductLineInput) {
      return database.transaction(async (transaction) => {
        const current = await transaction
          .select({ sortOrder: productLines.sortOrder })
          .from(productLines);
        const nextSortOrder =
          Math.max(0, ...current.map((row) => row.sortOrder)) + 10;
        const [created] = await transaction
          .insert(productLines)
          .values({ ...input, sortOrder: nextSortOrder })
          .returning();
        if (!created)
          throw new Error("Product line creation returned no record.");
        await transaction.insert(activityEvents).values({
          entityType: "product_line",
          entityId: created.id,
          action: "created",
          title: `Product line created: ${created.name}`,
          description:
            "Created through the Phase 1 product-line administration foundation.",
          metadataJson: {
            slug: created.slug,
            accentTheme: created.accentTheme,
          },
        });
        return created;
      });
    },

    async seed(definitions: readonly ProductLineSeedDefinition[]) {
      for (const definition of definitions) {
        await database
          .insert(productLines)
          .values({ ...definition, active: true })
          .onConflictDoUpdate({
            target: productLines.slug,
            set: {
              name: definition.name,
              description: definition.description,
              accentTheme: definition.accentTheme,
              active: true,
              sortOrder: definition.sortOrder,
              updatedAt: new Date(),
              archivedAt: null,
            },
          });
      }
    },
  };
}
