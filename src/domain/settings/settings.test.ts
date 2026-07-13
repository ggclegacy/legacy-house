import { describe, expect, it } from "vitest";

import { defaultWorkspaceSettings, workspaceSettingsSchema } from "./settings";

describe("workspace settings", () => {
  it("uses the authorized defaults", () => {
    expect(defaultWorkspaceSettings).toMatchObject({
      currency: "USD",
      unitSystem: "us_customary_with_metric",
      precision: 2,
    });
  });

  it("rejects unsupported precision and settings values", () => {
    expect(() =>
      workspaceSettingsSchema.parse({
        ...defaultWorkspaceSettings,
        precision: 7,
      }),
    ).toThrow();
    expect(() =>
      workspaceSettingsSchema.parse({
        ...defaultWorkspaceSettings,
        currency: "BTC",
      }),
    ).toThrow();
  });
});
