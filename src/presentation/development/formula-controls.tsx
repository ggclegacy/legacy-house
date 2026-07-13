"use client";

import { useState } from "react";

import {
  ingredientCategories,
  labelFor,
} from "@/src/domain/development/development";
import type {
  DevelopmentFormula,
  DevelopmentIngredient,
} from "@/src/domain/development/snapshot";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import { normalizePercentages } from "@/src/domain/formulas/decimal";
import { formulaCanBeEditedInPlace } from "@/src/domain/formulas/versioning";

async function action(payload: Record<string, unknown>) {
  const response = await fetch("/api/development/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(body.error ?? "Formula change failed.");
}

export function FormulaControls({
  formula,
  ingredients,
  persistence,
}: {
  formula: DevelopmentFormula;
  ingredients: readonly DevelopmentIngredient[];
  persistence: "database" | "unavailable";
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [lines, setLines] = useState([...formula.ingredients]);
  const [ingredientToAdd, setIngredientToAdd] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [normalizePending, setNormalizePending] = useState(false);
  const [archiveConfirmation, setArchiveConfirmation] = useState("");
  const [steps, setSteps] = useState([...formula.productionSteps]);
  const [confirmStepDelete, setConfirmStepDelete] = useState<string | null>(
    null,
  );
  const [lastRemoved, setLastRemoved] = useState<{
    line: DevelopmentFormula["ingredients"][number];
    index: number;
  } | null>(null);
  const total = lines.every((line) => /^\d+(?:\.\d*)?$/.test(line.percentage))
    ? formulaTotal(lines.map((line) => line.percentage || "0"))
    : { total: "—", state: "invalid" as const };
  const editable =
    formulaCanBeEditedInPlace(formula.status) && persistence === "database";
  async function saveComposition() {
    try {
      await action({
        action: "save_formula_composition",
        formulaVersionId: formula.versionId,
        lines: lines.map((line, index) => ({
          ingredientId: line.ingredientId,
          percentage: line.percentage,
          sortOrder: index,
          formulaRole: line.formulaRole,
          processingNotes: line.processingNotes,
          isConcentratedExtract: line.isConcentratedExtract,
          isFragrance: line.isFragrance,
        })),
      });
      setMessage(
        "Draft composition saved. Refresh to confirm persisted values.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    }
  }
  function updatePercentage(id: string, percentage: string) {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, percentage } : line)),
    );
  }
  function addIngredient() {
    const ingredient = ingredients.find((item) => item.id === ingredientToAdd);
    if (
      !ingredient ||
      lines.some((line) => line.ingredientId === ingredient.id)
    )
      return;
    setLines((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        ingredientId: ingredient.id,
        ingredientName: ingredient.commonName,
        category: ingredient.category,
        percentage: "0",
        sortOrder: current.length,
        formulaRole: null,
        processingNotes: null,
        isConcentratedExtract: false,
        isFragrance: ingredient.category === "fragrance",
        densityGramsPerMl: ingredient.densityGramsPerMl,
      },
    ]);
    setIngredientToAdd("");
  }
  function removeLine(index: number) {
    const line = lines[index];
    if (!line || lines.length === 1) return;
    setLastRemoved({ line, index });
    setLines((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
    setConfirmDeleteId(null);
  }
  function undoRemove() {
    if (!lastRemoved) return;
    setLines((current) => {
      const next = [...current];
      next.splice(lastRemoved.index, 0, lastRemoved.line);
      return next;
    });
    setLastRemoved(null);
  }
  function normalize() {
    const values = normalizePercentages(lines.map((line) => line.percentage));
    setLines((current) =>
      current.map((line, index) => ({
        ...line,
        percentage: values[index] ?? line.percentage,
      })),
    );
    setNormalizePending(false);
  }
  async function createIngredientInline(formData: FormData) {
    try {
      await action({
        action: "create_ingredient",
        data: {
          commonName: formData.get("commonName"),
          inciName: formData.get("inciName") || null,
          category: formData.get("category"),
          description: formData.get("description") || null,
          functions: [],
          densityGramsPerMl: null,
          notes: null,
        },
      });
      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Ingredient creation failed.",
      );
    }
  }
  async function duplicateFamily(formData: FormData) {
    try {
      await action({
        action: "duplicate_formula_family",
        formulaVersionId: formula.versionId,
        name: formData.get("name"),
      });
      setMessage(
        "Formula family duplicated as a new draft. Refresh the Vault to open it.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Duplication failed.",
      );
    }
  }
  async function archiveFamily() {
    try {
      await action({
        action: "archive_formula_family",
        formulaFamilyId: formula.familyId,
      });
      window.location.assign("/modules/formula-vault");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Archive failed.");
    }
  }
  function moveLine(index: number, direction: -1 | 1) {
    setLines((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }
  async function submitReview() {
    try {
      await action({
        action: "submit_formula_review",
        formulaVersionId: formula.versionId,
      });
      setMessage(
        "Formula submitted for review. Refresh to confirm its status.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Review submission failed.",
      );
    }
  }
  async function createVersion(formData: FormData) {
    try {
      await action({
        action: "create_formula_version",
        formulaVersionId: formula.versionId,
        changeReason: formData.get("changeReason"),
        initialStatus: formData.get("initialStatus"),
      });
      setMessage("New formula version created. Refresh the Vault to open it.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Version creation failed.",
      );
    }
  }
  async function addStep(formData: FormData) {
    try {
      await action({
        action: "add_production_step",
        formulaVersionId: formula.versionId,
        phase: formData.get("phase"),
        instruction: formData.get("instruction"),
        required: formData.get("required") === "on",
        notes: formData.get("notes") || null,
      });
      setMessage("Production step added. Refresh to view it.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Step creation failed.",
      );
    }
  }
  function moveStep(index: number, direction: -1 | 1) {
    setSteps((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  }
  async function saveSteps() {
    try {
      await action({
        action: "save_production_steps",
        formulaVersionId: formula.versionId,
        steps: steps.map((step) => ({
          phase: step.phase,
          instruction: step.instruction,
          required: step.required,
          notes: step.notes,
        })),
      });
      setMessage("Production steps saved. Refresh to confirm persisted order.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Step save failed.");
    }
  }
  return (
    <>
      {message ? (
        <p className="inline-feedback" role="status">
          {message}
        </p>
      ) : null}
      <form action={saveComposition} className="formula-builder">
        <div className="formula-builder-heading">
          <div>
            <p className="card-eyebrow">Formula Builder</p>
            <h2>Controlled composition</h2>
          </div>
          <span>
            {editable
              ? "Draft editing enabled"
              : "Historical version · read only"}
          </span>
        </div>
        <div className="formula-builder-heading">
          <strong>
            Running total: {total.total}% · {labelFor(total.state)}
          </strong>
          <div className="inline-actions">
            <select
              aria-label="Existing ingredient"
              value={ingredientToAdd}
              onChange={(event) => setIngredientToAdd(event.target.value)}
              disabled={!editable}
            >
              <option value="">Choose ingredient</option>
              {ingredients
                .filter(
                  (ingredient) =>
                    !ingredient.archivedAt &&
                    !lines.some((line) => line.ingredientId === ingredient.id),
                )
                .map((ingredient) => (
                  <option value={ingredient.id} key={ingredient.id}>
                    {ingredient.commonName}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="button-secondary"
              disabled={!editable || !ingredientToAdd}
              onClick={addIngredient}
            >
              Add existing
            </button>
          </div>
        </div>
        <div className="formula-rows">
          {lines.map((line, index) => (
            <article key={line.id}>
              <span className="formula-order">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong>{line.ingredientName}</strong>
                <small>{line.category}</small>
              </div>
              <label>
                <span>Percentage</span>
                <input
                  name={`percentage:${line.id}`}
                  inputMode="decimal"
                  value={line.percentage}
                  onChange={(event) =>
                    updatePercentage(line.id, event.target.value)
                  }
                  disabled={!editable}
                />
              </label>
              <div>
                <span>{line.formulaRole ?? "Role not entered"}</span>
                <small>
                  {line.processingNotes ?? "Processing notes not entered"}
                </small>
              </div>
              <div className="line-flags">
                {line.isConcentratedExtract ? (
                  <span>Concentrated extract</span>
                ) : null}
                {line.isFragrance ? <span>Fragrance</span> : null}
              </div>
              <div
                className="reorder-controls"
                aria-label={`Reorder ${line.ingredientName}`}
              >
                <button
                  type="button"
                  disabled={!editable || index === 0}
                  onClick={() => moveLine(index, -1)}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={!editable || index === lines.length - 1}
                  onClick={() => moveLine(index, 1)}
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
              <div className="line-delete">
                {confirmDeleteId === line.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      disabled={!editable || lines.length === 1}
                    >
                      Confirm delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={!editable || lines.length === 1}
                    onClick={() => setConfirmDeleteId(line.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="formula-builder-actions">
          {lastRemoved ? (
            <button
              type="button"
              className="button-secondary"
              onClick={undoRemove}
            >
              Undo removed ingredient
            </button>
          ) : null}
          {normalizePending ? (
            <>
              <button
                type="button"
                className="button-secondary"
                onClick={normalize}
              >
                Confirm normalization
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => setNormalizePending(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="button-secondary"
              disabled={!editable || total.state === "ready"}
              onClick={() => setNormalizePending(true)}
            >
              Normalize to 100%
            </button>
          )}
          <button className="button" disabled={!editable}>
            Save draft
          </button>
          <button
            className="button-secondary"
            type="button"
            disabled={!editable}
            onClick={submitReview}
          >
            Submit for review after save
          </button>
        </div>
      </form>
      <form action={createIngredientInline} className="step-form">
        <div>
          <p className="card-eyebrow">Ingredient Library</p>
          <h2>Create ingredient in this workflow</h2>
        </div>
        <label>
          <span>Common name</span>
          <input name="commonName" required />
        </label>
        <label>
          <span>INCI</span>
          <input name="inciName" />
        </label>
        <label>
          <span>Category</span>
          <select name="category">
            {ingredientCategories.map((category) => (
              <option key={category} value={category}>
                {labelFor(category)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" />
        </label>
        <button className="button" disabled={!editable}>
          Create ingredient
        </button>
      </form>
      <div className="memory-forms">
        <form action={duplicateFamily} className="memory-form">
          <h2>Duplicate formula family</h2>
          <p>Creates a distinct draft family while preserving this source.</p>
          <label>
            <span>New family name</span>
            <input
              name="name"
              required
              minLength={2}
              defaultValue={`${formula.familyName} Copy`}
            />
          </label>
          <button className="button" disabled={persistence !== "database"}>
            Duplicate family
          </button>
        </form>
        <div className="memory-form">
          <h2>Archive formula family</h2>
          <p>Preserves all versions and removes the family from active work.</p>
          <label>
            <span>Type ARCHIVE to confirm</span>
            <input
              value={archiveConfirmation}
              onChange={(event) => setArchiveConfirmation(event.target.value)}
              disabled={persistence !== "database"}
            />
          </label>
          <button
            type="button"
            className="button-secondary"
            onClick={archiveFamily}
            disabled={
              persistence !== "database" || archiveConfirmation !== "ARCHIVE"
            }
          >
            Archive family
          </button>
        </div>
      </div>
      <form action={createVersion} className="version-form">
        <div>
          <p className="card-eyebrow">Immutable history</p>
          <h2>Create New Version</h2>
          <p>
            Ingredients and production steps are copied; the current version
            remains unchanged.
          </p>
        </div>
        <label>
          <span>Change reason</span>
          <textarea name="changeReason" required minLength={8} rows={3} />
        </label>
        <label>
          <span>Initial status</span>
          <select name="initialStatus">
            <option value="draft">Draft</option>
            <option value="experimental">Experimental</option>
          </select>
        </label>
        <button className="button" disabled={persistence !== "database"}>
          Create New Version
        </button>
      </form>
      <form action={addStep} className="step-form">
        <div>
          <p className="card-eyebrow">Production Steps</p>
          <h2>Add version-specific instruction</h2>
        </div>
        <label>
          <span>Phase</span>
          <input name="phase" required placeholder="Preparation" />
        </label>
        <label>
          <span>Instruction</span>
          <textarea name="instruction" rows={3} required />
        </label>
        <label>
          <span>Notes</span>
          <textarea name="notes" rows={2} />
        </label>
        <label className="inline-checkbox">
          <input type="checkbox" name="required" defaultChecked />
          Required
        </label>
        <button className="button" disabled={!editable}>
          Add step
        </button>
      </form>
      <div className="step-form">
        <div>
          <p className="card-eyebrow">Complete step editor</p>
          <h2>Edit and order production steps</h2>
        </div>
        {steps.map((step, index) => (
          <article className="production-step-editor" key={step.id}>
            <label>
              <span>Phase</span>
              <input
                value={step.phase}
                disabled={!editable}
                onChange={(event) =>
                  setSteps((current) =>
                    current.map((item) =>
                      item.id === step.id
                        ? { ...item, phase: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </label>
            <label>
              <span>Instruction</span>
              <textarea
                value={step.instruction}
                disabled={!editable}
                onChange={(event) =>
                  setSteps((current) =>
                    current.map((item) =>
                      item.id === step.id
                        ? { ...item, instruction: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </label>
            <label className="inline-checkbox">
              <input
                type="checkbox"
                checked={step.required}
                disabled={!editable}
                onChange={(event) =>
                  setSteps((current) =>
                    current.map((item) =>
                      item.id === step.id
                        ? { ...item, required: event.target.checked }
                        : item,
                    ),
                  )
                }
              />
              Required
            </label>
            <div className="inline-actions">
              <button
                type="button"
                disabled={!editable || index === 0}
                onClick={() => moveStep(index, -1)}
              >
                Move up
              </button>
              <button
                type="button"
                disabled={!editable || index === steps.length - 1}
                onClick={() => moveStep(index, 1)}
              >
                Move down
              </button>
              {confirmStepDelete === step.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSteps((current) =>
                        current.filter((item) => item.id !== step.id),
                      );
                      setConfirmStepDelete(null);
                    }}
                  >
                    Confirm delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmStepDelete(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={!editable}
                  onClick={() => setConfirmStepDelete(step.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </article>
        ))}
        <button
          type="button"
          className="button"
          disabled={!editable}
          onClick={saveSteps}
        >
          Save production steps
        </button>
      </div>
    </>
  );
}
