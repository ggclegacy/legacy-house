import { z } from "zod";

export const saveBatchPlanSchema = z.object({
  formulaVersionId: z.string().uuid(),
  bottleCount: z.number().int().positive(),
  bottleSize: z.string().regex(/^\d+(?:\.\d+)?$/),
  bottleSizeUnit: z.enum(["us_fluid_ounces", "milliliters", "grams"]),
  overagePercent: z.string().regex(/^\d+(?:\.\d+)?$/),
  outputPrecision: z.number().int().min(0).max(12),
  notes: z.string().trim().max(5000).nullable(),
});

export type SaveBatchPlanInput = z.infer<typeof saveBatchPlanSchema>;
