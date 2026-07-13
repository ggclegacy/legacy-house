import {
  defaultWorkspaceSettings,
  workspaceSettingsSchema,
} from "@/src/domain/settings/settings";
import {
  createDatabase,
  getRuntimeDatabaseUrl,
} from "@/src/infrastructure/database/client";
import { runtimeMutationDeniedResponse } from "@/src/config/runtime-policy";
import { createDrizzleSettingsRepository } from "@/src/infrastructure/repositories/drizzle-settings-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = getRuntimeDatabaseUrl();
  if (!url) {
    return Response.json({
      settings: defaultWorkspaceSettings,
      persistence: "unavailable",
    });
  }

  const connection = createDatabase(url);
  try {
    const settings = await createDrizzleSettingsRepository(connection.db).get();
    return Response.json({ settings, persistence: "database" });
  } catch {
    return Response.json(
      { settings: defaultWorkspaceSettings, persistence: "unavailable" },
      { status: 503 },
    );
  } finally {
    await connection.close();
  }
}

export async function PATCH(request: Request) {
  const denied = runtimeMutationDeniedResponse();
  if (denied) return denied;
  const parsed = workspaceSettingsSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return Response.json(
      {
        error: "Settings validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const url = getRuntimeDatabaseUrl();
  if (!url) {
    return Response.json(
      { error: "PostgreSQL is not configured. Settings were not persisted." },
      { status: 503 },
    );
  }

  const connection = createDatabase(url);
  try {
    const settings = await createDrizzleSettingsRepository(connection.db).save(
      parsed.data,
    );
    return Response.json({ settings, persistence: "database" });
  } catch {
    return Response.json(
      { error: "Settings could not be saved." },
      { status: 503 },
    );
  } finally {
    await connection.close();
  }
}
