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

  const fields = [
    ["targetCustomer", "Target customer"],
    ["problemToSolve", "Problem being solved"],
    ["desiredBenefits", "Desired benefits"],
    ["desiredFormat", "Desired format"],
    ["desiredTexture", "Desired texture"],
    ["desiredAbsorption", "Desired absorption"],
    ["desiredColor", "Desired color"],
    ["desiredAroma", "Desired aroma"],
    ["targetPackaging", "Target packaging"],
    ["ingredientsToExplore", "Ingredients to explore"],
    ["ingredientsToAvoid", "Ingredients to avoid"],
    ["competitiveReferences", "Competitive references"],
    ["notes", "Brief notes"],
  ] as const;
  const priceFields = [
    ["targetRetailPrice", "Target retail price"],
    ["targetWholesalePrice", "Target wholesale price"],
    ["maximumTargetCogs", "Maximum target COGS"],
  ] as const;
  return (
    <form className="brief-editor" onSubmit={save}>
      <div className="brief-fields">
        {fields.map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <textarea
              rows={key === "notes" ? 5 : 3}
              value={draft[key]}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
            />
          </label>
        ))}
        {priceFields.map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <input
              inputMode="decimal"
              value={draft[key]}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              placeholder="Not entered"
            />
          </label>
        ))}
        <label>
          <span>Target launch date</span>
          <input
            type="date"
            value={draft.targetLaunchDate}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                targetLaunchDate: event.target.value,
              }))
            }
          />
        </label>
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
