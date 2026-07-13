import { describe, expect, it, vi } from "vitest";

import type { ProductLineRepository } from "@/src/domain/product-lines/product-line";
import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";

import { seedFoundationData } from "./seed-foundation";

describe("foundation seed service", () => {
  it("passes only the authorized definitions to the repository", async () => {
    const seed = vi.fn();
    const repository: ProductLineRepository = {
      seed,
      listActive: vi.fn(),
      create: vi.fn(),
    };
    await seedFoundationData(repository);
    expect(seed).toHaveBeenCalledWith(productLineSeedDefinitions);
    expect(seed).toHaveBeenCalledTimes(1);
  });
});
