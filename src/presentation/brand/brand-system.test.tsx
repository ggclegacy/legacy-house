import { readFile } from "node:fs/promises";
import path from "node:path";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LegacyHouseMark } from "./legacy-house-mark";

describe("brand foundation", () => {
  it("centralizes every official core token", async () => {
    const css = await readFile(
      path.join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    for (const color of [
      "#050506",
      "#0d0d11",
      "#c4912f",
      "#e2be72",
      "#241038",
      "#2a0f4a",
      "#5a2a82",
      "#f1eee7",
      "#97949f",
      "#7a2e32",
      "#b67a2b",
      "#66806a",
    ]) {
      expect(css.toLocaleLowerCase()).toContain(color);
    }
  });

  it("renders the reusable official mark with meaningful or decorative alternatives", () => {
    const { rerender } = render(<LegacyHouseMark size={96} />);
    expect(
      screen.getByRole("img", { name: "Legacy House emblem" }),
    ).toHaveAttribute("src", "/emblem");
    rerender(<LegacyHouseMark size={40} decorative />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
