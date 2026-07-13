import { z } from "zod";

const postgresUrl = z
  .string()
  .url()
  .refine(
    (value) =>
      value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "DATABASE_URL must use the postgres:// or postgresql:// scheme.",
  );

const databaseEnvironment = z.object({ DATABASE_URL: postgresUrl });

const deploymentEnvironment = z.object({
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED: z.enum(["true", "false"]).optional(),
  PREVIEW_DATABASE_WRITES_ENABLED: z.enum(["true", "false"]).optional(),
  PRIVATE_BETA_GATE_ENABLED: z.enum(["true", "false"]).optional(),
  OBJECT_STORAGE_PROVIDER: z
    .enum(["unavailable", "vercel_blob", "s3_compatible"])
    .optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
});

export type DatabaseEnvironment = z.infer<typeof databaseEnvironment>;
export type DeploymentEnvironment = z.infer<typeof deploymentEnvironment>;

export function readDatabaseEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): DatabaseEnvironment {
  return databaseEnvironment.parse(environment);
}

export function readDeploymentEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): DeploymentEnvironment {
  return deploymentEnvironment.parse(environment);
}

export function runtimeDataPolicy(
  environment: Readonly<Record<string, string | undefined>> = process.env,
) {
  const parsed = readDeploymentEnvironment(environment);
  const target = parsed.VERCEL_ENV ?? "local";
  const protectionConfirmed =
    parsed.VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED === "true";
  const privateBetaEnabled = parsed.PRIVATE_BETA_GATE_ENABLED === "true";
  const dataAccessAllowed =
    target === "local" ||
    target === "development" ||
    (target === "preview" && protectionConfirmed) ||
    (target === "production" && privateBetaEnabled);
  const mutationsAllowed =
    dataAccessAllowed &&
    (target !== "preview" || parsed.PREVIEW_DATABASE_WRITES_ENABLED === "true");
  return {
    target,
    dataAccessAllowed,
    mutationsAllowed,
    objectStorageProvider: parsed.OBJECT_STORAGE_PROVIDER ?? "unavailable",
  } as const;
}
