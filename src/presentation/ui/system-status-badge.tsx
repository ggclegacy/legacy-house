"use client";

import { useWorkspace } from "@/src/presentation/providers/workspace-provider";

export function SystemStatusBadge() {
  const { databaseStatus } = useWorkspace();
  const label =
    databaseStatus === "checking"
      ? "Checking database"
      : databaseStatus === "available"
        ? "Database ready"
        : "Database not configured";
  return (
    <span className={`status-badge status-${databaseStatus}`} role="status">
      <span aria-hidden="true" />
      {label}
    </span>
  );
}
