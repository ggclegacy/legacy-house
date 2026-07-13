"use client";

import { useRef, useState } from "react";

import {
  currencyOptions,
  dateFormatOptions,
  defaultWorkspaceSettings,
  type WorkspaceSettings,
} from "@/src/domain/settings/settings";
import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/src/formatting/formatters";
import { useWorkspace } from "@/src/presentation/providers/workspace-provider";

type SaveState = "idle" | "saving" | "saved" | "error";

export function SettingsForm() {
  const workspace = useWorkspace();
  return (
    <SettingsEditor
      key={JSON.stringify(workspace.settings)}
      initialSettings={workspace.settings}
      persistenceStatus={workspace.persistenceStatus}
      updatePreference={workspace.updatePreference}
      updateSettings={workspace.updateSettings}
    />
  );
}

function SettingsEditor({
  initialSettings,
  persistenceStatus,
  updatePreference,
  updateSettings,
}: {
  initialSettings: WorkspaceSettings;
  persistenceStatus: "checking" | "database" | "unavailable";
  updatePreference: (
    preference: "reducedMotion" | "sidebarCollapsed",
    value: boolean,
  ) => void;
  updateSettings: (settings: WorkspaceSettings) => void;
}) {
  const [draft, setDraft] = useState<WorkspaceSettings>(initialSettings);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const resetDialogRef = useRef<HTMLDialogElement>(null);

  function setField<Key extends keyof WorkspaceSettings>(
    key: Key,
    value: WorkspaceSettings[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveState("idle");
    setMessage(null);
    if (key === "reducedMotion" || key === "sidebarCollapsed") {
      updatePreference(key, value as boolean);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveState("saving");
    setMessage(null);
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = (await response.json()) as {
      settings?: WorkspaceSettings;
      error?: string;
    };
    if (!response.ok || !body.settings) {
      setSaveState("error");
      setMessage(body.error ?? "Settings could not be saved.");
      return;
    }
    updateSettings(body.settings);
    setSaveState("saved");
    setMessage("Workspace settings saved to PostgreSQL.");
  }

  function resetDefaults() {
    setDraft(defaultWorkspaceSettings);
    updatePreference("reducedMotion", defaultWorkspaceSettings.reducedMotion);
    updatePreference(
      "sidebarCollapsed",
      defaultWorkspaceSettings.sidebarCollapsed,
    );
    setSaveState("idle");
    setMessage("Defaults restored in this form. Save to persist them.");
    resetDialogRef.current?.close();
  }

  return (
    <>
      <form className="settings-form" onSubmit={submit}>
        {persistenceStatus === "unavailable" ? (
          <div className="database-unavailable" role="status">
            <span aria-hidden="true">!</span>
            <div>
              <strong>Database settings are not configured.</strong>
              <p>
                Experience preferences work on this device. Workspace defaults
                require a reachable `DATABASE_URL` and will not be represented
                as persisted until then.
              </p>
            </div>
          </div>
        ) : null}
        {message ? (
          <div
            className={
              saveState === "error" ? "error-summary" : "success-summary"
            }
            role={saveState === "error" ? "alert" : "status"}
          >
            <strong>
              {saveState === "error" ? "Settings not saved" : "Settings update"}
            </strong>
            <p>{message}</p>
          </div>
        ) : null}

        <section
          className="settings-section"
          id="formatting"
          aria-labelledby="formatting-title"
        >
          <div className="settings-section-heading">
            <p className="card-eyebrow">Formatting foundation</p>
            <h2 id="formatting-title">Calculation and display defaults</h2>
            <p>
              Central defaults keep quantities, currency, and dates consistent
              across future domain modules.
            </p>
          </div>
          <div className="settings-fields">
            <label>
              <span>Default currency</span>
              <select
                value={draft.currency}
                onChange={(event) =>
                  setField(
                    "currency",
                    event.target.value as WorkspaceSettings["currency"],
                  )
                }
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Default unit system</span>
              <select
                value={draft.unitSystem}
                onChange={(event) =>
                  setField(
                    "unitSystem",
                    event.target.value as WorkspaceSettings["unitSystem"],
                  )
                }
              >
                <option value="us_customary_with_metric">
                  US customary with metric conversion
                </option>
                <option value="metric">Metric</option>
              </select>
            </label>
            <label>
              <span>Calculation precision</span>
              <select
                value={draft.precision}
                onChange={(event) =>
                  setField("precision", Number(event.target.value))
                }
              >
                {[0, 1, 2, 3, 4, 5, 6].map((precision) => (
                  <option key={precision} value={precision}>
                    {precision} decimal places
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Date format</span>
              <select
                value={draft.dateFormat}
                onChange={(event) =>
                  setField(
                    "dateFormat",
                    event.target.value as WorkspaceSettings["dateFormat"],
                  )
                }
              >
                {dateFormatOptions.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="format-preview" aria-live="polite">
            <span>Formatting preview</span>
            <strong>
              {formatCurrency(1250, draft)} ·{" "}
              {formatNumber(24.5, draft.precision)} ·{" "}
              {formatDate(new Date(2026, 6, 13), draft.dateFormat)}
            </strong>
            <small>
              Illustrative display values only—not business records.
            </small>
          </div>
        </section>

        <section
          className="settings-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <div className="settings-section-heading">
            <p className="card-eyebrow">Experience</p>
            <h2 id="experience-title">Motion and navigation</h2>
            <p>
              These preferences apply immediately and are stored locally as
              permitted UI preferences.
            </p>
          </div>
          <div className="preference-list">
            <label className="switch-row">
              <span>
                <strong>Reduce motion</strong>
                <small>
                  Use static relationships and near-instant transitions.
                </small>
              </span>
              <input
                type="checkbox"
                checked={draft.reducedMotion}
                onChange={(event) =>
                  setField("reducedMotion", event.target.checked)
                }
              />
              <span className="switch" aria-hidden="true" />
            </label>
            <label className="switch-row">
              <span>
                <strong>Collapse desktop sidebar</strong>
                <small>
                  Keep navigation available through compact symbols.
                </small>
              </span>
              <input
                type="checkbox"
                checked={draft.sidebarCollapsed}
                onChange={(event) =>
                  setField("sidebarCollapsed", event.target.checked)
                }
              />
              <span className="switch" aria-hidden="true" />
            </label>
          </div>
        </section>

        <section
          className="settings-section"
          id="product-lines"
          aria-labelledby="product-lines-title"
        >
          <div className="settings-section-heading">
            <p className="card-eyebrow">Product-line context</p>
            <h2 id="product-lines-title">Default product-line filter</h2>
            <p>
              Choose the initial context without creating duplicate domain
              systems.
            </p>
          </div>
          <div className="settings-fields single-field">
            <label>
              <span>Default context</span>
              <select
                value={draft.defaultProductLineFilter ?? ""}
                onChange={(event) =>
                  setField(
                    "defaultProductLineFilter",
                    event.target.value || null,
                  )
                }
              >
                <option value="">All product lines</option>
                {productLineSeedDefinitions.map((line) => (
                  <option key={line.id} value={line.slug}>
                    {line.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="registered-lines">
            {productLineSeedDefinitions.map((line) => (
              <article key={line.id} className={`theme-${line.accentTheme}`}>
                <span aria-hidden="true" />
                <div>
                  <strong>{line.name}</strong>
                  <p>{line.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="settings-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => resetDialogRef.current?.showModal()}
          >
            Restore defaults
          </button>
          <button
            type="submit"
            className="button"
            disabled={
              persistenceStatus !== "database" || saveState === "saving"
            }
          >
            {saveState === "saving" ? "Saving…" : "Save workspace settings"}
          </button>
        </div>
      </form>

      <dialog
        ref={resetDialogRef}
        className="confirmation-dialog"
        aria-labelledby="reset-title"
      >
        <p className="eyebrow">Confirm reset</p>
        <h2 id="reset-title">Restore documented defaults?</h2>
        <p>
          This updates the form and local experience preferences. PostgreSQL is
          changed only after Save.
        </p>
        <div className="dialog-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => resetDialogRef.current?.close()}
          >
            Keep current values
          </button>
          <button type="button" className="button" onClick={resetDefaults}>
            Restore defaults
          </button>
        </div>
      </dialog>
    </>
  );
}
