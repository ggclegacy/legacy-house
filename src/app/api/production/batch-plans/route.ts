import { runtimeMutationDeniedResponse } from "@/src/config/runtime-policy";
import { saveBatchPlanSchema } from "@/src/domain/production/batch-plan";
import { calculateBatch } from "@/src/domain/formulas/calculation";
import {
  createDatabase,
  getRuntimeDatabaseUrl,
} from "@/src/infrastructure/database/client";
import { createDrizzleDevelopmentRepository } from "@/src/infrastructure/repositories/drizzle-development-repository";
import { createDrizzleProductionRepository } from "@/src/infrastructure/repositories/drizzle-production-repository";

export async function POST(request: Request) {
  const denied = runtimeMutationDeniedResponse();
  if (denied) return denied;
  const parsed = saveBatchPlanSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return Response.json(
      {
        error: "Batch Plan validation failed.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  const url = getRuntimeDatabaseUrl();
  if (!url)
    return Response.json(
      {
        error:
          "PostgreSQL is not configured. No Batch Plan was saved and no inventory was changed.",
      },
      { status: 503 },
    );
  const connection = createDatabase(url);
  try {
    const development = await createDrizzleDevelopmentRepository(
      connection.db,
    ).getSnapshot();
    const formula = development.formulas.find(
      (item) => item.versionId === parsed.data.formulaVersionId,
    );
    if (!formula)
      return Response.json(
        { error: "Formula version not found." },
        { status: 404 },
      );
    const calculation = calculateBatch({
      basis: formula.formulaBasis,
      bottleCount: parsed.data.bottleCount,
      bottleSize: parsed.data.bottleSize,
      bottleSizeUnit: parsed.data.bottleSizeUnit,
      overagePercent: parsed.data.overagePercent,
      outputPrecision: parsed.data.outputPrecision,
      ingredients: formula.ingredients.map((line) => ({
        id: line.id,
        name: line.ingredientName,
        percentage: line.percentage,
        densityGramsPerMl: line.densityGramsPerMl,
      })),
    });
    const result = await createDrizzleProductionRepository(
      connection.db,
    ).saveBatchPlan(parsed.data, calculation);
    return Response.json({ result }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Batch Plan save failed.",
      },
      { status: 422 },
    );
  } finally {
    await connection.close();
  }
}
