"use client";

import { useEffect, useRef, useState } from "react";

import {
  createActionRegistry,
  type CreateAction,
} from "@/src/command/create-registry";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
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
  const [preferredDevelopmentPath, setPreferredDevelopmentPath] = useState<
    "custom_formula" | "white_label" | "undecided"
  >("undecided");
  const [snapshot, setSnapshot] = useState<DevelopmentSnapshot | null>(null);
  const [commercial, setCommercial] = useState<CommercialSnapshot | null>(null);
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
      fetch("/api/commercial").then(
        async (response) => (await response.json()) as CommercialSnapshot,
      ),
    ]).then(([development, lines, commercialSnapshot]) => {
      setSnapshot(development);
      setProductLines(lines.productLines);
      setCommercial(commercialSnapshot);
    });
  }, [databaseStatus, open]);
  useEffect(() => {
    const selectRequestedAction = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          kind?: CreateAction["kind"];
          developmentPath?: "custom_formula" | "white_label" | "undecided";
        }>
      ).detail;
      const kind = detail?.kind;
      const requested = createActionRegistry.find((item) => item.kind === kind);
      if (requested) setSelected(requested);
      if (detail?.developmentPath) {
        setPreferredDevelopmentPath(detail.developmentPath);
      }
    };
    window.addEventListener("legacy:create", selectRequestedAction);
    return () =>
      window.removeEventListener("legacy:create", selectRequestedAction);
  }, []);

  async function submit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const payload = buildPayload(selected.kind, formData);
    const commercialKinds: CreateAction["kind"][] = [
      "supplier",
      "supplier-product",
      "manufacturer",
      "catalog-product",
      "quote",
      "packaging",
      "finished-configuration",
      "document",
      "cost-scenario",
    ];
    const endpoint = commercialKinds.includes(selected.kind)
      ? "/api/commercial/actions"
      : selected.kind === "product-line"
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
              commercial={commercial}
              preferredDevelopmentPath={preferredDevelopmentPath}
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
  commercial,
  preferredDevelopmentPath,
}: {
  kind: CreateAction["kind"];
  productLines: { id: string; name: string }[];
  snapshot: DevelopmentSnapshot | null;
  commercial: CommercialSnapshot | null;
  preferredDevelopmentPath: "custom_formula" | "white_label" | "undecided";
}) {
  const products = snapshot?.products ?? [];
  const formulas = snapshot?.formulas ?? [];
  if (
    [
      "supplier",
      "supplier-product",
      "manufacturer",
      "catalog-product",
      "quote",
      "packaging",
      "finished-configuration",
      "document",
      "cost-scenario",
    ].includes(kind)
  )
    return (
      <CommercialCreateFields
        kind={kind}
        development={snapshot}
        commercial={commercial}
      />
    );
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
          <select
            key={preferredDevelopmentPath}
            name="developmentPath"
            defaultValue={preferredDevelopmentPath}
          >
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

function CommercialCreateFields({
  kind,
  development,
  commercial,
}: {
  kind: CreateAction["kind"];
  development: DevelopmentSnapshot | null;
  commercial: CommercialSnapshot | null;
}) {
  const products = development?.products ?? [];
  const ingredients = development?.ingredients ?? [];
  const formulas = development?.formulas ?? [];
  if (kind === "supplier")
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
          <span>Supplier type</span>
          <select name="supplierType">
            <option value="raw_material">Raw material</option>
            <option value="packaging">Packaging</option>
            <option value="white_label">White label</option>
            <option value="general_vendor">General vendor</option>
          </select>
        </label>
        <label>
          <span>Notes</span>
          <textarea name="notes" />
        </label>
      </>
    );
  if (kind === "supplier-product")
    return (
      <>
        <label>
          <span>Supplier</span>
          <select name="supplierId" required>
            {commercial?.suppliers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Master ingredient</span>
          <select name="ingredientId" required>
            {ingredients.map((r) => (
              <option key={r.id} value={r.id}>
                {r.commonName}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Package size</span>
          <input name="packageSize" inputMode="decimal" required />
        </label>
        <label>
          <span>Unit</span>
          <select name="packageSizeUnit">
            <option value="milliliters">Milliliters</option>
            <option value="us_fluid_ounces">US fluid ounces</option>
            <option value="grams">Grams</option>
            <option value="ounces_weight">Ounces weight</option>
            <option value="each">Each</option>
          </select>
        </label>
        <label>
          <span>Package quantity</span>
          <input
            name="packageQuantity"
            inputMode="decimal"
            defaultValue="1"
            required
          />
        </label>
        <label>
          <span>Package price (optional)</span>
          <input name="packagePrice" inputMode="decimal" />
        </label>
        <label>
          <span>Currency when priced</span>
          <input name="currency" defaultValue="USD" maxLength={3} />
        </label>
        <label>
          <span>Price source</span>
          <input name="source" />
        </label>
      </>
    );
  if (kind === "manufacturer")
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
          <span>Type</span>
          <select name="manufacturerType">
            <option value="white_label">White label</option>
            <option value="custom">Custom</option>
            <option value="contract">Contract</option>
            <option value="bulk_blender">Bulk blender</option>
            <option value="supplement">Supplement</option>
          </select>
        </label>
        <label>
          <span>Notes</span>
          <textarea name="notes" />
        </label>
      </>
    );
  if (kind === "catalog-product")
    return (
      <>
        <label>
          <span>Manufacturer</span>
          <select name="manufacturerId" required>
            {commercial?.manufacturers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Notes</span>
          <textarea name="notes" />
        </label>
      </>
    );
  if (kind === "quote")
    return (
      <>
        <label>
          <span>Manufacturer</span>
          <select name="manufacturerId" required>
            {commercial?.manufacturers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Product</span>
          <select name="productId" required>
            {products.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Quote number</span>
          <input name="quoteNumber" required />
        </label>
        <label>
          <span>Quote date</span>
          <input name="quoteDate" type="date" required />
        </label>
        <label>
          <span>Currency</span>
          <input name="currency" defaultValue="USD" required maxLength={3} />
        </label>
      </>
    );
  if (kind === "packaging")
    return (
      <>
        <label>
          <span>Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Component type</span>
          <select name="componentType">
            <option value="bottle">Bottle</option>
            <option value="jar">Jar</option>
            <option value="dropper">Dropper</option>
            <option value="cap">Cap</option>
            <option value="label">Label</option>
            <option value="box">Box</option>
            <option value="tamper_seal">Tamper seal</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          <span>SKU</span>
          <input name="sku" />
        </label>
      </>
    );
  if (kind === "finished-configuration")
    return (
      <>
        <label>
          <span>Product</span>
          <select name="productId" required>
            {products.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Name</span>
          <input name="name" required />
        </label>
        <label>
          <span>Formula version</span>
          <select name="formulaVersionId">
            <option value="">Use catalog product instead</option>
            {formulas.map((r) => (
              <option key={r.versionId} value={r.versionId}>
                {r.familyName} · {r.version}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Catalog product</span>
          <select name="manufacturerCatalogProductId">
            <option value="">Use formula version instead</option>
            {commercial?.catalogProducts.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Fill size</span>
          <input name="fillSize" inputMode="decimal" required />
        </label>
        <label>
          <span>Fill unit</span>
          <select name="fillSizeUnit">
            <option value="us_fluid_ounces">US fluid ounces</option>
            <option value="milliliters">Milliliters</option>
            <option value="grams">Grams</option>
            <option value="each">Each</option>
          </select>
        </label>
      </>
    );
  if (kind === "document")
    return (
      <>
        <div className="error-summary" role="note">
          <strong>Metadata only</strong>
          <p>
            Object storage is not configured in this workspace. Enter metadata
            only for a file that already has a valid storage key.
          </p>
        </div>
        <label>
          <span>Title</span>
          <input name="name" required />
        </label>
        <label>
          <span>Document type</span>
          <select name="documentType">
            <option value="other">Other</option>
            <option value="quote">Quote</option>
            <option value="certificate_of_analysis">
              Certificate of Analysis
            </option>
            <option value="safety_data_sheet">Safety Data Sheet</option>
            <option value="supplement_facts">Supplement Facts</option>
          </select>
        </label>
        <label>
          <span>File name</span>
          <input name="fileName" required />
        </label>
        <label>
          <span>Storage key</span>
          <input name="storageKey" required />
        </label>
        <label>
          <span>MIME type</span>
          <input name="mimeType" required />
        </label>
        <label>
          <span>File size bytes</span>
          <input name="fileSize" type="number" min="0" required />
        </label>
      </>
    );
  return (
    <>
      <label>
        <span>Configuration</span>
        <select name="finishedProductConfigurationId" required>
          {commercial?.configurations.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Name</span>
        <input name="name" required />
      </label>
      <label>
        <span>Description</span>
        <textarea name="description" />
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
  if (kind === "supplier")
    return {
      type: "create_supplier",
      name: value("name"),
      slug: value("slug"),
      supplierType: value("supplierType"),
      notes: value("notes") || undefined,
    };
  if (kind === "supplier-product")
    return {
      type: "create_supplier_product",
      supplierId: value("supplierId"),
      ingredientId: value("ingredientId"),
      name: value("name"),
      packageSize: value("packageSize"),
      packageSizeUnit: value("packageSizeUnit"),
      packageQuantity: value("packageQuantity"),
      packagePrice: value("packagePrice") || undefined,
      currency: value("packagePrice")
        ? value("currency").toUpperCase()
        : undefined,
      source: value("source") || undefined,
    };
  if (kind === "manufacturer")
    return {
      type: "create_manufacturer",
      name: value("name"),
      slug: value("slug"),
      manufacturerType: value("manufacturerType"),
      notes: value("notes") || undefined,
    };
  if (kind === "catalog-product")
    return {
      type: "create_catalog_product",
      manufacturerId: value("manufacturerId"),
      name: value("name"),
      notes: value("notes") || undefined,
    };
  if (kind === "quote")
    return {
      type: "create_quote",
      manufacturerId: value("manufacturerId"),
      productId: value("productId"),
      quoteNumber: value("quoteNumber"),
      quoteDate: value("quoteDate"),
      currency: value("currency").toUpperCase(),
    };
  if (kind === "packaging")
    return {
      type: "create_packaging",
      name: value("name"),
      componentType: value("componentType"),
      sku: value("sku") || undefined,
    };
  if (kind === "finished-configuration")
    return {
      type: "create_configuration",
      productId: value("productId"),
      formulaVersionId: value("formulaVersionId") || null,
      manufacturerCatalogProductId:
        value("manufacturerCatalogProductId") || null,
      name: value("name"),
      fillSize: value("fillSize"),
      fillSizeUnit: value("fillSizeUnit"),
    };
  if (kind === "document")
    return {
      type: "create_document",
      title: value("name"),
      documentType: value("documentType"),
      fileName: value("fileName"),
      storageKey: value("storageKey"),
      mimeType: value("mimeType"),
      fileSize: Number(value("fileSize")),
    };
  if (kind === "cost-scenario")
    return {
      type: "create_cost_scenario",
      finishedProductConfigurationId: value("finishedProductConfigurationId"),
      name: value("name"),
      description: value("description") || undefined,
      scenarioDataJson: {},
    };
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
