export const roles = [
  "founder",
  "product_operator",
  "operations_operator",
  "quality_operator",
  "analyst",
] as const;

export type Role = (typeof roles)[number];
export type Capability = "foundation:read" | "foundation:admin" | "audit:read";

const grants: Readonly<Record<Role, ReadonlySet<Capability>>> = {
  founder: new Set(["foundation:read", "foundation:admin", "audit:read"]),
  product_operator: new Set(["foundation:read"]),
  operations_operator: new Set(["foundation:read"]),
  quality_operator: new Set(["foundation:read", "audit:read"]),
  analyst: new Set(["foundation:read"]),
};

export function isAuthorized(
  assignedRoles: readonly Role[],
  capability: Capability,
): boolean {
  return assignedRoles.some((assignedRole) =>
    grants[assignedRole].has(capability),
  );
}
