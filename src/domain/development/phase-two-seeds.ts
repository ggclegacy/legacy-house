import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";

const reserveLine = productLineSeedDefinitions[0];
const sanctumLine = productLineSeedDefinitions[1];

export const reserveProductId = "e750bc0b-cb47-4aa3-9e5a-97134080d7a2";
export const reserveFormulaFamilyId = "798e84da-cc9c-4a4e-9257-4cc32a454a0e";
export const reserveFormulaVersionId = "938e7ae9-7f2c-45c6-bdad-abd2f0ad75a8";

export const phaseTwoProductSeeds = [
  {
    id: reserveProductId,
    productLineId: reserveLine.id,
    name: "Legacy Reserve Hair & Beard Oil",
    slug: "legacy-reserve-hair-beard-oil",
    description:
      "A premium leave-on conditioning oil developed for hair, beard, scalp, and the skin beneath the beard.",
    productType: "hair_beard_care" as const,
    developmentPath: "custom_formula" as const,
    pipelineStatus: "production_ready" as const,
    priority: "standard" as const,
  },
  ...(
    [
      [
        "bc3dde89-f11d-4ff5-a9eb-2b48b493c579",
        "VITALIS — NMN 500 mg",
        "vitalis-nmn-500-mg",
      ],
      [
        "41af52a2-d462-4e15-a114-64491b3d912d",
        "NEXUS — NAD+ 500 mg with Quercetin and Resveratrol",
        "nexus-nad-500-mg",
      ],
      [
        "b7317cc1-d32d-4ae0-830e-f09c92a06d63",
        "SOLARIS — KSM-66 Ashwagandha Plus",
        "solaris-ksm-66-ashwagandha-plus",
      ],
      [
        "f4e49fde-e23e-4f4b-b220-88c981190f51",
        "HYDROS — Electrolyte Hydration",
        "hydros-electrolyte-hydration",
      ],
      [
        "388f7baf-b37a-455c-8f91-94aa3850da58",
        "NOCTURNE — Sleep Support",
        "nocturne-sleep-support",
      ],
      [
        "abeef7c0-4e5b-4bde-aeb7-4001b3aacb7e",
        "FORTIUS AQUA — Creatine and Electrolytes",
        "fortius-aqua-creatine-electrolytes",
      ],
      [
        "c7d54d02-717c-4919-9e10-5b9213301d64",
        "RESTORIA — Magnesium Glycinate",
        "restoria-magnesium-glycinate",
      ],
      [
        "c7305194-5093-4189-afd4-54d57d5b2dca",
        "ASCEND — Focus and Nootropic Powder",
        "ascend-focus-nootropic-powder",
      ],
      [
        "53b1929b-6a68-4b6e-b0d8-bd91b5bf7f86",
        "GENESIS — Gut Health",
        "genesis-gut-health",
      ],
    ] as const
  ).map(([id, name, slug]) => ({
    id,
    productLineId: sanctumLine.id,
    name,
    slug,
    description: null,
    productType: null,
    developmentPath: "white_label" as const,
    pipelineStatus: "research" as const,
    priority: "standard" as const,
  })),
] as const;

export const reserveIngredientSeeds = [
  {
    id: "e72ee23a-61f8-4895-8e67-2236b4d0b262",
    commonName: "Premixed Natural Oil Base",
    category: "base_blend" as const,
    description:
      "Contains Organic Sunflower Oil, Organic Rosehip Oil, Avocado Oil, Organic Argan Oil, Jojoba Oil, Sweet Almond Oil, and Vitamin E. Internal blend percentages are not known.",
    functions: [],
    notes: "Internal blend percentages must not be inferred.",
  },
  {
    id: "1fca9d52-1439-43da-999d-ea1b0b25162f",
    commonName: "Marula Oil",
    category: "other" as const,
    description: "Premium emollient and sensory-enhancing oil.",
    functions: [],
    notes: null,
  },
  {
    id: "0ee45568-c198-4a76-bc37-2dfb969975ba",
    commonName: "Tamanu Oil",
    category: "other" as const,
    description: "Rich botanical treatment oil.",
    functions: [],
    notes: null,
  },
  {
    id: "851e353b-4790-48cd-a155-b6e3365eb305",
    commonName: "Sea Buckthorn CO₂ Extract",
    category: "botanical_extract" as const,
    description: "Highly pigmented premium botanical extract.",
    functions: [],
    notes: null,
  },
  {
    id: "3c765241-63c5-4244-b46f-adb427893644",
    commonName: "Fragrance",
    category: "fragrance" as const,
    description: "Signature fragrance profile.",
    functions: [],
    notes: "Working level is 3.5% based on supplied product testing.",
  },
] as const;

export const reserveFormulaSeed = {
  family: {
    id: reserveFormulaFamilyId,
    productId: reserveProductId,
    name: "Legacy Reserve Hair & Beard Oil",
    description: null,
    activeVersionId: reserveFormulaVersionId,
  },
  version: {
    id: reserveFormulaVersionId,
    formulaFamilyId: reserveFormulaFamilyId,
    name: "Legacy Reserve Hair & Beard Oil",
    version: "1.0",
    description: null,
    formulaBasis: "volume_percentage" as const,
    status: "production_ready" as const,
    defaultBottleSize: "2",
    defaultBottleSizeUnit: "us_fluid_ounces" as const,
    defaultBottleCount: 20,
    defaultOveragePercent: "5",
    changeReason: "Canonical supplied formula.",
  },
  ingredients: [
    [
      reserveIngredientSeeds[0].id,
      "76",
      10,
      "Premixed natural oil base",
      false,
      false,
    ],
    [
      reserveIngredientSeeds[1].id,
      "15",
      20,
      "Premium emollient and sensory-enhancing oil",
      false,
      false,
    ],
    [
      reserveIngredientSeeds[2].id,
      "5",
      30,
      "Rich botanical treatment oil",
      false,
      false,
    ],
    [
      reserveIngredientSeeds[3].id,
      "0.5",
      40,
      "Highly pigmented premium botanical extract",
      true,
      false,
    ],
    [
      reserveIngredientSeeds[4].id,
      "3.5",
      50,
      "Signature fragrance profile",
      false,
      true,
    ],
  ].map(
    (
      [
        ingredientId,
        percentage,
        sortOrder,
        formulaRole,
        isConcentratedExtract,
        isFragrance,
      ],
      index,
    ) => ({
      id: [
        "fa7636a8-2a9d-43ae-8849-fc86fe017f91",
        "804acbd8-9d4f-42d3-94ee-69a752051a1c",
        "ff2a795a-7674-480f-9b83-69226e2a66ac",
        "a4c3057b-96d0-4ae1-9c1f-962e6a984374",
        "a434b669-0364-4929-b79c-b0cc97f50006",
      ][index]!,
      formulaVersionId: reserveFormulaVersionId,
      ingredientId: String(ingredientId),
      percentage: String(percentage),
      sortOrder: Number(sortOrder),
      formulaRole: String(formulaRole),
      processingNotes: null,
      isConcentratedExtract: Boolean(isConcentratedExtract),
      isFragrance: Boolean(isFragrance),
    }),
  ),
} as const;
