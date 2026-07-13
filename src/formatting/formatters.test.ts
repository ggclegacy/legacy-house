import { describe, expect, it } from "vitest";

import { defaultWorkspaceSettings } from "@/src/domain/settings/settings";

import { formatCurrency, formatDate, formatNumber } from "./formatters";

describe("central formatting utilities", () => {
  it("uses configured currency and precision", () => {
    expect(formatCurrency(12.5, defaultWorkspaceSettings)).toBe("$12.50");
    expect(formatNumber(4.125, 2)).toBe("4.13");
  });

  it("uses configured date patterns deterministically", () => {
    const date = new Date(2026, 6, 13);
    expect(formatDate(date, "MM/dd/yyyy")).toBe("07/13/2026");
    expect(formatDate(date, "yyyy-MM-dd")).toBe("2026-07-13");
  });
});
