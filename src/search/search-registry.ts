import { navigationDestinations } from "@/src/navigation/navigation-registry";
import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";
import {
  canonicalDevelopmentSnapshot,
  type DevelopmentSnapshot,
} from "@/src/domain/development/snapshot";

export type SearchGroup =
  | "Navigation"
  | "Products"
  | "Formulas"
  | "Ingredients"
  | "Experiments"
  | "Product notes"
  | "Product decisions"
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
