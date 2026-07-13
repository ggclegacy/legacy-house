import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommandCore } from "./command-core";

describe("foundation experience", () => {
  it("names the official core and every operating pillar", () => {
    render(<CommandCore />);
    expect(
      screen.getByRole("img", { name: "Legacy House emblem" }),
    ).toBeInTheDocument();
    for (const pillar of ["Create", "Build", "Control", "Scale"]) {
      expect(screen.getByText(pillar)).toBeInTheDocument();
    }
  });

  it("provides an accessible text summary for the visual system", () => {
    render(<CommandCore />);
    expect(
      screen.getByLabelText(
        "Legacy House connects Create, Build, Control, and Scale",
      ),
    ).toBeInTheDocument();
  });
});
