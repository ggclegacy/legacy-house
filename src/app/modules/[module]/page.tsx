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
import { CommercialHub } from "@/src/presentation/commercial/commercial-hub";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";

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

  if (
    [
      "suppliers",
      "manufacturers",
      "packaging",
      "costing",
      "documents",
    ].includes(destination.id)
  ) {
    const snapshot = await loadCommercialSnapshot();
    return (
      <div className="destination-page commercial-page">
        <header className="destination-header">
          <p className="eyebrow">Build · Phase 03</p>
          <h1>{destination.label}</h1>
          <p>{destination.summary}</p>
        </header>
        <PersistenceBanner persistence={snapshot.persistence} />
        <CommercialHub
          area={
            destination.id as
              | "suppliers"
              | "manufacturers"
              | "packaging"
              | "costing"
              | "documents"
          }
          snapshot={snapshot}
        />
      </div>
    );
  }

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
