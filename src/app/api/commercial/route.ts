import {
  createDatabase,
  getRuntimeDatabaseUrl,
} from "@/src/infrastructure/database/client";
import { createDrizzleCommercialRepository } from "@/src/infrastructure/repositories/drizzle-commercial-repository";

export async function GET() {
  const url = getRuntimeDatabaseUrl();
  if (!url)
    return Response.json(
      { error: "PostgreSQL is not configured." },
      { status: 503 },
    );
  const connection = createDatabase(url);
  try {
    return Response.json(
      await createDrizzleCommercialRepository(connection.db).getSnapshot(),
    );
  } finally {
    await connection.close();
  }
}
