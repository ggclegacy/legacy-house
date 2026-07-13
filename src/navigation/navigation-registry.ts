export type NavigationGroup =
  "Command" | "Create" | "Build" | "Control" | "Scale" | "System";

export interface NavigationDestination {
  id: string;
  label: string;
  href: string;
  group: NavigationGroup;
  summary: string;
  phase: number;
}

export const navigationDestinations = [
  {
    id: "command",
    label: "Command",
    href: "/",
    group: "Command",
    summary: "System orientation, readiness, and operating pillars.",
    phase: 1,
  },
  {
    id: "product-pipeline",
    label: "Product Pipeline",
    href: "/modules/product-pipeline",
    group: "Create",
    summary: "Product briefs, lifecycle state, and development decisions.",
    phase: 2,
  },
  {
    id: "formula-vault",
    label: "Formula Vault",
    href: "/modules/formula-vault",
    group: "Create",
    summary: "Controlled formula versions, comparison, and approval history.",
    phase: 2,
  },
  {
    id: "ingredients",
    label: "Ingredients",
    href: "/modules/ingredients",
    group: "Create",
    summary:
      "Ingredient identity, evidence, specifications, and unit-safe facts.",
    phase: 2,
  },
  {
    id: "r-and-d",
    label: "R&D Lab",
    href: "/modules/r-and-d",
    group: "Create",
    summary: "Controlled experiments, scheduled observations, and conclusions.",
    phase: 2,
  },
  {
    id: "suppliers",
    label: "Suppliers",
    href: "/modules/suppliers",
    group: "Build",
    summary: "Supplier capabilities, evidence, contacts, quotes, and history.",
    phase: 3,
  },
  {
    id: "manufacturers",
    label: "Manufacturers",
    href: "/modules/manufacturers",
    group: "Build",
    summary:
      "Manufacturing capabilities, samples, specifications, and options.",
    phase: 3,
  },
  {
    id: "packaging",
    label: "Packaging",
    href: "/modules/packaging",
    group: "Build",
    summary:
      "Components, price history, compatibility, and finished configurations.",
    phase: 3,
  },
  {
    id: "costing",
    label: "Costing",
    href: "/modules/costing",
    group: "Build",
    summary:
      "Traceable COGS, pricing margins, scenarios, and immutable snapshots.",
    phase: 3,
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "/modules/inventory",
    group: "Control",
    summary: "Immutable stock transactions, lots, status, and availability.",
    phase: 4,
  },
  {
    id: "production",
    label: "Production",
    href: "/modules/production",
    group: "Control",
    summary: "Production planning, snapshots, actual usage, and genealogy.",
    phase: 4,
  },
  {
    id: "quality",
    label: "Quality",
    href: "/modules/quality",
    group: "Control",
    summary: "Specifications, disposition, stability, labels, and complaints.",
    phase: 5,
  },
  {
    id: "launches",
    label: "Launches",
    href: "/modules/launches",
    group: "Scale",
    summary:
      "Evidence-backed readiness gates, milestones, and launch decisions.",
    phase: 6,
  },
  {
    id: "market",
    label: "Market",
    href: "/modules/market",
    group: "Scale",
    summary: "Read-only commerce performance and explainable market facts.",
    phase: 6,
  },
  {
    id: "documents",
    label: "Documents",
    href: "/modules/documents",
    group: "System",
    summary:
      "Shared evidence and controlled document references across workflows.",
    phase: 2,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    group: "System",
    summary:
      "Workspace defaults, display preferences, and product-line context.",
    phase: 1,
  },
] as const satisfies readonly NavigationDestination[];

export function getNavigationDestination(
  id: string,
): NavigationDestination | undefined {
  return navigationDestinations.find((destination) => destination.id === id);
}
