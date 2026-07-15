import { defineConfig } from "drizzle-kit";

// `generate` and `check` inspect local schema/migration files and must work in
// credential-free CI. Runtime migrate/seed scripts validate the real URL.
const schemaInspectionUrl =
  process.env.DATABASE_URL ??
  "postgresql://schema:inspection@localhost:5432/legacy_house";

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./src/infrastructure/database/schema.ts",
    "./src/infrastructure/database/commercial-schema.ts",
    "./src/infrastructure/database/production-schema.ts",
  ],
  out: "./drizzle",
  dbCredentials: { url: schemaInspectionUrl },
  strict: true,
  verbose: true,
});
