import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommandHero } from "../command/command-hero";

describe("foundation experience", () => {
  it("names the official core and every operating pillar", () => {
    render(<CommandHero />);
    expect(
      screen.getByRole("img", { name: "Legacy House emblem" }),
    ).toBeInTheDocument();
    for (const pillar of ["Create", "Build", "Control", "Scale"]) {
      expect(
        screen.getByRole("link", { name: new RegExp(pillar) }),
      ).toBeInTheDocument();
    }
  });

  it("provides an accessible text summary and registered pillar routes", () => {
    render(<CommandHero />);
    expect(
      screen.getByLabelText(
        "Legacy House intelligence core connects Create, Build, Control, and Scale",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create/ })).toHaveAttribute(
      "href",
      "/modules/product-pipeline",
    );
    expect(screen.getByRole("link", { name: /Build/ })).toHaveAttribute(
      "href",
      "/modules/suppliers",
    );
    expect(screen.getByRole("link", { name: /Control/ })).toHaveAttribute(
      "href",
      "/modules/inventory",
    );
    expect(screen.getByRole("link", { name: /Scale/ })).toHaveAttribute(
      "href",
      "/modules/launches",
    );
  });
});
