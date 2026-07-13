"use client";

import { useEffect, useMemo, useState } from "react";

import type { DevelopmentProduct } from "@/src/domain/development/snapshot";

type BriefDraft = Record<string, string>;

export function ProductBriefEditor({
  product,
  brief,
  persistence,
}: {
  product: DevelopmentProduct;
  brief?: {
    ingredientsToExplore: string | null;
    ingredientsToAvoid: string | null;
    competitiveReferences: string | null;
    notes: string | null;
  };
  persistence: "database" | "unavailable";
}) {
  const initial = useMemo<BriefDraft>(
    () => ({
      targetCustomer: product.targetCustomer ?? "",
      problemToSolve: product.problemToSolve ?? "",
      desiredBenefits: product.desiredBenefits ?? "",
      desiredFormat: product.desiredFormat ?? "",
      desiredTexture: product.desiredTexture ?? "",
      desiredAbsorption: product.desiredAbsorption ?? "",
      desiredColor: product.desiredColor ?? "",
      desiredAroma: product.desiredAroma ?? "",
      targetPackaging: product.targetPackaging ?? "",
      targetRetailPrice: product.targetRetailPrice ?? "",
      targetWholesalePrice: product.targetWholesalePrice ?? "",
      maximumTargetCogs: product.maximumTargetCogs ?? "",
      targetLaunchDate: product.targetLaunchDate ?? "",
      ingredientsToExplore: brief?.ingredientsToExplore ?? "",
      ingredientsToAvoid: brief?.ingredientsToAvoid ?? "",
      competitiveReferences: brief?.competitiveReferences ?? "",
      notes: brief?.notes ?? "",
    }),
    [brief, product],
  );
  const [draft, setDraft] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const storageKey = `legacy-house:brief-draft:${product.id}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved)
          setDraft((current) => ({
            ...current,
            ...(JSON.parse(saved) as BriefDraft),
          }));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(draft));
      setMessage("Draft preserved on this device; not yet authoritative.");
    }, 500);
    return () => window.clearTimeout(timer);
  }, [draft, storageKey]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("Saving…");
    const nullable = Object.fromEntries(
      Object.entries(draft).map(([key, value]) => [key, value.trim() || null]),
    );
    const response = await fetch("/api/development/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save_product_brief",
        productId: product.id,
        data: nullable,
      }),
    });
    const body = (await response.json()) as { error?: string };
    if (response.ok) {
      window.localStorage.removeItem(storageKey);
      setMessage("Product brief saved to PostgreSQL.");
    } else setMessage(body.error ?? "Product brief was not saved.");
  }

  const enteredCount = Object.values(draft).filter(
    (value) => value.trim().length > 0,
  ).length;
  const briefFieldCount = Object.keys(initial).length;
  function updateField(key: keyof BriefDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }
  function textField(key: keyof BriefDraft, label: string, rows = 3) {
    return (
      <label key={key}>
        <span>{label}</span>
        <textarea
          rows={rows}
          value={draft[key]}
          onChange={(event) => updateField(key, event.target.value)}
        />
      </label>
    );
  }
  return (
    <form className="brief-editor" onSubmit={save}>
      <div className="brief-completion" role="status">
        <span>Brief completion</span>
        <strong>
          {enteredCount} of {briefFieldCount} fields entered
        </strong>
        <small>
          Counted from entered values only; no readiness is inferred.
        </small>
      </div>
      <div className="brief-instrument">
        <fieldset>
          <legend>Product Intent</legend>
          <div className="brief-current-intent">
            <span>Current product description</span>
            <p>{product.description ?? "Not entered"}</p>
            <small>
              Edit product identity separately; saving this brief does not
              silently change it.
            </small>
          </div>
          <label>
            <span>Target launch date</span>
            <input
              type="date"
              value={draft.targetLaunchDate}
              onChange={(event) =>
                updateField("targetLaunchDate", event.target.value)
              }
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Target Customer</legend>
          {textField("targetCustomer", "Target customer")}
        </fieldset>
        <fieldset>
          <legend>Problem to Solve</legend>
          {textField("problemToSolve", "Problem to solve")}
        </fieldset>
        <fieldset>
          <legend>Desired Benefits</legend>
          {textField("desiredBenefits", "Desired benefits")}
        </fieldset>
        <fieldset>
          <legend>Product Format</legend>
          {textField("desiredFormat", "Desired format")}
        </fieldset>
        <fieldset className="brief-fieldset-wide">
          <legend>Texture / Absorption / Color / Aroma</legend>
          <div className="brief-field-grid">
            {textField("desiredTexture", "Desired texture")}
            {textField("desiredAbsorption", "Desired absorption")}
            {textField("desiredColor", "Desired color")}
            {textField("desiredAroma", "Desired aroma")}
          </div>
        </fieldset>
        <fieldset>
          <legend>Packaging Target</legend>
          {textField("targetPackaging", "Target packaging")}
        </fieldset>
        <fieldset className="brief-fieldset-wide">
          <legend>Retail / Wholesale / Maximum COGS Targets</legend>
          <div className="brief-field-grid brief-target-grid">
            {(
              [
                ["targetRetailPrice", "Target retail price"],
                ["targetWholesalePrice", "Target wholesale price"],
                ["maximumTargetCogs", "Maximum target COGS"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  inputMode="decimal"
                  value={draft[key]}
                  onChange={(event) => updateField(key, event.target.value)}
                  placeholder="Not entered"
                />
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Ingredients to Explore</legend>
          {textField("ingredientsToExplore", "Ingredients to explore", 4)}
        </fieldset>
        <fieldset>
          <legend>Ingredients to Avoid</legend>
          {textField("ingredientsToAvoid", "Ingredients to avoid", 4)}
        </fieldset>
        <fieldset>
          <legend>Competitive References</legend>
          {textField("competitiveReferences", "Competitive references", 4)}
        </fieldset>
        <fieldset>
          <legend>Notes</legend>
          {textField("notes", "Brief notes", 5)}
        </fieldset>
      </div>
      {message ? (
        <p className="inline-feedback" role="status">
          {message}
        </p>
      ) : null}
      <button
        className="button"
        type="submit"
        disabled={persistence !== "database"}
      >
        Save product brief
      </button>
    </form>
  );
}
