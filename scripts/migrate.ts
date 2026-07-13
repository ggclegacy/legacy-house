import { migrate } from "drizzle-orm/postgres-js/migrator";

import { assertDatabaseCommandTarget } from "../src/config/database-command-policy";

import {
  createDatabase,
  getDatabaseUrl,
} from "../src/infrastructure/database/client";

async function main() {
  const target = assertDatabaseCommandTarget("migrate");
  console.info(
    `Applying reviewed migrations to the explicit ${target} database target.`,
  );
  const connection = createDatabase(getDatabaseUrl());
  try {
    await migrate(connection.db, { migrationsFolder: "drizzle" });
    console.info("Database migrations applied successfully.");
  } finally {
    await connection.close();
  }
}

main().catch((error: unknown) => {
  console.error(
    "Database migration failed. Confirm DATABASE_URL is a reachable PostgreSQL connection string.",
  );
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
