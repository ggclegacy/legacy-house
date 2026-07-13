import { describe, expect, it } from "vitest";

import { auditEventInput } from "./audit-event";

describe("audit event boundary", () => {
  it("accepts an attributable, structured event", () => {
    const event = auditEventInput.parse({
      actorUserId: "6e92c602-f868-441a-a712-e55ccfe66d57",
      action: "foundation.reviewed",
      entityType: "phase",
      entityId: "phase-1",
      reason: "Acceptance review",
      metadata: { outcome: "accepted" },
    });
    expect(event.metadata).toEqual({ outcome: "accepted" });
  });

  it("rejects blank action and entity identity", () => {
    expect(() =>
      auditEventInput.parse({
        actorUserId: null,
        action: " ",
        entityType: "phase",
        entityId: "",
        reason: null,
      }),
    ).toThrow();
  });
});
