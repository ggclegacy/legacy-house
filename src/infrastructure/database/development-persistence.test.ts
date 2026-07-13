// @vitest-environment node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

let database: PGlite;

beforeAll(async () => {
  database = new PGlite();
  const directory = path.join(process.cwd(), "drizzle");
  for (const file of (await readdir(directory))
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    const sql = await readFile(path.join(directory, file), "utf8");
    await database.exec(sql.replaceAll("--> statement-breakpoint", ""));
  }
});

beforeEach(async () => {
  await database.query("truncate table products, product_lines cascade");
  await database.query(
    `insert into product_lines (id, name, slug, description, accent_theme, sort_order)
     values ('4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79', 'Legacy Reserve', 'legacy-reserve', 'Test line identity', 'reserve', 10)`,
  );
});

afterAll(async () => database.close());

describe("development persistence migration", () => {
  it("persists product creation, status, priority, brief, and archival", async () => {
    const id = "05a658ca-5dbe-44b5-ae04-9113f7461f86";
    await database.query(
      `insert into products (id, product_line_id, name, slug, product_type, development_path, pipeline_status, priority)
       values ($1, '4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79', 'Persistence Test', 'persistence-test', 'other', 'undecided', 'idea', 'standard')`,
      [id],
    );
    await database.query(
      `update products set pipeline_status = 'research', priority = 'high' where id = $1`,
      [id],
    );
    await database.query(
      `insert into product_briefs (product_id, ingredients_to_explore, notes) values ($1, 'Unknown remains explicit', 'Draft evidence')`,
      [id],
    );
    await database.query(
      `update products set active = false, pipeline_status = 'archived', archived_at = now() where id = $1`,
      [id],
    );
    const result = await database.query<{
      pipeline_status: string;
      priority: string;
      active: boolean;
      ingredients_to_explore: string;
    }>(
      `select p.pipeline_status, p.priority, p.active, b.ingredients_to_explore
       from products p join product_briefs b on b.product_id = p.id where p.id = $1`,
      [id],
    );
    expect(result.rows[0]).toEqual({
      pipeline_status: "archived",
      priority: "high",
      active: false,
      ingredients_to_explore: "Unknown remains explicit",
    });
  });

  it("persists meaningful product decisions", async () => {
    const productId = "05a658ca-5dbe-44b5-ae04-9113f7461f86";
    await database.query(
      `insert into products (id, product_line_id, name, slug, development_path, pipeline_status, priority)
       values ($1, '4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79', 'Decision Test', 'decision-test', 'undecided', 'idea', 'standard')`,
      [productId],
    );
    await database.query(
      `insert into product_decisions (product_id, title, decision, reason, decision_date)
       values ($1, 'Recorded decision', 'Proceed with evidence review', 'Evidence must precede advancement', '2026-07-13')`,
      [productId],
    );
    const result = await database.query<{ reason: string }>(
      `select reason from product_decisions where product_id = $1`,
      [productId],
    );
    expect(result.rows[0]?.reason).toBe("Evidence must precede advancement");
  });
});
