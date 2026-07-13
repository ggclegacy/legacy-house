import {
  createDatabase,
  getDatabaseUrl,
} from "../src/infrastructure/database/client";
import { createDrizzleProductLineRepository } from "../src/infrastructure/repositories/drizzle-product-line-repository";
import { createDrizzleDevelopmentRepository } from "../src/infrastructure/repositories/drizzle-development-repository";
import { seedFoundationData } from "../src/services/foundation/seed-foundation";

async function main() {
  const connection = createDatabase(getDatabaseUrl());
  try {
    await seedFoundationData(createDrizzleProductLineRepository(connection.db));
    await createDrizzleDevelopmentRepository(connection.db).seedApprovedData();
    console.info(
      "Approved seed applied: product lines, canonical Legacy Reserve formula, and Legacy Sanctum planning records.",
    );
  } finally {
    await connection.close();
  }
}

main().catch((error: unknown) => {
  console.error(
    "Legacy House approved seed failed. Confirm DATABASE_URL is a reachable PostgreSQL connection string.",
  );
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
