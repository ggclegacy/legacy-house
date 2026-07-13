import Link from "next/link";
import { notFound } from "next/navigation";

import { labelFor } from "@/src/domain/development/development";
import { pipelineGroupFor } from "@/src/domain/development/pipeline";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import { asRoute } from "@/src/navigation/as-route";
import { PersistenceBanner } from "@/src/presentation/development/persistence-banner";
import { ProductBriefEditor } from "@/src/presentation/development/product-brief-editor";
import { DecisionJournal } from "@/src/presentation/development/decision-journal";
import { ProductControls } from "@/src/presentation/development/product-controls";
import { ProductMemoryForms } from "@/src/presentation/development/product-memory-forms";
import { ProductNotes } from "@/src/presentation/development/product-notes";
import { ProductDevelopmentTimeline } from "@/src/presentation/development/product-development-timeline";
import { ProductBuildNavigation } from "@/src/presentation/development/product-build-navigation";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [snapshot, commercial] = await Promise.all([
    loadDevelopmentSnapshot(),
    loadCommercialSnapshot(),
  ]);
  const product = snapshot.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const formulas = snapshot.formulas.filter(
    (formula) => formula.productId === product.id,
  );
  const ingredientIds = new Set(
    formulas.flatMap((formula) =>
      formula.ingredients.map((line) => line.ingredientId),
    ),
  );
  const usedIngredients = snapshot.ingredients.filter((ingredient) =>
    ingredientIds.has(ingredient.id),
  );
  const notes = snapshot.notes.filter((note) => note.productId === product.id);
  const decisions = snapshot.decisions.filter(
    (decision) => decision.productId === product.id,
  );
  const productExperiments = snapshot.experiments.filter(
    (experiment) => experiment.productId === product.id,
  );
  const activity = snapshot.activity.filter(
    (event) =>
      event.entityId === product.id ||
      formulas.some((formula) => formula.versionId === event.entityId) ||
      productExperiments.some((experiment) => experiment.id === event.entityId),
  );
  const activeFormula = formulas.find(
    (formula) => formula.activeVersionId === formula.versionId,
  );
  const selectedCandidate = commercial.candidates.find(
    (candidate) =>
      candidate.productId === product.id && candidate.status === "selected",
  );
  const selectedManufacturer = selectedCandidate
    ? commercial.manufacturers.find(
        (manufacturer) => manufacturer.id === selectedCandidate.manufacturerId,
      )
    : undefined;
  const selectedCatalogProduct = selectedCandidate?.manufacturerCatalogProductId
    ? commercial.catalogProducts.find(
        (catalogProduct) =>
          catalogProduct.id === selectedCandidate.manufacturerCatalogProductId,
      )
    : undefined;
  const activeConfiguration = commercial.configurations.find(
    (configuration) =>
      configuration.productId === product.id && configuration.active,
  );
  const recentNote = [...notes].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  )[0];
  const recentDecision = [...decisions].sort((left, right) =>
    right.decisionDate.localeCompare(left.decisionDate),
  )[0];
  const missing = [
    !product.targetCustomer && "Target customer",
    !product.problemToSolve && "Problem to solve",
    !product.desiredBenefits && "Desired benefits",
    product.developmentPath === "custom_formula" &&
      formulas.length === 0 &&
      "Custom formula",
  ].filter(Boolean) as string[];
  const nextAction = missing.length
    ? `Enter ${missing[0]} in the Product Brief.`
    : product.developmentPath === "custom_formula" && !activeFormula
      ? "Create the first formula family."
      : product.developmentPath !== "custom_formula" && !selectedCandidate
        ? "Research and select a manufacturer or catalog source."
        : !activeConfiguration
          ? "Define an active finished configuration."
          : "Review recorded evidence before advancing the detailed status.";
  const continueHref = missing.length
    ? "#product-brief"
    : product.developmentPath === "custom_formula" && !activeFormula
      ? "#formulas"
      : product.developmentPath !== "custom_formula" && !selectedCandidate
        ? "#sourcing"
        : !activeConfiguration
          ? "#sourcing"
          : "#development";
  return (
    <div className="destination-page product-workspace">
      <header className="record-header">
        <div>
          <p className="eyebrow">
            {product.productLineName} · Product workspace
          </p>
          <h1>{product.name}</h1>
          <p>{product.description ?? "Description not entered."}</p>
        </div>
        <div className="record-header-status">
          <span>{labelFor(product.pipelineStatus)}</span>
          <span>{labelFor(product.developmentPath)}</span>
          <span>{labelFor(product.priority)} priority</span>
          {product.targetLaunchDate ? (
            <span>Target {product.targetLaunchDate}</span>
          ) : null}
          <div className="record-header-actions">
            <a className="button-secondary" href="#product-controls">
              Edit Product
            </a>
            <a className="button" href={continueHref}>
              Continue Build
            </a>
          </div>
        </div>
      </header>
      <PersistenceBanner persistence={snapshot.persistence} />
      <div id="product-controls" className="product-controls-anchor">
        <ProductControls
          product={product}
          productLines={[
            ...new Map(
              snapshot.products.map((item) => [
                item.productLineId,
                item.productLineName,
              ]),
            ).entries(),
          ].map(([id, name]) => ({ id, name }))}
          persistence={snapshot.persistence}
        />
      </div>
      <ProductBuildNavigation
        productSlug={product.slug}
        developmentPath={product.developmentPath}
      />

      <section id="overview" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Overview</p>
          <h2>Product intent and current build context</h2>
        </div>
        <div className="overview-grid">
          <dl className="fact-list">
            <div>
              <dt>Description</dt>
              <dd>{product.description ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Product line</dt>
              <dd>{product.productLineName}</dd>
            </div>
            <div>
              <dt>Product type</dt>
              <dd>
                {product.productType
                  ? labelFor(product.productType)
                  : "Not entered"}
              </dd>
            </div>
            <div>
              <dt>Development path</dt>
              <dd>{labelFor(product.developmentPath)}</dd>
            </div>
            <div>
              <dt>Current build stage</dt>
              <dd>{labelFor(pipelineGroupFor(product.pipelineStatus))}</dd>
            </div>
            <div>
              <dt>Target customer</dt>
              <dd>{product.targetCustomer ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Problem to solve</dt>
              <dd>{product.problemToSolve ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Desired benefits</dt>
              <dd>{product.desiredBenefits ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Active formula</dt>
              <dd>{activeFormula?.familyName ?? "Not linked"}</dd>
            </div>
            <div>
              <dt>Selected white-label source</dt>
              <dd>
                {selectedManufacturer
                  ? `${selectedManufacturer.name}${selectedCatalogProduct ? ` · ${selectedCatalogProduct.name}` : ""}`
                  : "Not selected"}
              </dd>
            </div>
            <div>
              <dt>Active finished configuration</dt>
              <dd>{activeConfiguration?.name ?? "Not configured"}</dd>
            </div>
            <div>
              <dt>Recent note</dt>
              <dd>{recentNote?.title ?? "None recorded"}</dd>
            </div>
            <div>
              <dt>Recent decision</dt>
              <dd>{recentDecision?.title ?? "None recorded"}</dd>
            </div>
          </dl>
          <aside className="attention-panel">
            <p className="card-eyebrow">Missing development information</p>
            <h3>
              {missing.length
                ? `${missing.length} deterministic gaps`
                : "Core brief context entered"}
            </h3>
            {missing.length ? (
              <ul>
                {missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <p>
              <strong>Next grounded manual action:</strong> {nextAction}
            </p>
          </aside>
        </div>
      </section>

      <section id="product-brief" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Product brief</p>
          <h2>Structured founder intent</h2>
          <p>
            Safe text drafts are preserved locally; PostgreSQL remains
            authoritative after explicit save.
          </p>
        </div>
        <ProductBriefEditor
          product={product}
          brief={snapshot.briefs.find(
            (brief) => brief.productId === product.id,
          )}
          persistence={snapshot.persistence}
        />
      </section>

      <section id="development" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Development</p>
          <h2>Actual timeline and notes</h2>
        </div>
        <ProductDevelopmentTimeline
          events={activity}
          productName={product.name}
          productSlug={product.slug}
          formulas={formulas}
          experiments={productExperiments}
        />
        <ProductNotes notes={notes} persistence={snapshot.persistence} />
        <ProductMemoryForms
          productId={product.id}
          persistence={snapshot.persistence}
          kind="note"
        />
      </section>

      <section id="formulas" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Formulas</p>
          <h2>Version-specific composition</h2>
        </div>
        <div className="record-grid">
          {formulas.map((formula) => {
            const total = formulaTotal(
              formula.ingredients.map((line) => line.percentage),
            );
            return (
              <article key={formula.versionId}>
                <p className="card-eyebrow">
                  Version {formula.version} · {labelFor(formula.status)}
                </p>
                <h3>{formula.familyName}</h3>
                <p>
                  {total.total}% · {labelFor(total.state)}
                </p>
                <Link
                  className="text-link"
                  href={asRoute(`/formulas/${formula.versionId}`)}
                >
                  Open formula →
                </Link>
              </article>
            );
          })}
        </div>
        {!formulas.length ? (
          <div className="record-empty">
            <strong>No formula linked.</strong>
            <p>
              This is valid for white-label planning; do not invent a formula.
            </p>
          </div>
        ) : null}
      </section>

      <section id="ingredients" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Ingredients</p>
          <h2>Master records used by this product</h2>
        </div>
        <div className="record-grid">
          {usedIngredients.map((ingredient) => (
            <article key={ingredient.id}>
              <p className="card-eyebrow">{labelFor(ingredient.category)}</p>
              <h3>
                <Link href={asRoute(`/ingredients/${ingredient.id}`)}>
                  {ingredient.commonName}
                </Link>
              </h3>
              <p>{ingredient.description ?? "Not entered"}</p>
            </article>
          ))}
        </div>
        {!usedIngredients.length ? (
          <div className="record-empty">
            <strong>No ingredient relationships.</strong>
          </div>
        ) : null}
      </section>

      <section id="decisions" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Founder Decision Journal</p>
          <h2>Institutional memory</h2>
        </div>
        <DecisionJournal
          decisions={decisions}
          persistence={snapshot.persistence}
        />
        {!decisions.length ? (
          <div className="record-empty">
            <strong>No decisions recorded.</strong>
            <p>Canonical seed data does not invent founder reasoning.</p>
          </div>
        ) : null}
        <ProductMemoryForms
          productId={product.id}
          persistence={snapshot.persistence}
          kind="decision"
        />
      </section>

      <section id="sourcing" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Commercial workspace</p>
          <h2>Sourcing, configuration, costing, and readiness</h2>
        </div>
        <dl className="fact-list">
          <div>
            <dt>Supplier options</dt>
            <dd>
              {
                commercial.supplierProducts.filter((r) =>
                  usedIngredients.some((i) => i.id === r.ingredientId),
                ).length
              }
            </dd>
          </div>
          <div>
            <dt>Manufacturer candidates</dt>
            <dd>
              {
                commercial.candidates.filter((r) => r.productId === product.id)
                  .length
              }
            </dd>
          </div>
          <div>
            <dt>Finished configurations</dt>
            <dd>
              {
                commercial.configurations.filter(
                  (r) => r.productId === product.id,
                ).length
              }
            </dd>
          </div>
          <div>
            <dt>Cost snapshots</dt>
            <dd>
              {
                commercial.snapshots.filter((r) =>
                  commercial.configurations.some(
                    (c) =>
                      c.productId === product.id &&
                      c.id === r.finishedProductConfigurationId,
                  ),
                ).length
              }
            </dd>
          </div>
        </dl>
        <p>
          {product.developmentPath === "custom_formula"
            ? "Supplier coverage is evaluated against formula ingredients."
            : "A manufacturer candidate is required; an internal formula is not."}
        </p>
      </section>
      <section id="documents" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Documents</p>
          <h2>Linked commercial evidence</h2>
        </div>
        <p>
          {commercial.documentLinks.filter(
            (r) => r.entityType === "product" && r.entityId === product.id,
          ).length
            ? "Linked document metadata is available in the Document Vault."
            : "No documents linked. Missing evidence remains explicit."}
        </p>
      </section>

      <section id="future-phases" className="workspace-section phase-boundary">
        <p className="eyebrow">Protected future scope</p>
        <h2>Inventory through Market remain phase-aware.</h2>
        <p>
          Those tabs are permanent orientation points, but Phase 03 does not
          create inventory, production consumption, quality, launches, market
          data, or fake controls.
        </p>
      </section>
    </div>
  );
}
