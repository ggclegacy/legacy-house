"use client";

import { useEffect, useRef, useState } from "react";

import {
  createActionRegistry,
  type CreateAction,
} from "@/src/command/create-registry";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { calculateBatch } from "@/src/domain/formulas/calculation";
import { useWorkspace } from "@/src/presentation/providers/workspace-provider";

export function CreateDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (name: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { databaseStatus } = useWorkspace();
  const [selected, setSelected] = useState<CreateAction>(
    createActionRegistry[1],
  );
  const [snapshot, setSnapshot] = useState<DevelopmentSnapshot | null>(null);
  const [productLines, setProductLines] = useState<
    { id: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  useEffect(() => {
    if (!open || databaseStatus !== "available") return;
    void Promise.all([
      fetch("/api/development").then(
        async (response) => (await response.json()) as DevelopmentSnapshot,
      ),
      fetch("/api/product-lines").then(
        async (response) =>
          (await response.json()) as {
            productLines: { id: string; name: string }[];
          },
      ),
    ]).then(([development, lines]) => {
      setSnapshot(development);
      setProductLines(lines.productLines);
    });
  }, [databaseStatus, open]);
  useEffect(() => {
    const selectRequestedAction = (event: Event) => {
      const kind = (event as CustomEvent<{ kind?: CreateAction["kind"] }>)
        .detail?.kind;
      const requested = createActionRegistry.find((item) => item.kind === kind);
      if (requested) setSelected(requested);
    };
    window.addEventListener("legacy:create", selectRequestedAction);
    return () =>
      window.removeEventListener("legacy:create", selectRequestedAction);
  }, []);

  async function submit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const payload = buildPayload(selected.kind, formData);
    const endpoint =
      selected.kind === "product-line"
        ? "/api/product-lines"
        : "/api/development/actions";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json()) as { error?: string };
    setSubmitting(false);
    if (!response.ok) {
      setError(body.error ?? "The record could not be created.");
      return;
    }
    onCreated(String(formData.get("name") ?? selected.label));
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="command-dialog create-dialog development-create-dialog"
      aria-labelledby="create-title"
      onClose={onClose}
      onCancel={onClose}
    >
      <div className="dialog-heading">
        <div>
          <p className="eyebrow">Global create</p>
          <h2 id="create-title">Create a controlled record.</h2>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onClose}
          aria-label="Close create dialog"
        >
          ×
        </button>
      </div>
      {databaseStatus === "available" ? (
        <div className="create-workspace">
          <nav className="create-action-list" aria-label="Create record type">
            {createActionRegistry.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected.id === item.id}
                onClick={() => {
                  setSelected(item);
                  setError(null);
                }}
              >
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </nav>
          <form action={submit} className="form-stack">
            <p className="form-intro">{selected.description}</p>
            {error ? (
              <div className="error-summary" role="alert">
                <strong>Creation failed</strong>
                <p>{error}</p>
              </div>
            ) : null}
            <CreateFields
              kind={selected.kind}
              productLines={productLines}
              snapshot={snapshot}
            />
            <div className="dialog-actions">
              <button
                className="button-secondary"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="button" type="submit" disabled={submitting}>
                {submitting ? "Creating…" : selected.label}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="dialog-empty">
          <strong>No creation actions are currently available.</strong>
          <p>
            Configure a reachable PostgreSQL `DATABASE_URL`, run migrations, and
            seed approved records. Nothing will be stored locally as
            authoritative business data.
          </p>
        </div>
      )}
    </dialog>
  );
}

function CreateFields({
  kind,
  productLines,
  snapshot,
}: {
  kind: CreateAction["kind"];
  productLines: { id: string; name: string }[];
  snapshot: DevelopmentSnapshot | null;
}) {
  const products = snapshot?.products ?? [];
  const formulas = snapshot?.formulas ?? [];
  if (kind === "product-line")
    return (
      <>
        <label>
          <span>Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Slug</span>
          <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" required minLength={8} />
        </label>
        <label>
          <span>Accent theme</span>
          <select name="accentTheme">
            <option value="house">House gold</option>
            <option value="reserve">Legacy Reserve</option>
            <option value="sanctum">Legacy Sanctum</option>
          </select>
        </label>
      </>
    );
  if (kind === "product")
    return (
      <>
        <label>
          <span>Product line</span>
          <select name="productLineId" required>
            {productLines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Slug</span>
          <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
        </label>
        <label>
          <span>Product type</span>
          <select name="productType">
            <option value="other">Other</option>
            <option value="hair_beard_care">Hair and Beard Care</option>
            <option value="supplement">Supplement</option>
            <option value="wellness">Wellness</option>
          </select>
        </label>
        <label>
          <span>Development path</span>
          <select name="developmentPath">
            <option value="undecided">Undecided</option>
            <option value="custom_formula">Custom Formula</option>
            <option value="white_label">White Label</option>
            <option value="private_label">Private Label</option>
            <option value="manufacturer_custom">Manufacturer Custom</option>
            <option value="curated_resale">Curated Resale</option>
          </select>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" />
        </label>
      </>
    );
  if (kind === "ingredient")
    return (
      <>
        <label>
          <span>Common name</span>
          <input name="name" required />
        </label>
        <label>
          <span>INCI name</span>
          <input name="inciName" />
        </label>
        <label>
          <span>Category</span>
          <select name="category">
            <option value="other">Other</option>
            <option value="base_blend">Base Blend</option>
            <option value="carrier_oil">Carrier Oil</option>
            <option value="active_oil">Active Oil</option>
            <option value="botanical_extract">Botanical Extract</option>
            <option value="fragrance">Fragrance</option>
            <option value="powder">Powder</option>
          </select>
        </label>
        <label>
          <span>Description</span>
          <textarea name="description" />
        </label>
      </>
    );
  if (kind === "formula")
    return (
      <>
        <label>
          <span>Product</span>
          <select name="productId" required>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Formula name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Basis</span>
          <select name="formulaBasis">
            <option value="volume_percentage">Volume Percentage</option>
            <option value="weight_percentage">Weight Percentage</option>
          </select>
        </label>
        <label>
          <span>Default fill size</span>
          <input
            name="defaultBottleSize"
            inputMode="decimal"
            defaultValue="2"
            required
          />
        </label>
        <label>
          <span>Fill unit</span>
          <select name="defaultBottleSizeUnit">
            <option value="us_fluid_ounces">US Fluid Ounces</option>
            <option value="milliliters">Milliliters</option>
            <option value="grams">Grams</option>
          </select>
        </label>
        <label>
          <span>Default count</span>
          <input
            name="defaultBottleCount"
            type="number"
            min="1"
            defaultValue="20"
          />
        </label>
        <label>
          <span>Overage %</span>
          <input
            name="defaultOveragePercent"
            inputMode="decimal"
            defaultValue="5"
          />
        </label>
      </>
    );
  if (kind === "experiment")
    return <ExperimentCreateFields products={products} formulas={formulas} />;
  if (kind === "product-note")
    return (
      <>
        <label>
          <span>Product</span>
          <select name="productId" required>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Note type</span>
          <select name="noteType">
            <option value="general">General</option>
            <option value="research">Research</option>
            <option value="product_idea">Product Idea</option>
            <option value="testing">Testing</option>
          </select>
        </label>
        <label>
          <span>Title</span>
          <input name="name" required />
        </label>
        <label>
          <span>Content</span>
          <textarea name="content" required />
        </label>
      </>
    );
  return (
    <>
      <label>
        <span>Product</span>
        <select name="productId" required>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Decision title</span>
        <input name="name" required />
      </label>
      <label>
        <span>Decision</span>
        <textarea name="decision" required />
      </label>
      <label>
        <span>Reason</span>
        <textarea name="reason" required />
      </label>
      <label>
        <span>Decision date</span>
        <input name="decisionDate" type="date" required />
      </label>
    </>
  );
}

function ExperimentCreateFields({
  products,
  formulas,
}: {
  products: DevelopmentSnapshot["products"];
  formulas: DevelopmentSnapshot["formulas"];
}) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const available = formulas.filter(
    (formula) => formula.productId === productId,
  );
  const [formulaVersionId, setFormulaVersionId] = useState(
    formulas.find((formula) => formula.productId === productId)?.versionId ??
      "",
  );
  const [size, setSize] = useState("2");
  const formula =
    formulas.find((item) => item.versionId === formulaVersionId) ??
    available[0];
  const unit =
    formula?.formulaBasis === "weight_percentage" ? "grams" : "us_fluid_ounces";
  let preview: ReturnType<typeof calculateBatch> | null = null;
  try {
    if (formula && size)
      preview = calculateBatch({
        basis: formula.formulaBasis,
        bottleCount: 1,
        bottleSize: size,
        bottleSizeUnit: unit,
        overagePercent: "0",
        ingredients: formula.ingredients.map((line) => ({
          id: line.id,
          name: line.ingredientName,
          percentage: line.percentage,
          densityGramsPerMl: line.densityGramsPerMl,
        })),
      });
  } catch {
    preview = null;
  }
  return (
    <>
      <label>
        <span>Product</span>
        <select
          name="productId"
          required
          value={productId}
          onChange={(event) => {
            const next = event.target.value;
            setProductId(next);
            setFormulaVersionId(
              formulas.find((item) => item.productId === next)?.versionId ?? "",
            );
          }}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Formula version</span>
        <select
          name="formulaVersionId"
          required
          value={formula?.versionId ?? ""}
          onChange={(event) => setFormulaVersionId(event.target.value)}
        >
          {available.map((item) => (
            <option key={item.versionId} value={item.versionId}>
              {item.familyName} · {item.version}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Name</span>
        <input name="name" required />
      </label>
      <label>
        <span>Objective</span>
        <textarea name="objective" required />
      </label>
      <label>
        <span>Hypothesis</span>
        <textarea name="hypothesis" required />
      </label>
      <label>
        <span>Test batch size</span>
        <input
          name="testBatchSize"
          inputMode="decimal"
          required
          value={size}
          onChange={(event) => setSize(event.target.value)}
        />
      </label>
      <label>
        <span>Unit</span>
        <select
          name="testBatchUnit"
          value={unit}
          onChange={() => undefined}
          aria-readonly="true"
        >
          <option value={unit}>
            {unit === "grams" ? "Grams" : "US Fluid Ounces"}
          </option>
        </select>
      </label>
      <div className="calculation-preview">
        <strong>Calculated ingredient amounts</strong>
        {preview ? (
          <ul>
            {preview.ingredients.map((line) => (
              <li key={line.id}>
                {line.name}: {unit === "grams" ? line.grams : line.fluidOunces}{" "}
                {unit === "grams" ? "g" : "fl oz"}
              </li>
            ))}
          </ul>
        ) : (
          <p>Choose a compatible formula and positive batch size.</p>
        )}
      </div>
    </>
  );
}

function buildPayload(
  kind: CreateAction["kind"],
  form: FormData,
): Record<string, unknown> {
  const value = (name: string) => String(form.get(name) ?? "");
  if (kind === "product-line")
    return {
      name: value("name"),
      slug: value("slug"),
      description: value("description"),
      accentTheme: value("accentTheme"),
    };
  if (kind === "product")
    return {
      action: "create_product",
      data: {
        productLineId: value("productLineId"),
        name: value("name"),
        slug: value("slug"),
        description: value("description") || null,
        productType: value("productType"),
        developmentPath: value("developmentPath"),
        pipelineStatus: "idea",
        priority: "standard",
      },
    };
  if (kind === "ingredient")
    return {
      action: "create_ingredient",
      data: {
        commonName: value("name"),
        inciName: value("inciName") || null,
        category: value("category"),
        description: value("description") || null,
        functions: [],
      },
    };
  if (kind === "formula")
    return {
      action: "create_formula",
      data: {
        productId: value("productId"),
        name: value("name"),
        description: null,
        formulaBasis: value("formulaBasis"),
        defaultBottleSize: value("defaultBottleSize"),
        defaultBottleSizeUnit: value("defaultBottleSizeUnit"),
        defaultBottleCount: Number(value("defaultBottleCount")),
        defaultOveragePercent: value("defaultOveragePercent"),
      },
    };
  if (kind === "experiment")
    return {
      action: "create_experiment",
      productId: value("productId"),
      formulaVersionId: value("formulaVersionId"),
      name: value("name"),
      objective: value("objective"),
      hypothesis: value("hypothesis"),
      testBatchSize: value("testBatchSize"),
      testBatchUnit: value("testBatchUnit"),
    };
  if (kind === "product-note")
    return {
      action: "add_product_note",
      productId: value("productId"),
      noteType: value("noteType"),
      title: value("name"),
      content: value("content"),
    };
  return {
    action: "record_product_decision",
    productId: value("productId"),
    title: value("name"),
    decision: value("decision"),
    reason: value("reason"),
    decisionDate: value("decisionDate"),
  };
}
