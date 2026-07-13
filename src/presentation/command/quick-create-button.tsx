"use client";

import type { CreateAction } from "@/src/command/create-registry";

export function QuickCreateButton({
  kind,
  children,
  className = "quick-action",
  developmentPath,
}: {
  kind: CreateAction["kind"];
  children: React.ReactNode;
  className?: string;
  developmentPath?: "custom_formula" | "white_label" | "undecided";
}) {
  return (
    <button
      className={className}
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("legacy:create", {
            detail: { kind, developmentPath },
          }),
        )
      }
    >
      {children}
    </button>
  );
}
