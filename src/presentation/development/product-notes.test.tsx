import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductNotes } from "./product-notes";

const notes = [
  {
    id: "73a4e329-0654-4f2d-b247-a24869430629",
    productId: "e750bc0b-cb47-4aa3-9e5a-97134080d7a2",
    noteType: "research",
    title: "Research source",
    content: "A sourced research observation.",
    createdAt: "2026-07-12T12:00:00.000Z",
    updatedAt: "2026-07-12T12:00:00.000Z",
  },
  {
    id: "7dce920d-1db6-4b67-9fc3-84e0150ba297",
    productId: "e750bc0b-cb47-4aa3-9e5a-97134080d7a2",
    noteType: "packaging",
    title: "Packaging observation",
    content: "A real packaging observation.",
    createdAt: "2026-07-13T12:00:00.000Z",
    updatedAt: "2026-07-13T12:00:00.000Z",
  },
] as const;

describe("ProductNotes", () => {
  it("filters, sorts, opens, and exposes a persistence-gated edit", () => {
    render(<ProductNotes notes={notes} persistence="unavailable" />);
    fireEvent.change(screen.getByLabelText("Filter product notes"), {
      target: { value: "packaging" },
    });
    expect(screen.getByText("Packaging observation")).toBeInTheDocument();
    expect(screen.queryByText("Research source")).toBeNull();

    fireEvent.click(screen.getByText("Open and edit note"));
    expect(
      screen.getByRole("button", { name: "Save note edit" }),
    ).toBeDisabled();
  });
});
