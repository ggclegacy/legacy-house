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
    | "product-decision"
    | "supplier"
    | "supplier-product"
    | "manufacturer"
    | "catalog-product"
    | "quote"
    | "packaging"
    | "finished-configuration"
    | "document"
    | "cost-scenario";
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
  {
    id: "supplier",
    label: "New Supplier",
    description: "Register an entered supplier without implying approval.",
    kind: "supplier",
  },
  {
    id: "supplier-product",
    label: "New Supplier Product",
    description: "Link a real supplier offer to one master ingredient.",
    kind: "supplier-product",
  },
  {
    id: "manufacturer",
    label: "New Manufacturer",
    description: "Register a manufacturer or white-label partner.",
    kind: "manufacturer",
  },
  {
    id: "catalog-product",
    label: "New Catalog Product",
    description: "Capture only manufacturer-supplied catalog facts.",
    kind: "catalog-product",
  },
  {
    id: "quote",
    label: "New Quote",
    description: "Preserve an identified manufacturer quote and its currency.",
    kind: "quote",
  },
  {
    id: "packaging",
    label: "New Packaging Component",
    description: "Register an actual component; price remains optional.",
    kind: "packaging",
  },
  {
    id: "finished-configuration",
    label: "New Finished Configuration",
    description: "Connect a product to a formula version or catalog product.",
    kind: "finished-configuration",
  },
  {
    id: "document",
    label: "New Document Metadata",
    description: "Register stored-object metadata after a real upload exists.",
    kind: "document",
  },
  {
    id: "cost-scenario",
    label: "New Cost Scenario",
    description: "Save non-destructive assumptions for a configuration.",
    kind: "cost-scenario",
  },
] as const satisfies readonly CreateAction[];
