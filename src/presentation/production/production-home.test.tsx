import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { ProductionHome } from "./production-home";

describe("ProductionHome", () => {
  it("shows the real active Reserve formula and working actions", () => {
    render(<ProductionHome development={canonicalDevelopmentSnapshot} />);

    expect(
      screen.getByRole("heading", { name: "Legacy Reserve Hair & Beard Oil" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Formula 1.0 · Legacy Reserve"),
    ).toBeInTheDocument();
    expect(screen.getByText("Production Ready")).toBeInTheDocument();
    expect(screen.getByText("Volume Percentage")).toBeInTheDocument();
    expect(screen.getByText("2 US Fluid Ounces")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Build Batch" })).toHaveAttribute(
      "href",
      "/production/batch-builder?formula=938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8",
    );
  });

  it("shows an honest setup route when no formula is active", () => {
    render(
      <ProductionHome
        development={{ ...canonicalDevelopmentSnapshot, formulas: [] }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "No active production formula" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open Formula Vault" }),
    ).toHaveAttribute("href", "/modules/formula-vault");
  });
});
