import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { canonicalCommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { canonicalDevelopmentSnapshot } from "@/src/domain/development/snapshot";

import { ProductBuildWorkspace } from "./product-build-workspace";

describe("ProductBuildWorkspace", () => {
  it("renders the real continuation, exactly three creation paths, and stage routes", () => {
    render(
      <ProductBuildWorkspace
        development={canonicalDevelopmentSnapshot}
        commercial={canonicalCommercialSnapshot}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Product Build Workspace" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Most advanced active product"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Formula 1.0 · Production Ready"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    for (const path of ["Custom Formula", "White-Label", "Product Concept"]) {
      expect(
        screen.getByRole("button", { name: new RegExp(path) }),
      ).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /Research/ })).toHaveAttribute(
      "href",
      "/modules/r-and-d",
    );
    expect(
      screen.getByRole("link", { name: /Launch Readiness/ }),
    ).toHaveAttribute("href", "/modules/product-pipeline");
  });

  it("uses the existing controlled product-create event", () => {
    const listener = vi.fn();
    window.addEventListener("legacy:create", listener);
    render(
      <ProductBuildWorkspace
        development={canonicalDevelopmentSnapshot}
        commercial={canonicalCommercialSnapshot}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Custom Formula/ }));
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      kind: "product",
      developmentPath: "custom_formula",
    });
    window.removeEventListener("legacy:create", listener);
  });
});
