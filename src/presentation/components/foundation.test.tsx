import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CommandHero } from "../command/command-hero";

describe("foundation experience", () => {
  it("names the command core and uses the supplied project icon", () => {
    render(<CommandHero />);
    expect(
      screen.getByRole("img", { name: "Legacy House emblem" }),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("provides a concise accessible identity and core summary", () => {
    render(<CommandHero />);
    expect(
      screen.getByLabelText("Legacy House product intelligence command core"),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Legacy House" })).toBeVisible();
    expect(
      screen.getByText("Groomed Gent Co. Product Intelligence OS"),
    ).toBeVisible();
  });
});
