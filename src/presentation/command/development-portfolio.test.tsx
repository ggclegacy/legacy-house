import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { buildDevelopmentPortfolioModel } from "@/src/services/command/development-portfolio";

import { DevelopmentPortfolio } from "./development-portfolio";

const canonicalModel = buildDevelopmentPortfolioModel(
  canonicalDevelopmentSnapshot,
  canonicalCommercialSnapshot,
);

describe("DevelopmentPortfolio", () => {
  it("renders the bounded real portfolio and selected product focus", () => {
    render(<DevelopmentPortfolio model={canonicalModel} />);

    expect(
      screen.getByRole("heading", { name: "Development Portfolio" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View full portfolio" }),
    ).toHaveAttribute("href", "/modules/product-pipeline");
    expect(
      screen.getByRole("group", { name: "Filter portfolio by product line" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /All Products.*10/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: /Launch Ready, 1 product/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Focus / })).toHaveLength(6);
    expect(
      screen.getAllByText("Formula 1.0 · Production Ready").length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Open product" })).toHaveAttribute(
      "href",
      "/products/legacy-reserve-hair-beard-oil",
    );
  }, 15_000);

  it("filters by product line and stage without a page reload", () => {
    render(<DevelopmentPortfolio model={canonicalModel} />);

    fireEvent.click(screen.getByRole("button", { name: /Legacy Sanctum.*9/ }));
    expect(screen.getByText("Showing 6 of 9")).toBeInTheDocument();
    expect(
      screen.getAllByText("White-label research · No manufacturer selected")
        .length,
    ).toBeGreaterThan(0);
    fireEvent.click(
      screen.getByRole("button", { name: /Launch Ready, 0 products/ }),
    );
    expect(
      screen.getByRole("heading", {
        name: "No products are currently in this stage.",
      }),
    ).toBeInTheDocument();
  }, 15_000);

  it("shows the controlled start action for an empty portfolio", () => {
    render(<DevelopmentPortfolio model={{ products: [], productLines: [] }} />);

    expect(
      screen.getByRole("heading", {
        name: "No products have entered the portfolio yet.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start new product" }),
    ).toBeInTheDocument();
  }, 15_000);
});
