import { describe, expect, it } from "vitest";

import { assertDatabaseCommandTarget } from "./database-command-policy";

describe("database release command policy", () => {
  it("defaults only local commands to development", () => {
    expect(assertDatabaseCommandTarget("migrate", {})).toBe("development");
    expect(() =>
      assertDatabaseCommandTarget("migrate", { VERCEL: "1" }),
    ).toThrow(/disabled during Vercel builds/);
  });

  it("requires explicit confirmations for production and preview seeds", () => {
    expect(() =>
      assertDatabaseCommandTarget("migrate", {
        DATABASE_TARGET: "production",
      }),
    ).toThrow(/Production migrate requires/);
    expect(
      assertDatabaseCommandTarget("migrate", {
        DATABASE_TARGET: "production",
        CONFIRM_PRODUCTION_DATABASE_COMMAND: "legacy-house-production",
      }),
    ).toBe("production");
    expect(() =>
      assertDatabaseCommandTarget("seed", { DATABASE_TARGET: "preview" }),
    ).toThrow(/Preview seed requires/);
  });
});
