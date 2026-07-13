import { getNavigationDestination } from "@/src/navigation/navigation-registry";

export type CommandPillarId = "create" | "build" | "control" | "scale";

interface CommandPillar {
  id: CommandPillarId;
  label: string;
  descriptor: string;
  destinationId: string;
  href: string;
}

const definitions = [
  {
    id: "create",
    label: "Create",
    descriptor: "Research + R&D",
    destinationId: "product-pipeline",
  },
  {
    id: "build",
    label: "Build",
    descriptor: "Sourcing + Costing",
    destinationId: "suppliers",
  },
  {
    id: "control",
    label: "Control",
    descriptor: "Operations + Quality",
    destinationId: "inventory",
  },
  {
    id: "scale",
    label: "Scale",
    descriptor: "Launch + Intelligence",
    destinationId: "launches",
  },
] as const;

export const commandPillars: readonly CommandPillar[] = definitions.map(
  (definition) => {
    const destination = getNavigationDestination(definition.destinationId);
    if (!destination) {
      throw new Error(
        `Command pillar destination is not registered: ${definition.destinationId}`,
      );
    }
    return { ...definition, href: destination.href };
  },
);
