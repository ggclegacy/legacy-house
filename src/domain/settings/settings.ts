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
  supplierPriceStaleDays: z.number().int().min(1).max(3650),
  documentExpiringDays: z.number().int().min(1).max(3650),
  defaultLaborHourlyRate: z
    .string()
    .regex(/^\d+(?:\.\d{1,4})?$/)
    .nullable(),
  defaultPaymentProcessingPercent: z
    .string()
    .regex(/^\d+(?:\.\d{1,4})?$/)
    .nullable(),
  defaultFixedProcessingFee: z
    .string()
    .regex(/^\d+(?:\.\d{1,4})?$/)
    .nullable(),
  defaultTargetRetailMargin: z
    .string()
    .regex(/^\d+(?:\.\d{1,4})?$/)
    .nullable(),
  defaultTargetWholesaleMargin: z
    .string()
    .regex(/^\d+(?:\.\d{1,4})?$/)
    .nullable(),
  costDisplayPrecision: z.number().int().min(0).max(6),
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
  supplierPriceStaleDays: 90,
  documentExpiringDays: 60,
  defaultLaborHourlyRate: null,
  defaultPaymentProcessingPercent: null,
  defaultFixedProcessingFee: null,
  defaultTargetRetailMargin: null,
  defaultTargetWholesaleMargin: null,
  costDisplayPrecision: 4,
};

export const workspaceSettingsKey = "workspace.defaults";

export interface SettingsRepository {
  get(): Promise<WorkspaceSettings>;
  save(settings: WorkspaceSettings): Promise<WorkspaceSettings>;
}
