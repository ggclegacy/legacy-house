import { describe, expect, it } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { buildProductWorkspaceModel } from "./build-workspace";

describe("product build workspace model", () => {
  it("uses the most advanced active product without claiming false recency", () => {
    const model = buildProductWorkspaceModel(
      canonicalDevelopmentSnapshot,
      canonicalCommercialSnapshot,
    );

    expect(model.continuation?.basis).toBe("most_advanced");
    expect(model.continuation?.product.name).toBe(
      "Legacy Reserve Hair & Beard Oil",
    );
    expect(model.continuation?.formula?.version).toBe("1.0");
    expect(model.continuation?.configuration?.name).toBe(
      "Legacy Reserve Hair & Beard Oil — 2 oz",
    );
    expect(model.dockProducts).toHaveLength(5);
  });

  it("prefers a recorded active product update when one exists", () => {
    const updatedProduct = {
      ...canonicalDevelopmentSnapshot.products[1]!,
      updatedAt: "2026-07-13T12:00:00.000Z",
    };
    const model = buildProductWorkspaceModel(
      {
        ...canonicalDevelopmentSnapshot,
        products: [canonicalDevelopmentSnapshot.products[0]!, updatedProduct],
      },
      canonicalCommercialSnapshot,
    );

    expect(model.continuation?.basis).toBe("recently_updated");
    expect(model.continuation?.product.id).toBe(updatedProduct.id);
  });

  it("returns an honest empty state when no product is active", () => {
    const model = buildProductWorkspaceModel(
      {
        ...canonicalDevelopmentSnapshot,
        products: canonicalDevelopmentSnapshot.products.map((product) => ({
          ...product,
          active: false,
        })),
      },
      canonicalCommercialSnapshot,
    );

    expect(model.continuation).toBeNull();
    expect(model.dockProducts).toEqual([]);
  });
});
