import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { LaunchReadiness } from "./launch-readiness";

describe("LaunchReadiness", () => {
  it("derives the canonical readiness path without inventing completion", () => {
    render(
      <LaunchReadiness
        development={canonicalDevelopmentSnapshot}
        commercial={canonicalCommercialSnapshot}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Launch Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 completed · 5 incomplete")).toBeInTheDocument();
    expect(screen.getByText("Formula 1.0 recorded")).toBeInTheDocument();
    expect(screen.getByText("Cost snapshot missing")).toBeInTheDocument();
    expect(
      screen.getByText("Launch preparation not recorded"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View Launch Products" }),
    ).toHaveAttribute("href", "/modules/product-pipeline");
  });
});
