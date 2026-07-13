import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { SourcingPackagingNetwork } from "./sourcing-packaging-network";

describe("SourcingPackagingNetwork", () => {
  it("shows real configuration context and honest commercial gaps", () => {
    render(
      <SourcingPackagingNetwork
        development={canonicalDevelopmentSnapshot}
        commercial={canonicalCommercialSnapshot}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Sourcing & Packaging Network" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No suppliers linked")).toBeInTheDocument();
    expect(screen.getByText("No manufacturer selected")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Legacy Reserve Hair & Beard Oil — 2 oz",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Compare Options" }),
    ).toHaveAttribute("href", "/modules/suppliers");
  });
});
