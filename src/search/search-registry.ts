import { navigationDestinations } from "@/src/navigation/navigation-registry";
import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";
import {
  canonicalDevelopmentSnapshot,
  type DevelopmentSnapshot,
} from "@/src/domain/development/snapshot";
import {
  canonicalCommercialSnapshot,
  type CommercialSnapshot,
} from "@/src/domain/commercial/snapshot";

export type SearchGroup =
  | "Navigation"
  | "Products"
  | "Formulas"
  | "Ingredients"
  | "Experiments"
  | "Product notes"
  | "Product decisions"
  | "Suppliers"
  | "Supplier products"
  | "Manufacturers"
  | "Catalog products"
  | "Quotes"
  | "Packaging"
  | "Configurations"
  | "Documents"
  | "Cost scenarios"
  | "Cost snapshots"
  | "Product lines"
  | "Settings"
  | "Documentation";

export interface SearchEntry {
  id: string;
  label: string;
  description: string;
  href: string;
  group: SearchGroup;
  keywords: readonly string[];
}

export const searchRegistry: readonly SearchEntry[] = [
  ...navigationDestinations.map((destination) => ({
    id: `navigation:${destination.id}`,
    label: destination.label,
    description: destination.summary,
    href: destination.href,
    group: "Navigation" as const,
    keywords: [destination.group, `phase ${destination.phase}`],
  })),
  ...productLineSeedDefinitions.map((productLine) => ({
    id: `product-line:${productLine.slug}`,
    label: productLine.name,
    description: productLine.description,
    href: "/settings#product-lines",
    group: "Product lines" as const,
    keywords: [productLine.slug, productLine.accentTheme],
  })),
  ...developmentSearchEntries(canonicalDevelopmentSnapshot),
  ...commercialSearchEntries(canonicalCommercialSnapshot),
  {
    id: "settings:formatting",
    label: "Formatting defaults",
    description: "Currency, precision, units, and date format.",
    href: "/settings#formatting",
    group: "Settings",
    keywords: ["currency", "units", "precision", "date"],
  },
  {
    id: "settings:experience",
    label: "Experience preferences",
    description: "Reduced motion and sidebar state.",
    href: "/settings#experience",
    group: "Settings",
    keywords: ["motion", "sidebar", "accessibility"],
  },
  {
    id: "docs:build-status",
    label: "Build status",
    description:
      "Current phase, validation evidence, blockers, and next action.",
    href: "/modules/documents#build-status",
    group: "Documentation",
    keywords: ["BUILD_STATUS", "validation", "phase"],
  },
  {
    id: "docs:architecture",
    label: "Architecture decisions",
    description: "Durable technical and data-integrity decisions.",
    href: "/modules/documents#architecture",
    group: "Documentation",
    keywords: ["ADR", "decisions", "architecture"],
  },
];

export function commercialSearchEntries(
  snapshot: CommercialSnapshot,
): SearchEntry[] {
  const map = <T extends { id: string }>(
    rows: readonly T[],
    group: SearchGroup,
    prefix: string,
    label: (row: T) => string,
    description: (row: T) => string,
    href: (row: T) => string,
  ) =>
    rows.map((row) => ({
      id: `${prefix}:${row.id}`,
      label: label(row),
      description: description(row),
      href: href(row),
      group,
      keywords: [description(row)],
    }));
  return [
    ...map(
      snapshot.suppliers,
      "Suppliers",
      "supplier",
      (r) => r.name,
      (r) => `${r.supplierType} · ${r.status}`,
      (r) => `/suppliers/${r.id}`,
    ),
    ...map(
      snapshot.supplierProducts,
      "Supplier products",
      "supplier-product",
      (r) => r.name,
      (r) => `${r.status} · ${r.availabilityStatus}`,
      () => "/modules/suppliers",
    ),
    ...map(
      snapshot.manufacturers,
      "Manufacturers",
      "manufacturer",
      (r) => r.name,
      (r) => `${r.manufacturerType} · ${r.status}`,
      (r) => `/manufacturers/${r.id}`,
    ),
    ...map(
      snapshot.catalogProducts,
      "Catalog products",
      "catalog",
      (r) => r.name,
      (r) => r.status,
      () => "/modules/manufacturers",
    ),
    ...map(
      snapshot.quotes,
      "Quotes",
      "quote",
      (r) => r.quoteNumber,
      (r) => `${r.currency} · ${r.quoteStatus}`,
      () => "/modules/manufacturers",
    ),
    ...map(
      snapshot.packaging,
      "Packaging",
      "packaging",
      (r) => r.name,
      (r) => r.componentType,
      (r) => `/packaging/${r.id}`,
    ),
    ...map(
      snapshot.configurations,
      "Configurations",
      "configuration",
      (r) => r.name,
      (r) => `${r.fillSize} ${r.fillSizeUnit}`,
      (r) => `/configurations/${r.id}`,
    ),
    ...map(
      snapshot.documents,
      "Documents",
      "document",
      (r) => r.title,
      (r) => `${r.documentType} · ${r.status}`,
      (r) => `/documents/${r.id}`,
    ),
    ...map(
      snapshot.scenarios,
      "Cost scenarios",
      "scenario",
      (r) => r.name,
      (r) => r.description ?? "Saved cost scenario",
      () => "/modules/costing",
    ),
    ...map(
      snapshot.snapshots,
      "Cost snapshots",
      "snapshot",
      (r) => `Cost snapshot · ${r.calculatedAt.toLocaleDateString()}`,
      (r) => `${r.fullyLoadedCogsPerUnit} per unit`,
      () => "/modules/costing",
    ),
  ];
}

export function developmentSearchEntries(
  snapshot: DevelopmentSnapshot,
): SearchEntry[] {
  return [
    ...snapshot.products.map((product) => ({
      id: `product:${product.id}`,
      label: product.name,
      description: `${product.productLineName} · ${product.developmentPath}`,
      href: `/products/${product.slug}`,
      group: "Products" as const,
      keywords: [product.slug, product.pipelineStatus],
    })),
    ...snapshot.formulas.map((formula) => ({
      id: `formula:${formula.versionId}`,
      label: `${formula.familyName} · ${formula.version}`,
      description: `${formula.productName} · ${formula.status}`,
      href: `/formulas/${formula.versionId}`,
      group: "Formulas" as const,
      keywords: [formula.formulaBasis, formula.productLineName],
    })),
    ...snapshot.ingredients.map((ingredient) => ({
      id: `ingredient:${ingredient.id}`,
      label: ingredient.commonName,
      description: ingredient.description ?? "Technical details not entered.",
      href: `/ingredients/${ingredient.id}`,
      group: "Ingredients" as const,
      keywords: [ingredient.inciName ?? "", ingredient.category],
    })),
    ...snapshot.experiments.map((experiment) => ({
      id: `experiment:${experiment.id}`,
      label: `${experiment.experimentNumber} · ${experiment.name}`,
      description: experiment.objective,
      href: `/experiments/${experiment.id}`,
      group: "Experiments" as const,
      keywords: [experiment.status, experiment.result],
    })),
    ...snapshot.notes.map((note) => ({
      id: `note:${note.id}`,
      label: note.title,
      description: note.content,
      href: `/products/${snapshot.products.find((product) => product.id === note.productId)?.slug ?? ""}#development`,
      group: "Product notes" as const,
      keywords: [note.noteType],
    })),
    ...snapshot.decisions.map((decision) => ({
      id: `decision:${decision.id}`,
      label: decision.title,
      description: decision.decision,
      href: `/products/${snapshot.products.find((product) => product.id === decision.productId)?.slug ?? ""}#decisions`,
      group: "Product decisions" as const,
      keywords: [decision.status, decision.reason],
    })),
  ];
}

export function searchEntries(query: string): readonly SearchEntry[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return searchRegistry;
  return searchRegistry.filter((entry) =>
    [entry.label, entry.description, ...entry.keywords]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalized),
  );
}
