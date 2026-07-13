import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { CostingMarginStudio } from "./costing-margin-studio";

describe("CostingMarginStudio", () => {
  it("shows honest missing cost evidence and invokes the real scenario action", () => {
    const listener = vi.fn();
    window.addEventListener("legacy:create", listener);
    render(
      <CostingMarginStudio
        development={canonicalDevelopmentSnapshot}
        commercial={canonicalCommercialSnapshot}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Costing & Margin Studio" }),
    ).toBeInTheDocument();
    expect(screen.getByText("COGS not calculated")).toBeInTheDocument();
    expect(screen.getByText("Margin not available")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Run Scenario" }));
    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toMatchObject({ kind: "cost-scenario" });
    window.removeEventListener("legacy:create", listener);
  });
});
