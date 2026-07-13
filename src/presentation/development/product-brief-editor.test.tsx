import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { ProductBriefEditor } from "./product-brief-editor";

describe("ProductBriefEditor", () => {
  const product = canonicalDevelopmentSnapshot.products[0]!;

  it("organizes the full brief and reports only entered fields", () => {
    render(<ProductBriefEditor product={product} persistence="unavailable" />);

    for (const section of [
      "Product Intent",
      "Target Customer",
      "Problem to Solve",
      "Desired Benefits",
      "Product Format",
      "Texture / Absorption / Color / Aroma",
      "Packaging Target",
      "Retail / Wholesale / Maximum COGS Targets",
      "Ingredients to Explore",
      "Ingredients to Avoid",
      "Competitive References",
      "Notes",
    ]) {
      expect(screen.getByText(section)).toBeInTheDocument();
    }
    expect(screen.getByText(/fields entered/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save product brief" }),
    ).toBeDisabled();
  });

  it("sends an explicit authoritative save without changing status", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ result: {} }), { status: 200 }),
      );
    render(<ProductBriefEditor product={product} persistence="database" />);

    fireEvent.change(screen.getByLabelText("Target customer"), {
      target: { value: "A real entered customer description" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save product brief" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const request = fetchMock.mock.calls[0]?.[1];
    const payload = JSON.parse(String(request?.body)) as {
      action: string;
      data: { targetCustomer: string };
      pipelineStatus?: string;
    };
    expect(payload.action).toBe("save_product_brief");
    expect(payload.data.targetCustomer).toBe(
      "A real entered customer description",
    );
    expect(payload.pipelineStatus).toBeUndefined();
    fetchMock.mockRestore();
  });
});
