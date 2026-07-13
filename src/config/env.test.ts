import { describe, expect, it } from "vitest";

import { readDatabaseEnvironment } from "./env";

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
});
