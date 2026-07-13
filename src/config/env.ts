import { z } from "zod";

const databaseEnvironment = z.object({
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
});

export type DatabaseEnvironment = z.infer<typeof databaseEnvironment>;

export function readDatabaseEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): DatabaseEnvironment {
  return databaseEnvironment.parse(environment);
}
