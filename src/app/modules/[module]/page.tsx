import { notFound } from "next/navigation";

import {
  getNavigationDestination,
  navigationDestinations,
} from "@/src/navigation/navigation-registry";
import { FormulaVaultView } from "@/src/presentation/development/formula-vault-view";
import { IngredientLibraryView } from "@/src/presentation/development/ingredient-library-view";
import { PersistenceBanner } from "@/src/presentation/development/persistence-banner";
import { ProductPipelineView } from "@/src/presentation/development/product-pipeline-view";
import { RndLabView } from "@/src/presentation/development/rnd-lab-view";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";

export function generateStaticParams() {
  return navigationDestinations
    .filter((destination) => destination.href.startsWith("/modules/"))
    .map((destination) => ({ module: destination.id }));
}

export default async function ModuleDestinationPage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const destination = getNavigationDestination(module);
  if (!destination || !destination.href.startsWith("/modules/")) notFound();

  if (
    ["product-pipeline", "formula-vault", "ingredients", "r-and-d"].includes(
      destination.id,
    )
  ) {
    const snapshot = await loadDevelopmentSnapshot();
    return (
      <div className="destination-page development-page">
        <header className="destination-header">
          <p className="eyebrow">Create · Phase 02</p>
          <h1>{destination.label}</h1>
          <p>{destination.summary}</p>
        </header>
        <PersistenceBanner persistence={snapshot.persistence} />
        {destination.id === "product-pipeline" ? (
          <ProductPipelineView
            products={snapshot.products}
            formulas={snapshot.formulas}
            persistence={snapshot.persistence}
          />
        ) : null}
        {destination.id === "formula-vault" ? (
          <FormulaVaultView formulas={snapshot.formulas} />
        ) : null}
        {destination.id === "ingredients" ? (
          <IngredientLibraryView
            ingredients={snapshot.ingredients}
            usedIngredientIds={[
              ...new Set(
                snapshot.formulas.flatMap((formula) =>
                  formula.ingredients.map((line) => line.ingredientId),
                ),
              ),
            ]}
          />
        ) : null}
        {destination.id === "r-and-d" ? (
          <RndLabView experiments={snapshot.experiments} />
        ) : null}
      </div>
    );
  }

  const isDocuments = destination.id === "documents";
  return (
    <div className="destination-page">
      <header className="destination-header">
        <p className="eyebrow">
          {destination.group} · Scheduled Phase {destination.phase}
        </p>
        <h1>{destination.label}</h1>
        <p>{destination.summary}</p>
      </header>
      <section className="module-boundary" aria-labelledby="boundary-title">
        <div>
          <p className="card-eyebrow">Documented boundary</p>
          <h2 id="boundary-title">A destination with a protected scope.</h2>
        </div>
        <p>
          This section is present so navigation, search, access patterns, and
          future architecture have a stable home. Its operational workflows
          begin only in Phase {destination.phase}; Phase 01 does not create
          placeholder records or pretend those controls exist.
        </p>
      </section>
      {isDocuments ? (
        <section className="document-map" aria-labelledby="document-map-title">
          <p className="card-eyebrow">Repository operating system</p>
          <h2 id="document-map-title">Authoritative project records</h2>
          <div>
            <article id="build-status">
              <strong>BUILD_STATUS.md</strong>
              <p>
                Evidence-backed current phase, validation, limitations, and next
                action.
              </p>
            </article>
            <article id="architecture">
              <strong>ARCHITECTURE_DECISIONS.md</strong>
              <p>Durable architecture and data-integrity decisions.</p>
            </article>
            <article>
              <strong>docs/MASTER_BUILD_PLAN.md</strong>
              <p>Dependency-ordered product roadmap and stop conditions.</p>
            </article>
            <article>
              <strong>docs/BRAND_SYSTEM.md</strong>
              <p>
                Permanent visual, motion, component, and accessibility rules.
              </p>
            </article>
          </div>
        </section>
      ) : null}
      <section className="module-readiness" aria-labelledby="readiness-title">
        <p className="card-eyebrow">Current readiness</p>
        <h2 id="readiness-title">Foundation established</h2>
        <dl>
          <div>
            <dt>Route and navigation</dt>
            <dd>Operational</dd>
          </div>
          <div>
            <dt>Domain workflow</dt>
            <dd>Reserved for Phase {destination.phase}</dd>
          </div>
          <div>
            <dt>Business data</dt>
            <dd>None created</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
