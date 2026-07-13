import {
  createDatabase,
  getDatabaseUrl,
} from "../src/infrastructure/database/client";
import { createDrizzleProductLineRepository } from "../src/infrastructure/repositories/drizzle-product-line-repository";
import { createDrizzleDevelopmentRepository } from "../src/infrastructure/repositories/drizzle-development-repository";
import { createDrizzleCommercialRepository } from "../src/infrastructure/repositories/drizzle-commercial-repository";
import { seedFoundationData } from "../src/services/foundation/seed-foundation";
import { assertDatabaseCommandTarget } from "../src/config/database-command-policy";

async function main() {
  const target = assertDatabaseCommandTarget("seed");
  console.info(
    `Applying approved idempotent seed definitions to the explicit ${target} database target.`,
  );
  const connection = createDatabase(getDatabaseUrl());
  try {
    await seedFoundationData(createDrizzleProductLineRepository(connection.db));
    await createDrizzleDevelopmentRepository(connection.db).seedApprovedData();
    await createDrizzleCommercialRepository(connection.db).seedApprovedData();
    console.info(
      "Approved seed applied: product lines, canonical development records, and the Legacy Reserve 2 oz commercial configuration.",
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
