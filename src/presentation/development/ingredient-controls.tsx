"use client";

import { useState } from "react";

import {
  ingredientCategories,
  labelFor,
} from "@/src/domain/development/development";
import type { DevelopmentIngredient } from "@/src/domain/development/snapshot";

async function post(payload: Record<string, unknown>) {
  const response = await fetch("/api/development/actions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Ingredient update failed.");
}

export function IngredientControls({
  ingredient,
  persistence,
  hasFormulaUse,
}: {
  ingredient: DevelopmentIngredient;
  persistence: "database" | "unavailable";
  hasFormulaUse: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const enabled = persistence === "database";
  const text = (formData: FormData, name: string) => formData.get(name) || null;
  async function save(formData: FormData) {
    try {
      await post({
        action: "update_ingredient",
        ingredientId: ingredient.id,
        data: {
          commonName: formData.get("commonName"),
          inciName: text(formData, "inciName"),
          casNumber: text(formData, "casNumber"),
          category: formData.get("category"),
          description: text(formData, "description"),
          physicalForm: text(formData, "physicalForm"),
          naturalColor: text(formData, "naturalColor"),
          naturalAroma: text(formData, "naturalAroma"),
          densityGramsPerMl: text(formData, "densityGramsPerMl"),
          recommendedUsageMinimum: text(formData, "recommendedUsageMinimum"),
          recommendedUsageMaximum: text(formData, "recommendedUsageMaximum"),
          solubility: text(formData, "solubility"),
          heatSensitivity: text(formData, "heatSensitivity"),
          oxidationSensitivity: text(formData, "oxidationSensitivity"),
          storageConditions: text(formData, "storageConditions"),
          shelfLifeMonths: formData.get("shelfLifeMonths")
            ? Number(formData.get("shelfLifeMonths"))
            : null,
          formulationConcerns: text(formData, "formulationConcerns"),
          notes: text(formData, "notes"),
          functions: ingredient.functions,
        },
      });
      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Ingredient update failed.",
      );
    }
  }
  async function archive() {
    try {
      await post({ action: "archive_ingredient", ingredientId: ingredient.id });
      window.location.assign("/modules/ingredients");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Archive failed.");
    }
  }
  return (
    <section className="workspace-section">
      <details>
        <summary>Edit ingredient facts</summary>
        <form action={save} className="brief-fields">
          <label>
            <span>Common name</span>
            <input
              name="commonName"
              defaultValue={ingredient.commonName}
              required
              disabled={!enabled}
            />
          </label>
          <label>
            <span>INCI</span>
            <input
              name="inciName"
              defaultValue={ingredient.inciName ?? ""}
              disabled={!enabled}
            />
          </label>
          <label>
            <span>CAS</span>
            <input
              name="casNumber"
              defaultValue={ingredient.casNumber ?? ""}
              disabled={!enabled}
            />
          </label>
          <label>
            <span>Category</span>
            <select
              name="category"
              defaultValue={ingredient.category}
              disabled={!enabled}
            >
              {ingredientCategories.map((category) => (
                <option value={category} key={category}>
                  {labelFor(category)}
                </option>
              ))}
            </select>
          </label>
          {(
            [
              ["physicalForm", "Physical form"],
              ["naturalColor", "Natural color"],
              ["naturalAroma", "Natural aroma"],
              ["densityGramsPerMl", "Density g/mL"],
              ["recommendedUsageMinimum", "Usage minimum %"],
              ["recommendedUsageMaximum", "Usage maximum %"],
              ["solubility", "Solubility"],
              ["heatSensitivity", "Heat sensitivity"],
              ["oxidationSensitivity", "Oxidation sensitivity"],
              ["storageConditions", "Storage"],
              ["shelfLifeMonths", "Shelf life months"],
            ] as const
          ).map(([name, label]) => (
            <label key={name}>
              <span>{label}</span>
              <input
                name={name}
                defaultValue={String(
                  ingredient[name as keyof DevelopmentIngredient] ?? "",
                )}
                inputMode={
                  name.includes("density") || name.includes("Usage")
                    ? "decimal"
                    : undefined
                }
                disabled={!enabled}
              />
            </label>
          ))}
          <label>
            <span>Description</span>
            <textarea
              name="description"
              defaultValue={ingredient.description ?? ""}
              disabled={!enabled}
            />
          </label>
          <label>
            <span>Formulation concerns</span>
            <textarea
              name="formulationConcerns"
              defaultValue={ingredient.formulationConcerns ?? ""}
              disabled={!enabled}
            />
          </label>
          <label>
            <span>Notes</span>
            <textarea
              name="notes"
              defaultValue={ingredient.notes ?? ""}
              disabled={!enabled}
            />
          </label>
          <button className="button" disabled={!enabled}>
            Save ingredient
          </button>
        </form>
      </details>
      <details>
        <summary>Archive ingredient</summary>
        <p>
          {hasFormulaUse
            ? "Archive is blocked while formula versions reference this ingredient."
            : "This preserves the record and hides it from the active library."}
        </p>
        <label>
          <span>Type ARCHIVE to confirm</span>
          <input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            disabled={!enabled || hasFormulaUse}
          />
        </label>
        <button
          type="button"
          className="button-secondary"
          onClick={archive}
          disabled={!enabled || hasFormulaUse || confirmation !== "ARCHIVE"}
        >
          Archive ingredient
        </button>
      </details>
      {message ? (
        <p className="inline-feedback" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
