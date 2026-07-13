import { describe, expect, it } from "vitest";

import {
  readDatabaseEnvironment,
  readDeploymentEnvironment,
  runtimeDataPolicy,
} from "./env";

describe("database environment", () => {
  it("accepts an explicit PostgreSQL URL", () => {
    expect(
      readDatabaseEnvironment({
        DATABASE_URL: "postgresql://user:secret@localhost:5432/legacy",
      }),
    ).toEqual({
      DATABASE_URL: "postgresql://user:secret@localhost:5432/legacy",
    });
  });

  it("rejects missing and non-PostgreSQL configuration", () => {
    expect(() => readDatabaseEnvironment({})).toThrow();
    expect(() =>
      readDatabaseEnvironment({ DATABASE_URL: "https://example.com" }),
    ).toThrow();
  });

  it("accepts the postgres scheme used by managed poolers", () => {
    expect(
      readDatabaseEnvironment({ DATABASE_URL: "postgres://user:pass@host/db" }),
    ).toEqual({ DATABASE_URL: "postgres://user:pass@host/db" });
  });

  it("keeps preview writes and production data closed by default", () => {
    expect(runtimeDataPolicy({ VERCEL_ENV: "preview" })).toMatchObject({
      dataAccessAllowed: false,
      mutationsAllowed: false,
    });
    expect(
      runtimeDataPolicy({
        VERCEL_ENV: "preview",
        VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED: "true",
      }),
    ).toMatchObject({ dataAccessAllowed: true, mutationsAllowed: false });
    expect(runtimeDataPolicy({ VERCEL_ENV: "production" })).toMatchObject({
      dataAccessAllowed: false,
      mutationsAllowed: false,
    });
  });

  it("allows explicit protected-preview writes and validates storage mode", () => {
    expect(
      runtimeDataPolicy({
        VERCEL_ENV: "preview",
        VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED: "true",
        PREVIEW_DATABASE_WRITES_ENABLED: "true",
        OBJECT_STORAGE_PROVIDER: "vercel_blob",
      }),
    ).toEqual({
      target: "preview",
      dataAccessAllowed: true,
      mutationsAllowed: true,
      objectStorageProvider: "vercel_blob",
    });
    expect(() =>
      readDeploymentEnvironment({ OBJECT_STORAGE_PROVIDER: "local_disk" }),
    ).toThrow();
  });
});
