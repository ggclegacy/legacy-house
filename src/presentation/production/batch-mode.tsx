"use client";

import { useMemo, useState } from "react";

import type { DevelopmentFormula } from "@/src/domain/development/snapshot";
import { calculateBatch } from "@/src/domain/formulas/calculation";
import {
  productionStepsForBatch,
  type BatchProductionStep,
} from "@/src/domain/production/steps";

export interface BatchModeConfiguration {
  count: number;
  size: string;
  unit: "us_fluid_ounces" | "milliliters" | "grams";
  overage: string;
  precision: number;
}

export function BatchMode({
  formula,
  configuration,
}: {
  formula: DevelopmentFormula;
  configuration: BatchModeConfiguration;
}) {
  const [phase, setPhase] = useState<"measure" | "steps" | "notes">("measure");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    () => new Set(),
  );
  const [steps, setSteps] = useState<BatchProductionStep[]>(() =>
    productionStepsForBatch(formula),
  );
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const result = useMemo(
    () =>
      calculateBatch({
        basis: formula.formulaBasis,
        bottleCount: configuration.count,
        bottleSize: configuration.size,
        bottleSizeUnit: configuration.unit,
        overagePercent: configuration.overage,
        outputPrecision: configuration.precision,
        ingredients: formula.ingredients.map((line) => ({
          id: line.id,
          name: line.ingredientName,
          percentage: line.percentage,
          densityGramsPerMl: line.densityGramsPerMl,
        })),
      }),
    [configuration, formula],
  );
  const sheet = useMemo(
    () =>
      [
        `${formula.productName} · Formula ${formula.version}`,
        `${configuration.count} bottles × ${configuration.size} ${configuration.unit}`,
        `Overage: ${configuration.overage}%`,
        `Total: ${result.totalFluidOunces ?? "n/a"} fl oz / ${result.totalMilliliters ?? "n/a"} mL`,
        "",
        ...result.ingredients.map(
          (line, index) =>
            `${index + 1}. ${line.name} (${line.percentage}%): ${line.fluidOunces ?? "n/a"} fl oz / ${line.milliliters ?? "n/a"} mL / ${line.grams ?? "density required"} g`,
        ),
        "",
        `Production steps · Formula version ${formula.version}`,
        ...steps.map(
          (step, index) =>
            `${index + 1}. ${step.phase}${step.instruction ? `: ${step.instruction}` : ""}${step.required ? " [Required]" : ""}${step.notes ? ` — ${step.notes}` : ""}`,
        ),
        notes ? `\nBatch notes: ${notes}` : "",
      ].join("\n"),
    [configuration, formula, notes, result, steps],
  );

  function updateStep(
    id: string,
    update: Partial<
      Pick<BatchProductionStep, "phase" | "instruction" | "notes" | "required">
    >,
  ) {
    setSteps((current) =>
      current.map((step) => (step.id === id ? { ...step, ...update } : step)),
    );
  }

  function moveStep(index: number, direction: -1 | 1) {
    setSteps((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next.map((step, stepIndex) => ({
        ...step,
        stepNumber: stepIndex + 1,
      }));
    });
  }

  async function copySheet() {
    await navigator.clipboard.writeText(sheet);
    setFeedback("Batch sheet copied.");
  }

  async function savePlan() {
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/production/batch-plans", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formulaVersionId: formula.versionId,
          bottleCount: configuration.count,
          bottleSize: configuration.size,
          bottleSizeUnit: configuration.unit,
          overagePercent: configuration.overage,
          outputPrecision: configuration.precision,
          notes: notes.trim() || null,
        }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(body.error ?? "Batch Plan save failed.");
      setFeedback("Batch Plan saved. Inventory was not changed.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="batch-mode">
      <header className="batch-mode-header">
        <div>
          <p className="eyebrow">Production · Batch Mode</p>
          <h1>{formula.productName}</h1>
          <p>Formula {formula.version}</p>
        </div>
        <dl>
          <div>
            <dt>Bottles</dt>
            <dd>{configuration.count}</dd>
          </div>
          <div>
            <dt>Bottle size</dt>
            <dd>
              {configuration.size} {configuration.unit}
            </dd>
          </div>
          <div>
            <dt>Overage</dt>
            <dd>{configuration.overage}%</dd>
          </div>
          <div>
            <dt>Total batch</dt>
            <dd>{result.totalBatch}</dd>
          </div>
        </dl>
      </header>

      <nav className="batch-phase-tabs" aria-label="Batch Mode phases">
        {(["measure", "steps", "notes"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={phase === item}
            onClick={() => setPhase(item)}
          >
            {item === "measure"
              ? "Measure"
              : item === "steps"
                ? "Production steps"
                : "Notes"}
          </button>
        ))}
      </nav>

      <section
        className="batch-mode-panel batch-measurements"
        data-active={phase === "measure"}
        aria-labelledby="batch-measurements-title"
      >
        <div className="batch-mode-section-heading">
          <p className="card-eyebrow">Measure in this order</p>
          <h2 id="batch-measurements-title">Ingredient amounts</h2>
          <strong>
            {result.totalFluidOunces ?? "—"} fl oz ·{" "}
            {result.totalMilliliters ?? "—"} mL
          </strong>
        </div>
        <ol>
          {result.ingredients.map((line) => (
            <li key={line.id}>
              <span>{line.percentage}%</span>
              <h3>{line.name}</h3>
              <dl>
                <div>
                  <dt>fl oz</dt>
                  <dd>{line.fluidOunces ?? "—"}</dd>
                </div>
                <div>
                  <dt>mL</dt>
                  <dd>{line.milliliters ?? "—"}</dd>
                </div>
                <div>
                  <dt>grams</dt>
                  <dd>{line.grams ?? "Density required"}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="batch-mode-panel batch-step-panel"
        data-active={phase === "steps"}
        aria-labelledby="batch-steps-title"
      >
        <div className="batch-mode-section-heading">
          <p className="card-eyebrow">Formula-version instructions</p>
          <h2 id="batch-steps-title">Production steps</h2>
          <p>
            Formula {formula.version} · {formula.versionId}
          </p>
        </div>
        {steps[0]?.source === "draft" ? (
          <p className="inline-feedback">
            Editable draft headings — no technical values or approvals have been
            inferred.
          </p>
        ) : null}
        <ol>
          {steps.map((step, index) => (
            <li key={step.id} data-formula-version={step.formulaVersionId}>
              <div className="batch-step-check">
                <label>
                  <input
                    type="checkbox"
                    aria-label={`Complete step ${index + 1}`}
                    checked={completedSteps.has(step.id)}
                    onChange={(event) =>
                      setCompletedSteps((current) => {
                        const next = new Set(current);
                        if (event.target.checked) next.add(step.id);
                        else next.delete(step.id);
                        return next;
                      })
                    }
                  />
                  <span>{index + 1}</span>
                </label>
                <div
                  className="batch-step-reorder"
                  aria-label={`Reorder step ${index + 1}`}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    aria-label={`Move step ${index + 1} up`}
                    onClick={() => moveStep(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === steps.length - 1}
                    aria-label={`Move step ${index + 1} down`}
                    onClick={() => moveStep(index, 1)}
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div className="batch-step-fields">
                <label>
                  <span>Step heading</span>
                  <input
                    value={step.phase}
                    onChange={(event) =>
                      updateStep(step.id, { phase: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Verified instruction</span>
                  <textarea
                    value={step.instruction}
                    rows={2}
                    placeholder="Leave blank until a verified instruction is available."
                    onChange={(event) =>
                      updateStep(step.id, { instruction: event.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Step note</span>
                  <input
                    value={step.notes ?? ""}
                    onChange={(event) =>
                      updateStep(step.id, { notes: event.target.value || null })
                    }
                  />
                </label>
                <label className="batch-step-required">
                  <input
                    type="checkbox"
                    checked={step.required}
                    onChange={(event) =>
                      updateStep(step.id, { required: event.target.checked })
                    }
                  />
                  <span>Required</span>
                </label>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="batch-mode-panel batch-notes-panel"
        data-active={phase === "notes"}
        aria-labelledby="batch-notes-title"
      >
        <div className="batch-mode-section-heading">
          <p className="card-eyebrow">Plan-only record</p>
          <h2 id="batch-notes-title">Batch notes</h2>
        </div>
        <label>
          <span>Notes for this Batch Plan</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={7}
          />
        </label>
        <p>
          Saving does not reserve materials, consume inventory, create finished
          goods, or post production history.
        </p>
      </section>

      <div className="batch-mode-actions">
        <button type="button" onClick={() => void copySheet()}>
          Copy Batch Sheet
        </button>
        <button type="button" onClick={() => window.print()}>
          Print Batch Sheet
        </button>
        <button type="button" disabled={saving} onClick={() => void savePlan()}>
          {saving ? "Saving…" : "Save Batch Plan"}
        </button>
      </div>
      {feedback ? (
        <p className="inline-feedback" role="status">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
