import type { BatchCalculationResult } from "@/src/domain/formulas/calculation";
import type { SaveBatchPlanInput } from "@/src/domain/production/batch-plan";
import type { Database } from "@/src/infrastructure/database/client";
import { batchPlans } from "@/src/infrastructure/database/production-schema";

export function createDrizzleProductionRepository(database: Database) {
  return {
    async saveBatchPlan(
      input: SaveBatchPlanInput,
      calculation: BatchCalculationResult,
    ) {
      const [created] = await database
        .insert(batchPlans)
        .values({
          formulaVersionId: input.formulaVersionId,
          bottleCount: input.bottleCount,
          bottleSize: input.bottleSize,
          bottleSizeUnit: input.bottleSizeUnit,
          overagePercent: input.overagePercent,
          outputPrecision: input.outputPrecision,
          calculationSnapshot: calculation,
          notes: input.notes,
        })
        .returning({ id: batchPlans.id, createdAt: batchPlans.createdAt });
      if (!created) throw new Error("Batch Plan was not saved.");
      return created;
    },
  };
}
