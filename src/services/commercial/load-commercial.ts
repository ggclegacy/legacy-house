import {
  canonicalCommercialSnapshot,
  type CommercialSnapshot,
} from "@/src/domain/commercial/snapshot";
import {
  createDatabase,
  getRuntimeDatabaseUrl,
} from "@/src/infrastructure/database/client";
import { createDrizzleCommercialRepository } from "@/src/infrastructure/repositories/drizzle-commercial-repository";

export async function loadCommercialSnapshot(): Promise<CommercialSnapshot> {
  const url = getRuntimeDatabaseUrl();
  if (!url) return canonicalCommercialSnapshot;
  const connection = createDatabase(url);
  try {
    return await createDrizzleCommercialRepository(connection.db).getSnapshot();
  } catch {
    return canonicalCommercialSnapshot;
  } finally {
    await connection.close();
  }
}
