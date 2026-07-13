import { runtimeDataPolicy } from "./env";

export function runtimeMutationDeniedResponse(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): Response | null {
  const policy = runtimeDataPolicy(environment);
  if (policy.mutationsAllowed) return null;
  return Response.json(
    {
      error:
        policy.target === "preview"
          ? "Preview database writes are disabled. No record was changed."
          : "Private application access is not enabled. No record was changed.",
    },
    { status: 403 },
  );
}
