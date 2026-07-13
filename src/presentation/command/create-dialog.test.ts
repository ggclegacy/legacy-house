import { describe, expect, it } from "vitest";

import { buildProductCreationPayload } from "./create-dialog";

function productForm(path: "custom_formula" | "white_label" | "undecided") {
  const form = new FormData();
  form.set("productLineId", "f92eb01a-cb4f-4219-a7c6-b7d20e56b8c7");
  form.set("name", "  Reserve Texture Cream  ");
  form.set("productType", "hair_beard_care");
  form.set("developmentPath", path);
  form.set("priority", "high");
  form.set("description", "Controlled hold with a natural finish.");
  form.set("targetCustomer", "Men seeking disciplined styling.");
  form.set("problemToSolve", "Uncontrolled texture without heavy buildup.");
  form.set("desiredBenefits", "Control, restyling, and a natural finish.");
  return form;
}

describe("product creation flow", () => {
  it.each(["custom_formula", "white_label"] as const)(
    "starts %s products in Product Brief with complete shared context",
    (path) => {
      const payload = buildProductCreationPayload(productForm(path));
      expect(payload.data).toMatchObject({
        slug: "reserve-texture-cream",
        developmentPath: path,
        pipelineStatus: "product_brief",
        priority: "high",
        targetCustomer: "Men seeking disciplined styling.",
      });
    },
  );

  it("keeps an undecided concept in Concept while preserving its brief context", () => {
    const payload = buildProductCreationPayload(productForm("undecided"));
    expect(payload.data.pipelineStatus).toBe("idea");
    expect(payload.data.problemToSolve).toBe(
      "Uncontrolled texture without heavy buildup.",
    );
  });
});
