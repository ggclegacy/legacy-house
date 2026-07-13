import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { readDatabaseEnvironment } from "@/src/config/env";

import * as schema from "./schema";

export function getDatabaseUrl(): string {
  return readDatabaseEnvironment().DATABASE_URL;
}

export function createDatabase(url: string) {
  const client = postgres(url, { max: 5, prepare: false });
  return {
    db: drizzle(client, { schema }),
    close: () => client.end(),
  };
}

export type Database = ReturnType<typeof createDatabase>["db"];
