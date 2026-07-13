import { z } from "zod";

export const accentThemes = ["reserve", "sanctum", "house"] as const;

export const createProductLineInput = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase words separated by hyphens.",
    ),
  description: z.string().trim().min(8).max(280),
  accentTheme: z.enum(accentThemes),
});

export type CreateProductLineInput = z.infer<typeof createProductLineInput>;

export interface ProductLine extends CreateProductLineInput {
  id: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export interface ProductLineSeedDefinition extends CreateProductLineInput {
  id: string;
  sortOrder: number;
}

export interface ProductLineRepository {
  listActive(): Promise<readonly ProductLine[]>;
  create(input: CreateProductLineInput): Promise<ProductLine>;
  seed(definitions: readonly ProductLineSeedDefinition[]): Promise<void>;
}
