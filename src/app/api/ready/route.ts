import { sql } from "drizzle-orm";

import {
  createDatabase,
  getRuntimeDatabaseUrl,
} from "@/src/infrastructure/database/client";

export const dynamic = "force-dynamic";

export async function GET() {
  let connection: ReturnType<typeof createDatabase> | undefined;
  try {
    const url = getRuntimeDatabaseUrl();
    if (!url) throw new Error("Database access unavailable.");
    connection = createDatabase(url);
    await connection.db.execute(sql`select 1`);
    return Response.json(
      { status: "ready", dependencies: { database: "available" } },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "not_ready", dependencies: { database: "unavailable" } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  } finally {
    await connection?.close();
  }
}
