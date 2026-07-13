import { eq } from "drizzle-orm";

import {
  defaultWorkspaceSettings,
  type SettingsRepository,
  type WorkspaceSettings,
  workspaceSettingsKey,
  workspaceSettingsSchema,
} from "@/src/domain/settings/settings";
import type { Database } from "@/src/infrastructure/database/client";
import { appSettings } from "@/src/infrastructure/database/schema";

export function createDrizzleSettingsRepository(
  database: Database,
): SettingsRepository {
  return {
    async get() {
      const [record] = await database
        .select({ valueJson: appSettings.valueJson })
        .from(appSettings)
        .where(eq(appSettings.key, workspaceSettingsKey))
        .limit(1);
      return record
        ? workspaceSettingsSchema.parse(record.valueJson)
        : defaultWorkspaceSettings;
    },

    async save(settings: WorkspaceSettings) {
      const value = workspaceSettingsSchema.parse(settings);
      await database
        .insert(appSettings)
        .values({ key: workspaceSettingsKey, valueJson: value })
        .onConflictDoUpdate({
          target: appSettings.key,
          set: { valueJson: value, updatedAt: new Date() },
        });
      return value;
    },
  };
}
