import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { BatchMode } from "./batch-mode";

const formula = canonicalDevelopmentSnapshot.formulas[0]!;
const configuration = {
  count: 20,
  size: "2",
  unit: "us_fluid_ounces" as const,
  overage: "5",
  precision: 12,
};

afterEach(() => vi.restoreAllMocks());

describe("BatchMode", () => {
  it("shows exact measurements and preserves notes across phase navigation", () => {
    render(<BatchMode formula={formula} configuration={configuration} />);
    expect(screen.getByText("31.92")).toBeInTheDocument();
    expect(screen.getAllByText("Density required")).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: "Notes" }));
    fireEvent.change(screen.getByRole("textbox", { name: /Notes for/ }), {
      target: { value: "Prepared work surface." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Measure" }));
    fireEvent.click(screen.getByRole("button", { name: "Notes" }));
    expect(screen.getByRole("textbox", { name: /Notes for/ })).toHaveValue(
      "Prepared work surface.",
    );
  });

  it("copies, prints, and saves a plan without an inventory action", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const print = vi.spyOn(window, "print").mockImplementation(() => undefined);
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ result: { id: "plan-1" } }), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );
    render(<BatchMode formula={formula} configuration={configuration} />);

    fireEvent.click(screen.getByRole("button", { name: "Copy Batch Sheet" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    fireEvent.click(screen.getByRole("button", { name: "Print Batch Sheet" }));
    expect(print).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Save Batch Plan" }));
    await waitFor(() =>
      expect(
        screen.getByText("Batch Plan saved. Inventory was not changed."),
      ).toBeInTheDocument(),
    );
    const body = JSON.parse(String(fetch.mock.calls[0]?.[1]?.body)) as Record<
      string,
      unknown
    >;
    expect(body).not.toHaveProperty("inventory");
    expect(body).not.toHaveProperty("lots");
    expect(body).not.toHaveProperty("consumption");
  });

  it("edits and reorders the exact-version production-step draft", () => {
    const { container } = render(
      <BatchMode formula={formula} configuration={configuration} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Production steps" }));

    const headings = screen.getAllByRole("textbox", { name: "Step heading" });
    expect(headings[0]).toHaveValue("Preparation");
    expect(headings[1]).toHaveValue("Measure Premixed Natural Oil Base");

    fireEvent.click(screen.getByRole("button", { name: "Move step 2 up" }));
    expect(
      screen.getAllByRole("textbox", { name: "Step heading" })[0],
    ).toHaveValue("Measure Premixed Natural Oil Base");

    fireEvent.change(
      screen.getAllByRole("textbox", { name: "Step note" })[0]!,
      {
        target: { value: "Operator note" },
      },
    );
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Required" })[0]!);
    expect(
      screen.getAllByRole("textbox", { name: "Step note" })[0],
    ).toHaveValue("Operator note");
    expect(
      screen.getAllByRole("checkbox", { name: "Required" })[0],
    ).toBeChecked();
    expect(
      container.querySelector(`[data-formula-version="${formula.versionId}"]`),
    ).toBeInTheDocument();
  });
});
