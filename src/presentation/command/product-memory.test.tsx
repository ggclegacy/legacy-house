import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { ProductMemory } from "./product-memory";

describe("ProductMemory", () => {
  it("keeps undated canonical history distinct from recent memory", () => {
    const listener = vi.fn();
    window.addEventListener("legacy:create", listener);
    render(
      <ProductMemory
        development={canonicalDevelopmentSnapshot}
        commercial={canonicalCommercialSnapshot}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Product Memory" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "No dated product memory recorded.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("No notes recorded")).toBeInTheDocument();
    expect(screen.getByText("No decisions recorded")).toBeInTheDocument();
    expect(screen.getByText(/Canonical supplied formula/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add Product Note" }));
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toMatchObject({
      kind: "product-note",
    });
    window.removeEventListener("legacy:create", listener);
  });
});
