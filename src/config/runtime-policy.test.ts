import { describe, expect, it } from "vitest";

import { runtimeMutationDeniedResponse } from "./runtime-policy";

describe("Vercel runtime mutation policy", () => {
  it("permits local development and denies preview writes by default", async () => {
    expect(runtimeMutationDeniedResponse({})).toBeNull();
    const response = runtimeMutationDeniedResponse({
      VERCEL_ENV: "preview",
      VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED: "true",
    });
    expect(response?.status).toBe(403);
    expect(await response?.json()).toEqual({
      error: "Preview database writes are disabled. No record was changed.",
    });
  });

  it("blocks production until the private beta gate is enabled", async () => {
    const response = runtimeMutationDeniedResponse({
      VERCEL_ENV: "production",
    });
    expect(response?.status).toBe(403);
    expect(await response?.json()).toEqual({
      error:
        "Private application access is not enabled. No record was changed.",
    });
  });
});
