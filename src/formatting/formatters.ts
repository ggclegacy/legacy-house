import type { WorkspaceSettings } from "@/src/domain/settings/settings";

export function formatCurrency(
  value: number,
  settings: Pick<WorkspaceSettings, "currency" | "precision">,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: settings.currency,
    minimumFractionDigits: settings.precision,
    maximumFractionDigits: settings.precision,
  }).format(value);
}

export function formatNumber(value: number, precision: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

export function formatDate(
  value: Date,
  format: WorkspaceSettings["dateFormat"],
): string {
  const parts = {
    MM: String(value.getMonth() + 1).padStart(2, "0"),
    dd: String(value.getDate()).padStart(2, "0"),
    yyyy: String(value.getFullYear()),
  };
  return format
    .replace("yyyy", parts.yyyy)
    .replace("MM", parts.MM)
    .replace("dd", parts.dd);
}
