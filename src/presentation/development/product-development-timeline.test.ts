import { describe, expect, it } from "vitest";

import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { buildDevelopmentTimeline } from "./product-development-timeline";

describe("buildDevelopmentTimeline", () => {
  it("groups exact low-value repeats and resolves real related routes", () => {
    const formula = canonicalDevelopmentSnapshot.formulas[0]!;
    const base = {
      entityType: "formula",
      entityId: formula.versionId,
      action: "composition_updated",
      title: "Formula composition updated",
      description: "Recorded composition save.",
      createdAt: "2026-07-13T12:00:00.000Z",
    };
    const timeline = buildDevelopmentTimeline({
      events: [
        { ...base, id: "event-1" },
        { ...base, id: "event-2", createdAt: "2026-07-13T13:00:00.000Z" },
      ],
      productName: "Legacy Reserve Hair & Beard Oil",
      productSlug: "legacy-reserve-hair-beard-oil",
      formulas: [formula],
      experiments: [],
    });

    expect(timeline).toHaveLength(1);
    expect(timeline[0]).toMatchObject({
      count: 2,
      relatedRecord: `${formula.familyName} · Version ${formula.version}`,
      href: `/formulas/${formula.versionId}`,
    });
  });

  it("does not invent a direct route for unknown real event types", () => {
    const timeline = buildDevelopmentTimeline({
      events: [
        {
          id: "event-3",
          entityType: "commercial_evidence",
          entityId: "evidence-1",
          action: "recorded",
          title: "Commercial evidence recorded",
          description: null,
          createdAt: "2026-07-13T12:00:00.000Z",
        },
      ],
      productName: "Product",
      productSlug: "product",
      formulas: [],
      experiments: [],
    });
    expect(timeline[0]?.href).toBeUndefined();
    expect(timeline[0]?.explanation).toBe("Recorded");
  });
});
