import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { readDatabaseEnvironment, runtimeDataPolicy } from "@/src/config/env";

import * as schema from "./schema";
import * as commercialSchema from "./commercial-schema";
import * as productionSchema from "./production-schema";

const databaseSchema = { ...schema, ...commercialSchema, ...productionSchema };

export function getDatabaseUrl(): string {
  return readDatabaseEnvironment().DATABASE_URL;
}

export function getRuntimeDatabaseUrl(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): string | undefined {
  if (!runtimeDataPolicy(environment).dataAccessAllowed) return undefined;
  return environment.DATABASE_URL
    ? readDatabaseEnvironment(environment).DATABASE_URL
    : undefined;
}

export function createDatabase(url: string) {
  const client = postgres(url, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 5,
  });
  return {
    db: drizzle(client, { schema: databaseSchema }),
    close: () => client.end(),
  };
}

export type Database = ReturnType<typeof createDatabase>["db"];
