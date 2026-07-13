import { z } from "zod";

const targetSchema = z.enum(["development", "preview", "production"]);

export function assertDatabaseCommandTarget(
  command: "migrate" | "seed",
  environment: Readonly<Record<string, string | undefined>> = process.env,
) {
  const target = environment.DATABASE_TARGET
    ? targetSchema.parse(environment.DATABASE_TARGET)
    : environment.VERCEL === "1"
      ? null
      : "development";
  if (!target)
    throw new Error(
      "Database commands are disabled during Vercel builds. Run them as an explicit release operation with DATABASE_TARGET.",
    );
  if (
    target === "production" &&
    environment.CONFIRM_PRODUCTION_DATABASE_COMMAND !==
      "legacy-house-production"
  )
    throw new Error(
      `Production ${command} requires CONFIRM_PRODUCTION_DATABASE_COMMAND=legacy-house-production.`,
    );
  if (
    command === "seed" &&
    target === "preview" &&
    environment.CONFIRM_PREVIEW_SEED !== "legacy-house-preview"
  )
    throw new Error(
      "Preview seed requires CONFIRM_PREVIEW_SEED=legacy-house-preview.",
    );
  return target;
}
