import { z } from "zod";

export const currencyOptions = ["USD", "CAD", "EUR", "GBP"] as const;
export const unitSystemOptions = [
  "us_customary_with_metric",
  "metric",
] as const;
export const dateFormatOptions = [
  "MM/dd/yyyy",
  "dd/MM/yyyy",
  "yyyy-MM-dd",
] as const;

export const workspaceSettingsSchema = z.object({
  currency: z.enum(currencyOptions),
  unitSystem: z.enum(unitSystemOptions),
  precision: z.number().int().min(0).max(6),
  reducedMotion: z.boolean(),
  sidebarCollapsed: z.boolean(),
  defaultProductLineFilter: z.string().nullable(),
  dateFormat: z.enum(dateFormatOptions),
});

export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;

export const defaultWorkspaceSettings: Readonly<WorkspaceSettings> = {
  currency: "USD",
  unitSystem: "us_customary_with_metric",
  precision: 2,
  reducedMotion: false,
  sidebarCollapsed: false,
  defaultProductLineFilter: null,
  dateFormat: "MM/dd/yyyy",
};

export const workspaceSettingsKey = "workspace.defaults";

export interface SettingsRepository {
  get(): Promise<WorkspaceSettings>;
  save(settings: WorkspaceSettings): Promise<WorkspaceSettings>;
}
