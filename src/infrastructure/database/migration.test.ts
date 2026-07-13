// @vitest-environment node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { afterEach, describe, expect, it } from "vitest";

let database: PGlite | undefined;

afterEach(async () => {
  await database?.close();
  database = undefined;
});

describe("foundation migration", () => {
  it("applies cleanly to an empty PostgreSQL database", async () => {
    database = new PGlite();
    const migrationDirectory = path.join(process.cwd(), "drizzle");
    const migrations = (await readdir(migrationDirectory))
      .filter((file) => file.endsWith(".sql"))
      .sort();
    for (const file of migrations) {
      const migration = await readFile(
        path.join(migrationDirectory, file),
        "utf8",
      );
      await database.exec(migration.replaceAll("--> statement-breakpoint", ""));
    }

    const result = await database.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
    );
    expect(result.rows.map((row) => row.table_name)).toEqual([
      "activity_events",
      "app_settings",
      "app_user_roles",
      "app_users",
      "audit_events",
      "experiment_observations",
      "experiments",
      "formula_families",
      "formula_ingredients",
      "formula_production_steps",
      "formula_versions",
      "ingredients",
      "product_briefs",
      "product_decisions",
      "product_lines",
      "product_notes",
      "products",
      "units",
    ]);
  }, 20_000);
});
