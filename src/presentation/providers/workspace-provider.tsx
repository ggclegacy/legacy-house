"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  defaultWorkspaceSettings,
  type WorkspaceSettings,
} from "@/src/domain/settings/settings";

type DatabaseStatus = "checking" | "available" | "unavailable";
type PersistenceStatus = "checking" | "database" | "unavailable";

interface WorkspaceContextValue {
  settings: WorkspaceSettings;
  databaseStatus: DatabaseStatus;
  persistenceStatus: PersistenceStatus;
  updateSettings: (settings: WorkspaceSettings) => void;
  updatePreference: (
    preference: "reducedMotion" | "sidebarCollapsed",
    value: boolean,
  ) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
const preferenceStorageKey = "legacy-house:experience-preferences";

function readExperiencePreferences(): Partial<
  Pick<WorkspaceSettings, "reducedMotion" | "sidebarCollapsed">
> {
  try {
    const raw = window.localStorage.getItem(preferenceStorageKey);
    if (!raw) return {};
    const value = JSON.parse(raw) as Record<string, unknown>;
    return {
      ...(typeof value.reducedMotion === "boolean"
        ? { reducedMotion: value.reducedMotion }
        : {}),
      ...(typeof value.sidebarCollapsed === "boolean"
        ? { sidebarCollapsed: value.sidebarCollapsed }
        : {}),
    };
  } catch {
    window.localStorage.removeItem(preferenceStorageKey);
    return {};
  }
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WorkspaceSettings>(
    defaultWorkspaceSettings,
  );
  const [databaseStatus, setDatabaseStatus] =
    useState<DatabaseStatus>("checking");
  const [persistenceStatus, setPersistenceStatus] =
    useState<PersistenceStatus>("checking");

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/settings").then(async (response) => ({
        ok: response.ok,
        body: (await response.json()) as {
          settings?: WorkspaceSettings;
          persistence?: "database" | "unavailable";
        },
      })),
      fetch("/api/ready").then((response) => response.ok),
    ])
      .then(([settingsResponse, ready]) => {
        if (!active) return;
        const preferences = readExperiencePreferences();
        setSettings({
          ...(settingsResponse.body.settings ?? defaultWorkspaceSettings),
          ...preferences,
        });
        setPersistenceStatus(
          settingsResponse.body.persistence ?? "unavailable",
        );
        setDatabaseStatus(ready ? "available" : "unavailable");
      })
      .catch(() => {
        if (!active) return;
        setDatabaseStatus("unavailable");
        setPersistenceStatus("unavailable");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = settings.reducedMotion
      ? "true"
      : "false";
  }, [settings.reducedMotion]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      settings,
      databaseStatus,
      persistenceStatus,
      updateSettings: setSettings,
      updatePreference(preference, enabled) {
        setSettings((current) => {
          const next = { ...current, [preference]: enabled };
          window.localStorage.setItem(
            preferenceStorageKey,
            JSON.stringify({
              reducedMotion: next.reducedMotion,
              sidebarCollapsed: next.sidebarCollapsed,
            }),
          );
          return next;
        });
      },
    }),
    [databaseStatus, persistenceStatus, settings],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error("useWorkspace must be used inside WorkspaceProvider.");
  return context;
}
