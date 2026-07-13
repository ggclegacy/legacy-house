import { z } from "zod";

export const auditEventInput = z.object({
  actorUserId: z.string().uuid().nullable(),
  action: z.string().trim().min(1).max(120),
  entityType: z.string().trim().min(1).max(120),
  entityId: z.string().trim().min(1).max(200),
  reason: z.string().trim().min(1).max(1000).nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type AuditEventInput = z.infer<typeof auditEventInput>;

export interface AuditEventWriter {
  append(event: AuditEventInput): Promise<void>;
}
