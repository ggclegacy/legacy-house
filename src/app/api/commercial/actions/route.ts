import { commercialActionSchema } from "@/src/domain/commercial/actions";
import {
  createDatabase,
  getRuntimeDatabaseUrl,
} from "@/src/infrastructure/database/client";
import { createDrizzleCommercialRepository } from "@/src/infrastructure/repositories/drizzle-commercial-repository";
import { runtimeMutationDeniedResponse } from "@/src/config/runtime-policy";

export async function POST(request: Request) {
  const denied = runtimeMutationDeniedResponse();
  if (denied) return denied;
  const parsed = commercialActionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return Response.json(
      {
        error: "Commercial record validation failed.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  const url = getRuntimeDatabaseUrl();
  if (!url)
    return Response.json(
      {
        error:
          "PostgreSQL is not configured. No commercial record was changed.",
      },
      { status: 503 },
    );
  const connection = createDatabase(url);
  try {
    return Response.json({
      result: await createDrizzleCommercialRepository(connection.db).execute(
        parsed.data,
      ),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed.";
    return Response.json(
      { error: message },
      { status: /duplicate|unique/i.test(message) ? 409 : 422 },
    );
  } finally {
    await connection.close();
  }
}
