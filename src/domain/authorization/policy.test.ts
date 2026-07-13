import { describe, expect, it } from "vitest";

import { isAuthorized } from "./policy";

describe("authorization policy", () => {
  it("denies an unauthenticated or unassigned actor by default", () => {
    expect(isAuthorized([], "foundation:read")).toBe(false);
    expect(isAuthorized([], "foundation:admin")).toBe(false);
  });

  it("limits administration to the founder role", () => {
    expect(isAuthorized(["founder"], "foundation:admin")).toBe(true);
    expect(isAuthorized(["operations_operator"], "foundation:admin")).toBe(
      false,
    );
  });

  it("allows quality and founder roles to inspect the audit stream", () => {
    expect(isAuthorized(["quality_operator"], "audit:read")).toBe(true);
    expect(isAuthorized(["founder"], "audit:read")).toBe(true);
    expect(isAuthorized(["analyst"], "audit:read")).toBe(false);
  });
});
