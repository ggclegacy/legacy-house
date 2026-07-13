import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { ProductPipelineView } from "./product-pipeline-view";

describe("ProductPipelineView", () => {
  it("filters detailed statuses through the seven Command stages", () => {
    render(
      <ProductPipelineView
        products={canonicalDevelopmentSnapshot.products}
        formulas={canonicalDevelopmentSnapshot.formulas}
        persistence="unavailable"
      />,
    );

    fireEvent.change(screen.getByLabelText("Filter Command stage"), {
      target: { value: "research" },
    });

    expect(screen.getAllByText("VITALIS — NMN 500 mg").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.queryByText("Legacy Reserve Hair & Beard Oil"),
    ).not.toBeInTheDocument();
  });

  it("requires an explicit archive confirmation when persistence is available", () => {
    render(
      <ProductPipelineView
        products={canonicalDevelopmentSnapshot.products.slice(0, 1)}
        formulas={canonicalDevelopmentSnapshot.formulas}
        persistence="database"
      />,
    );

    fireEvent.click(
      screen.getAllByRole("button", { name: "Archive product" })[0]!,
    );
    expect(
      screen.getByRole("group", {
        name: /Archive Legacy Reserve Hair & Beard Oil/,
      }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(
      screen.queryByRole("button", { name: "Confirm archive" }),
    ).toBeNull();
  });
});
