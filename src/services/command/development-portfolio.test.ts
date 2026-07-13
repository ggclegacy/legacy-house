import { describe, expect, it } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { pipelineStatuses } from "@/src/domain/development/development";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import {
  buildDevelopmentPortfolioModel,
  portfolioStageByDetailedStatus,
  portfolioStageFor,
} from "./development-portfolio";

describe("development portfolio model", () => {
  it("defines an explicit Command-stage decision for every detailed status", () => {
    expect(Object.keys(portfolioStageByDetailedStatus).sort()).toEqual(
      [...pipelineStatuses].sort(),
    );
    expect(portfolioStageFor("idea")).toBe("concept");
    expect(portfolioStageFor("product_brief")).toBe("concept");
    expect(portfolioStageFor("research")).toBe("research");
    expect(portfolioStageFor("testing")).toBe("formula_source");
    expect(portfolioStageFor("supplier_sourcing")).toBe("sourcing");
    expect(portfolioStageFor("packaging")).toBe("packaging");
    expect(portfolioStageFor("costing")).toBe("costing");
    expect(portfolioStageFor("production_ready")).toBe("launch_ready");
    expect(portfolioStageFor("on_hold")).toBeNull();
    expect(portfolioStageFor("archived")).toBeNull();
    expect(portfolioStageFor("future_unknown_status")).toBeNull();
  });

  it("builds the canonical portfolio from real product and formula records", () => {
    const model = buildDevelopmentPortfolioModel(
      canonicalDevelopmentSnapshot,
      canonicalCommercialSnapshot,
    );

    expect(model.products).toHaveLength(10);
    expect(model.productLines.map((line) => line.name)).toEqual([
      "Legacy Reserve",
      "Legacy Sanctum",
    ]);
    expect(model.products[0]).toMatchObject({
      name: "Legacy Reserve Hair & Beard Oil",
      stageId: "launch_ready",
      supportingDetail: "Formula 1.0 · Production Ready",
      continueHref: "/formulas/938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8",
    });
    expect(
      model.products.filter((product) => product.stageId === "research"),
    ).toHaveLength(9);
    expect(model.products[1]?.supportingDetail).toBe(
      "White-label research · No manufacturer selected",
    );
  });

  it("prefers a real update timestamp over stable stage ordering", () => {
    const recentlyUpdated = {
      ...canonicalDevelopmentSnapshot.products[1]!,
      updatedAt: "2026-07-13T12:00:00.000Z",
    };
    const model = buildDevelopmentPortfolioModel(
      {
        ...canonicalDevelopmentSnapshot,
        products: [canonicalDevelopmentSnapshot.products[0]!, recentlyUpdated],
      },
      canonicalCommercialSnapshot,
    );

    expect(model.products[0]?.id).toBe(recentlyUpdated.id);
  });

  it("returns an honest empty model when there are no active products", () => {
    const model = buildDevelopmentPortfolioModel(
      {
        ...canonicalDevelopmentSnapshot,
        products: canonicalDevelopmentSnapshot.products.map((product) => ({
          ...product,
          active: false,
        })),
      },
      canonicalCommercialSnapshot,
    );

    expect(model).toEqual({ products: [], productLines: [] });
  });
});
