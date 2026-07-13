import { productLineSeedDefinitions } from "@/src/domain/product-lines/product-line-seeds";
import { CommandCore } from "@/src/presentation/components/command-core";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import { generateAttentionItems } from "@/src/domain/development/pipeline";
import { labelFor } from "@/src/domain/development/development";
import { asRoute } from "@/src/navigation/as-route";
import { QuickCreateButton } from "@/src/presentation/command/quick-create-button";
import Link from "next/link";

const operatingSystems = [
  {
    id: "create",
    label: "Create",
    eyebrow: "Research to decision",
    body: "Research, ideas, formulas, R&D, and product refinement—held together by visible evidence and decisions.",
  },
  {
    id: "build",
    label: "Build",
    eyebrow: "Source to readiness",
    body: "Ingredients, suppliers, manufacturers, packaging, costing, and launch preparation without hidden assumptions.",
  },
  {
    id: "control",
    label: "Control",
    eyebrow: "Material to release",
    body: "Inventory, production, quality, traceability, and records preserved as controlled operational history.",
  },
  {
    id: "scale",
    label: "Scale",
    eyebrow: "Launch to intelligence",
    body: "Shopify, performance, forecasting, product decisions, and growth grounded in trusted source data.",
  },
] as const;

export default async function HomePage() {
  const snapshot = await loadDevelopmentSnapshot();
  const productCounts = {
    reserve: snapshot.products.filter(
      (product) =>
        product.productLineSlug === "legacy-reserve" && product.active,
    ).length,
    sanctum: snapshot.products.filter(
      (product) =>
        product.productLineSlug === "legacy-sanctum" && product.active,
    ).length,
    active: snapshot.products.filter((product) => product.active).length,
    launched: snapshot.products.filter(
      (product) => product.pipelineStatus === "launched",
    ).length,
    research: snapshot.products.filter(
      (product) => product.pipelineStatus === "research",
    ).length,
    development: snapshot.products.filter((product) =>
      ["product_brief", "formulation", "testing", "refinement"].includes(
        product.pipelineStatus,
      ),
    ).length,
  };
  const formulaSummaries = snapshot.formulas.map((formula) => ({
    ...formula,
    total: formulaTotal(formula.ingredients.map((line) => line.percentage)),
  }));
  const attention = generateAttentionItems({
    products: snapshot.products.map((product) => ({
      ...product,
      formulaCount: snapshot.formulas.filter(
        (formula) => formula.productId === product.id,
      ).length,
    })),
    formulas: formulaSummaries.map((formula) => ({
      id: formula.versionId,
      name: formula.familyName,
      totalPercentage: formula.total.total,
      productionStepCount: formula.productionSteps.length,
    })),
  });
  return (
    <div className="command-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            Legacy House · Groomed Gent Co. Product Intelligence OS
          </p>
          <h1 id="hero-title">The house behind every product.</h1>
          <p className="hero-intro">
            The command center behind every Groomed Gent Co. product—from first
            idea to market performance.
          </p>
          <a className="text-link" href="#operating-systems">
            Enter the operating systems <span aria-hidden="true">↓</span>
          </a>
        </div>
        <CommandCore />
      </section>

      <section
        className="system-section"
        id="operating-systems"
        aria-labelledby="systems-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Four permanent pillars</p>
          <h2 id="systems-title">A disciplined path from creation to scale.</h2>
          <p>
            Each operating system shares one source of truth while protecting
            the controls unique to its work.
          </p>
        </div>
        <div className="system-grid">
          {operatingSystems.map((system, index) => (
            <article className="system-card" id={system.id} key={system.id}>
              <span className="system-index" aria-hidden="true">
                0{index + 1}
              </span>
              <p className="card-eyebrow">{system.eyebrow}</p>
              <h3>{system.label}</h3>
              <p>{system.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="command-development"
        aria-labelledby="portfolio-title"
      >
        <div className="section-heading compact-heading">
          <p className="eyebrow">Create pillar · real records</p>
          <h2 id="portfolio-title">Product development command</h2>
          <p>
            {snapshot.persistence === "database"
              ? "Counts are loaded from PostgreSQL."
              : "Counts reflect approved canonical Phase 02 definitions; persistence is unavailable."}
          </p>
        </div>
        <div className="command-metric-grid">
          {Object.entries(productCounts).map(([name, value]) => (
            <article key={name}>
              <span>{labelFor(name)}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
        <div className="command-panels">
          <article>
            <p className="card-eyebrow">Formula status</p>
            <h3>
              {snapshot.formulas.length} controlled version
              {snapshot.formulas.length === 1 ? "" : "s"}
            </h3>
            <dl>
              {[
                "draft",
                "experimental",
                "under_review",
                "production_ready",
              ].map((status) => (
                <div key={status}>
                  <dt>{labelFor(status)}</dt>
                  <dd>
                    {
                      snapshot.formulas.filter(
                        (formula) => formula.status === status,
                      ).length
                    }
                  </dd>
                </div>
              ))}
            </dl>
          </article>
          <article>
            <p className="card-eyebrow">R&D attention</p>
            <h3>
              {snapshot.experiments.length
                ? "Experiment activity"
                : "No experiments recorded"}
            </h3>
            <dl>
              <div>
                <dt>Planned</dt>
                <dd>
                  {
                    snapshot.experiments.filter(
                      (item) => item.status === "planned",
                    ).length
                  }
                </dd>
              </div>
              <div>
                <dt>Active</dt>
                <dd>
                  {
                    snapshot.experiments.filter((item) =>
                      ["in_progress", "resting", "observation_period"].includes(
                        item.status,
                      ),
                    ).length
                  }
                </dd>
              </div>
              <div>
                <dt>Needs revision or failed</dt>
                <dd>
                  {
                    snapshot.experiments.filter((item) =>
                      ["needs_revision", "failed"].includes(item.result),
                    ).length
                  }
                </dd>
              </div>
            </dl>
          </article>
          <article className="attention-command">
            <p className="card-eyebrow">Needs attention</p>
            <h3>
              {attention.length} deterministic item
              {attention.length === 1 ? "" : "s"}
            </h3>
            <ul>
              {attention.slice(0, 6).map((item, index) => (
                <li key={`${item.entityId}:${index}`}>
                  <strong>{item.label}</strong>
                  <span>{item.reason}</span>
                </li>
              ))}
            </ul>
          </article>
          <article>
            <p className="card-eyebrow">Recent activity</p>
            <h3>
              {snapshot.activity.length
                ? "Recorded changes"
                : "No persisted activity"}
            </h3>
            {snapshot.activity.length ? (
              <ul>
                {snapshot.activity.slice(0, 5).map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            ) : (
              <p>Seed definitions do not manufacture history.</p>
            )}
          </article>
        </div>
        <div className="quick-actions" aria-label="Quick actions">
          <QuickCreateButton kind="product">Create Product</QuickCreateButton>
          <QuickCreateButton kind="formula">Create Formula</QuickCreateButton>
          <QuickCreateButton kind="ingredient">
            Add Ingredient
          </QuickCreateButton>
          <QuickCreateButton kind="experiment">
            Create Experiment
          </QuickCreateButton>
          <QuickCreateButton kind="product-note">
            Add Product Note
          </QuickCreateButton>
          <QuickCreateButton kind="product-decision">
            Record Decision
          </QuickCreateButton>
          {snapshot.formulas[0] ? (
            <Link
              className="quick-action"
              href={asRoute(
                `/formulas/${snapshot.formulas[0].versionId}#batch-calculator`,
              )}
            >
              Calculate Legacy Reserve Batch
            </Link>
          ) : null}
        </div>
      </section>

      <section
        className="foundation-dashboard"
        aria-labelledby="foundation-dashboard-title"
      >
        <div className="section-heading compact-heading">
          <p className="eyebrow">Foundation view</p>
          <h2 id="foundation-dashboard-title">
            Known context. Honest readiness.
          </h2>
          <p>
            The command surface shows configured identity and system state
            without manufacturing product activity or performance.
          </p>
        </div>
        <div className="foundation-grid">
          <article className="readiness-panel">
            <div className="panel-heading">
              <span>01</span>
              <div>
                <p className="card-eyebrow">Product-line identity</p>
                <h3>Established lines</h3>
              </div>
            </div>
            <div className="product-line-list">
              {productLineSeedDefinitions.map((line) => (
                <div
                  className={`product-line-identity theme-${line.accentTheme}`}
                  key={line.id}
                >
                  <span aria-hidden="true" />
                  <div>
                    <strong>{line.name}</strong>
                    <p>{line.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
          <article className="readiness-panel">
            <div className="panel-heading">
              <span>02</span>
              <div>
                <p className="card-eyebrow">Phase status</p>
                <h3>Phase 02 authorized</h3>
              </div>
            </div>
            <dl className="readiness-list">
              <div>
                <dt>Application</dt>
                <dd>
                  <span className="status-dot positive" aria-hidden="true" />
                  Operational
                </dd>
              </div>
              <div>
                <dt>Documentation</dt>
                <dd>
                  <span className="status-dot positive" aria-hidden="true" />
                  Established
                </dd>
              </div>
              <div>
                <dt>Database</dt>
                <dd>
                  <span className="status-dot caution" aria-hidden="true" />
                  Configuration required
                </dd>
              </div>
              <div>
                <dt>Business records</dt>
                <dd>
                  <span className="status-dot neutral" aria-hidden="true" />
                  Canonical definitions loaded
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      <section className="foundation-note" aria-labelledby="foundation-title">
        <p className="eyebrow">Create phase</p>
        <h2 id="foundation-title">Product memory before operational scale.</h2>
        <p>
          Phase 02 connects supplied product planning, formulas, ingredients,
          calculations, experiments, notes, and decisions without entering
          sourcing, inventory, quality, commerce, or fabricated history.
        </p>
      </section>
      <footer>
        <p>Legacy House</p>
        <p>Private operating system · Groomed Gent Co.</p>
      </footer>
    </div>
  );
}
