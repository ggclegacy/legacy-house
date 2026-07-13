import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductBuildNavigation } from "./product-build-navigation";

describe("ProductBuildNavigation", () => {
  it("preserves product context and exposes no broken future link", () => {
    render(
      <ProductBuildNavigation
        productSlug="legacy-reserve-hair-beard-oil"
        developmentPath="custom_formula"
      />,
    );

    expect(screen.getByRole("link", { name: "Formula" })).toHaveAttribute(
      "href",
      "#formulas",
    );
    expect(screen.getByRole("link", { name: "Packaging" })).toHaveAttribute(
      "href",
      "/modules/packaging?product=legacy-reserve-hair-beard-oil",
    );
    expect(screen.queryByRole("link", { name: /Launch Readiness/ })).toBeNull();
    expect(screen.getByText(/Launch Readiness/)).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("marks the selected local workspace area", () => {
    render(
      <ProductBuildNavigation
        productSlug="concept"
        developmentPath="undecided"
      />,
    );
    const brief = screen.getByRole("link", { name: "Product Brief" });
    fireEvent.click(brief);
    expect(brief).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute(
      "href",
      "#sourcing",
    );
  });
});
