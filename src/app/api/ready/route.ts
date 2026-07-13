import { sql } from "drizzle-orm";

import {
  createDatabase,
  getDatabaseUrl,
} from "@/src/infrastructure/database/client";

export const dynamic = "force-dynamic";

export async function GET() {
  let connection: ReturnType<typeof createDatabase> | undefined;
  try {
    connection = createDatabase(getDatabaseUrl());
    await connection.db.execute(sql`select 1`);
    return Response.json({
      status: "ready",
      dependencies: { database: "available" },
    });
  } catch {
    return Response.json(
      { status: "not_ready", dependencies: { database: "unavailable" } },
      { status: 503 },
    );
  } finally {
    await connection?.close();
  }
}
