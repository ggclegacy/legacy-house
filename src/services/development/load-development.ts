import {
  canonicalDevelopmentSnapshot,
  type DevelopmentSnapshot,
} from "@/src/domain/development/snapshot";
import { createDatabase } from "@/src/infrastructure/database/client";
import { createDrizzleDevelopmentRepository } from "@/src/infrastructure/repositories/drizzle-development-repository";

export async function loadDevelopmentSnapshot(): Promise<DevelopmentSnapshot> {
  const url = process.env.DATABASE_URL;
  if (!url) return canonicalDevelopmentSnapshot;
  const connection = createDatabase(url);
  try {
    return await createDrizzleDevelopmentRepository(
      connection.db,
    ).getSnapshot();
  } catch {
    return canonicalDevelopmentSnapshot;
  } finally {
    await connection.close();
  }
}
