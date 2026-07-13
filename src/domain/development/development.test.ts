import { describe, expect, it } from "vitest";

import {
  createIngredientSchema,
  createProductSchema,
  productBriefSchema,
  labelFor,
} from "./development";
import { developmentActionSchema } from "./actions";

describe("development validation", () => {
  it("validates product creation and rejects unstable slugs", () => {
    const valid = {
      productLineId: "4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79",
      name: "Controlled Product",
      slug: "controlled-product",
      productType: "other",
      developmentPath: "undecided",
      pipelineStatus: "idea",
      priority: "standard",
    };
    expect(createProductSchema.safeParse(valid).success).toBe(true);
    expect(
      createProductSchema.safeParse({ ...valid, slug: "Controlled Product" })
        .success,
    ).toBe(false);
  });

  it("accepts intentionally incomplete product briefs", () => {
    expect(
      productBriefSchema.safeParse({
        targetCustomer: null,
        problemToSolve: null,
        targetRetailPrice: null,
      }).success,
    ).toBe(true);
  });

  it("rejects invented or malformed density values at the boundary", () => {
    expect(
      createIngredientSchema.safeParse({
        commonName: "Master Ingredient",
        category: "other",
        functions: [],
        densityGramsPerMl: "unknown",
      }).success,
    ).toBe(false);
  });

  it("labels known enums and safe unknown values", () => {
    expect(labelFor("production_ready")).toBe("Production Ready");
    expect(labelFor("future_state")).toBe("Future State");
  });

  it("validates development action envelopes", () => {
    expect(
      developmentActionSchema.safeParse({
        action: "add_product_note",
        productId: "4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79",
        noteType: "general",
        title: "Recorded note",
        content: "Evidence-backed content",
      }).success,
    ).toBe(true);
    expect(
      developmentActionSchema.safeParse({ action: "unknown" }).success,
    ).toBe(false);
    expect(
      developmentActionSchema.safeParse({
        action: "update_product_note",
        noteId: "4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79",
        noteType: "market_feedback",
        title: "Edited note",
        content: "Preserved and revised product memory.",
        expectedUpdatedAt: "2026-07-13T12:00:00.000Z",
      }).success,
    ).toBe(true);
    const observation = {
      action: "add_observation",
      experimentId: "4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79",
      observationType: "immediate",
      observedAt: "2026-07-13T12:00:00.000Z",
      colorScore: 5,
    };
    expect(developmentActionSchema.safeParse(observation).success).toBe(true);
    expect(
      developmentActionSchema.safeParse({ ...observation, colorScore: 6 })
        .success,
    ).toBe(false);
  });
});
