export interface CreateAction {
  id: string;
  label: string;
  description: string;
  kind:
    | "product-line"
    | "product"
    | "formula"
    | "ingredient"
    | "experiment"
    | "product-note"
    | "product-decision";
}

export const createActionRegistry = [
  {
    id: "product-line",
    label: "Product line",
    description: "Register a real Groomed Gent Co. product line in PostgreSQL.",
    kind: "product-line",
  },
  {
    id: "product",
    label: "New Product",
    description:
      "Create a product idea or planning record in a real product line.",
    kind: "product",
  },
  {
    id: "formula",
    label: "New Formula",
    description:
      "Create a formula family and controlled version 1.0 for a persisted product.",
    kind: "formula",
  },
  {
    id: "ingredient",
    label: "New Ingredient",
    description:
      "Create one reusable master ingredient identity without invented technical facts.",
    kind: "ingredient",
  },
  {
    id: "experiment",
    label: "New Experiment",
    description:
      "Plan an experiment against an exact persisted formula version.",
    kind: "experiment",
  },
  {
    id: "product-note",
    label: "New Product Note",
    description: "Add sourced research or product-development memory.",
    kind: "product-note",
  },
  {
    id: "product-decision",
    label: "New Product Decision",
    description: "Record a founder decision and its reason.",
    kind: "product-decision",
  },
] as const satisfies readonly CreateAction[];
