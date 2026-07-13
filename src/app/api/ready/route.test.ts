// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const databaseMocks = vi.hoisted(() => ({
  getDatabaseUrl: vi.fn(),
  execute: vi.fn(),
  close: vi.fn(),
}));

vi.mock("@/src/infrastructure/database/client", () => ({
  getDatabaseUrl: databaseMocks.getDatabaseUrl,
  createDatabase: () => ({
    db: { execute: databaseMocks.execute },
    close: databaseMocks.close,
  }),
}));

import { GET } from "./route";

describe("database readiness", () => {
  beforeEach(() => vi.clearAllMocks());

  it("reports not ready when database configuration is unavailable", async () => {
    databaseMocks.getDatabaseUrl.mockImplementation(() => {
      throw new Error("DATABASE_URL missing");
    });
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      status: "not_ready",
      dependencies: { database: "unavailable" },
    });
  });

  it("verifies a configured database connection", async () => {
    databaseMocks.getDatabaseUrl.mockReturnValue("postgresql://configured");
    databaseMocks.execute.mockResolvedValue([]);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "ready",
      dependencies: { database: "available" },
    });
    expect(databaseMocks.execute).toHaveBeenCalledOnce();
    expect(databaseMocks.close).toHaveBeenCalledOnce();
  });
});
