// @vitest-environment node
import { describe, expect, it } from "vitest";

import { POST } from "./route";

describe("POST /api/production/batch-plans", () => {
  it("fails honestly without PostgreSQL and never claims inventory changes", async () => {
    const response = await POST(
      new Request("http://localhost/api/production/batch-plans", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formulaVersionId: "938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8",
          bottleCount: 20,
          bottleSize: "2",
          bottleSizeUnit: "us_fluid_ounces",
          overagePercent: "5",
          outputPrecision: 12,
          notes: null,
        }),
      }),
    );
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("no inventory was changed"),
    });
  });
});
