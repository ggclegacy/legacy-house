import Link from "next/link";
import { notFound } from "next/navigation";

import { labelFor } from "@/src/domain/development/development";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import { asRoute } from "@/src/navigation/as-route";
import { PersistenceBanner } from "@/src/presentation/development/persistence-banner";
import { ProductBriefEditor } from "@/src/presentation/development/product-brief-editor";
import { DecisionJournal } from "@/src/presentation/development/decision-journal";
import { ProductControls } from "@/src/presentation/development/product-controls";
import { ProductMemoryForms } from "@/src/presentation/development/product-memory-forms";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";

const tabs = [
  "Overview",
  "Product Brief",
  "Development",
  "Formulas",
  "Ingredients",
  "Sourcing",
  "Inventory",
  "Production",
  "Quality",
  "Launch",
  "Market",
  "Documents",
  "Decisions",
] as const;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const snapshot = await loadDevelopmentSnapshot();
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
  const missing = [
    !product.targetCustomer && "Target customer",
    !product.problemToSolve && "Problem to solve",
    !product.desiredBenefits && "Desired benefits",
    product.developmentPath === "custom_formula" &&
      formulas.length === 0 &&
      "Custom formula",
  ].filter(Boolean) as string[];
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
        </div>
      </header>
      <PersistenceBanner persistence={snapshot.persistence} />
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
      <nav className="record-tabs" aria-label="Product workspace tabs">
        {tabs.map((tab) => {
          const implemented = [
            "Overview",
            "Product Brief",
            "Development",
            "Formulas",
            "Ingredients",
            "Decisions",
          ].includes(tab);
          return (
            <a
              key={tab}
              href={
                implemented
                  ? `#${tab.toLocaleLowerCase().replaceAll(" ", "-")}`
                  : "#future-phases"
              }
              aria-disabled={!implemented}
            >
              {tab}
              {!implemented ? " · Later" : ""}
            </a>
          );
        })}
      </nav>

      <section id="overview" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Overview</p>
          <h2>Product intent and readiness</h2>
        </div>
        <div className="overview-grid">
          <dl className="fact-list">
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
              <dt>Current stage</dt>
              <dd>{labelFor(product.pipelineStatus)}</dd>
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
              <dt>Target retail</dt>
              <dd>{product.targetRetailPrice ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Maximum target COGS</dt>
              <dd>{product.maximumTargetCogs ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Target packaging</dt>
              <dd>{product.targetPackaging ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Target launch</dt>
              <dd>{product.targetLaunchDate ?? "Not entered"}</dd>
            </div>
            <div>
              <dt>Active formula</dt>
              <dd>
                {formulas.find(
                  (formula) => formula.activeVersionId === formula.versionId,
                )?.familyName ?? "Not linked"}
              </dd>
            </div>
            <div>
              <dt>Recent note</dt>
              <dd>{notes[0]?.title ?? "None recorded"}</dd>
            </div>
            <div>
              <dt>Recent decision</dt>
              <dd>{decisions[0]?.title ?? "None recorded"}</dd>
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
              Next manual action:{" "}
              {missing.length
                ? `Enter ${missing[0]}.`
                : formulas.length
                  ? "Review the active formula and recorded decisions."
                  : "Create an appropriate formula only if the development path requires it."}
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
        {activity.length ? (
          <ol className="activity-timeline">
            {activity.map((event) => (
              <li key={event.id}>
                <time>{new Date(event.createdAt).toLocaleDateString()}</time>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="record-empty">
            <strong>No persisted development activity.</strong>
            <p>Seed definitions do not manufacture activity history.</p>
          </div>
        )}
        <div className="memory-list">
          {notes.map((note) => (
            <article key={note.id}>
              <p className="card-eyebrow">{labelFor(note.noteType)}</p>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
            </article>
          ))}
        </div>
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
        />
      </section>

      <section id="future-phases" className="workspace-section phase-boundary">
        <p className="eyebrow">Protected future scope</p>
        <h2>Sourcing through Market remain phase-aware.</h2>
        <p>
          Those tabs are permanent orientation points, but Phase 02 does not
          create suppliers, inventory, production consumption, quality,
          launches, market data, or fake controls.
        </p>
      </section>
    </div>
  );
}
