import type { ProductLineSeedDefinition } from "./product-line";

export const productLineSeedDefinitions = [
  {
    id: "4ed399ca-b5ce-4cb8-8ce0-7cdfcc689b79",
    name: "Legacy Reserve",
    slug: "legacy-reserve",
    description:
      "Grooming and related products developed under the Legacy Reserve line.",
    accentTheme: "reserve",
    sortOrder: 10,
  },
  {
    id: "68432cbf-7c09-4d46-8a7f-d0bf5ade8f1e",
    name: "Legacy Sanctum",
    slug: "legacy-sanctum",
    description:
      "Wellness product planning developed through the Legacy Sanctum line.",
    accentTheme: "sanctum",
    sortOrder: 20,
  },
] as const satisfies readonly ProductLineSeedDefinition[];
