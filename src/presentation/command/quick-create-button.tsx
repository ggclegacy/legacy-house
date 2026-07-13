"use client";

import type { CreateAction } from "@/src/command/create-registry";

export function QuickCreateButton({
  kind,
  children,
}: {
  kind: CreateAction["kind"];
  children: React.ReactNode;
}) {
  return (
    <button
      className="quick-action"
      type="button"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("legacy:create", { detail: { kind } }),
        )
      }
    >
      {children}
    </button>
  );
}
