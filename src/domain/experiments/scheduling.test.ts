import { describe, expect, it } from "vitest";

import { canCompleteExperiment, observationDueAt } from "./scheduling";

describe("experiment scheduling", () => {
  it("schedules standard observations from production date", () => {
    expect(
      observationDueAt(
        new Date("2026-07-13T00:00:00Z"),
        "14_days",
      ).toISOString(),
    ).toBe("2026-07-27T00:00:00.000Z");
  });

  it("requires observation, conclusion, and evaluated result to complete", () => {
    expect(
      canCompleteExperiment({
        conclusion: "Recorded conclusion",
        result: "passed",
        observationCount: 1,
      }),
    ).toBe(true);
    expect(
      canCompleteExperiment({
        conclusion: null,
        result: "not_evaluated",
        observationCount: 0,
      }),
    ).toBe(false);
  });

  it("requires and preserves a custom observation date", () => {
    expect(() =>
      observationDueAt(new Date("2026-07-13T00:00:00Z"), "custom"),
    ).toThrow("requires a date");
    expect(
      observationDueAt(
        new Date("2026-07-13T00:00:00Z"),
        "custom",
        new Date("2026-08-01T12:00:00Z"),
      ).toISOString(),
    ).toBe("2026-08-01T12:00:00.000Z");
  });
});
