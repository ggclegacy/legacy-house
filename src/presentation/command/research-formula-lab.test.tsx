import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { ResearchFormulaLab } from "./research-formula-lab";

describe("ResearchFormulaLab", () => {
  it("routes real formula and research actions without inventing experiments", () => {
    render(<ResearchFormulaLab development={canonicalDevelopmentSnapshot} />);

    expect(
      screen.getByRole("heading", { name: "Research & Formula Lab" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Legacy Reserve Hair & Beard Oil",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "No experiment recorded" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Open Formula Vault" }),
    ).toHaveAttribute("href", "/modules/formula-vault");
    expect(
      screen.getByRole("link", { name: "Calculate Legacy Reserve Batch" }),
    ).toHaveAttribute(
      "href",
      "/formulas/938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8#batch-calculator",
    );
  });
});
