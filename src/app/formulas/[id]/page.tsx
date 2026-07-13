import Link from "next/link";
import { notFound } from "next/navigation";

import { labelFor } from "@/src/domain/development/development";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import { asRoute } from "@/src/navigation/as-route";
import { compareFormulaVersions } from "@/src/domain/formulas/versioning";
import { BatchCalculator } from "@/src/presentation/development/batch-calculator";
import { FormulaControls } from "@/src/presentation/development/formula-controls";
import { PersistenceBanner } from "@/src/presentation/development/persistence-banner";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";
import { loadCommercialSnapshot } from "@/src/services/commercial/load-commercial";

export default async function FormulaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [snapshot, commercial] = await Promise.all([
    loadDevelopmentSnapshot(),
    loadCommercialSnapshot(),
  ]);
  const formula = snapshot.formulas.find((item) => item.versionId === id);
  if (!formula) notFound();
  const versions = snapshot.formulas.filter(
    (item) => item.familyId === formula.familyId,
  );
  const previous = formula.previousVersionId
    ? versions.find((item) => item.versionId === formula.previousVersionId)
    : undefined;
  const total = formulaTotal(
    formula.ingredients.map((line) => line.percentage),
  );
  const comparison = previous
    ? compareFormulaVersions(
        {
          id: previous.versionId,
          version: previous.version,
          status: previous.status,
          formulaBasis: previous.formulaBasis,
          defaultBottleSize: previous.defaultBottleSize,
          defaultBottleSizeUnit: previous.defaultBottleSizeUnit,
          defaultBottleCount: previous.defaultBottleCount,
          defaultOveragePercent: previous.defaultOveragePercent,
          ingredients: previous.ingredients,
          productionSteps: previous.productionSteps,
        },
        {
          id: formula.versionId,
          version: formula.version,
          status: formula.status,
          formulaBasis: formula.formulaBasis,
          defaultBottleSize: formula.defaultBottleSize,
          defaultBottleSizeUnit: formula.defaultBottleSizeUnit,
          defaultBottleCount: formula.defaultBottleCount,
          defaultOveragePercent: formula.defaultOveragePercent,
          ingredients: formula.ingredients,
          productionSteps: formula.productionSteps,
        },
      )
    : null;
  const experiments = snapshot.experiments.filter(
    (experiment) => experiment.formulaVersionId === formula.versionId,
  );
  return (
    <div className="destination-page formula-workspace">
      <header className="record-header">
        <div>
          <p className="eyebrow">
            {formula.productLineName} ·{" "}
            <Link href={asRoute(`/products/${formula.productSlug}`)}>
              {formula.productName}
            </Link>
          </p>
          <h1>{formula.familyName}</h1>
          <p>
            Version {formula.version} · {labelFor(formula.formulaBasis)}
          </p>
        </div>
        <div className="record-header-status">
          <span>{labelFor(formula.status)}</span>
          <span className={`formula-state ${total.state}`}>
            {total.total}% · {labelFor(total.state)}
          </span>
        </div>
      </header>
      <PersistenceBanner persistence={snapshot.persistence} />
      <nav className="record-tabs" aria-label="Formula tabs">
        <a href="#composition">Composition</a>
        <a href="#batch-calculator">Batch Calculator</a>
        <a href="#production-steps">Production Steps</a>
        <a href="#version-history">Version History</a>
        <a href="#experiments">Experiments</a>
        <a href="#supplier-selections">Supplier Selections</a>
        <a href="#notes">Notes</a>
      </nav>
      <section id="composition" className="workspace-section">
        <FormulaControls
          formula={formula}
          ingredients={snapshot.ingredients}
          persistence={snapshot.persistence}
        />
      </section>
      <section id="batch-calculator" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Batch Calculator</p>
          <h2>Unit-safe production worksheet</h2>
          <p>
            Volume and weight bases remain explicit. Grams are unavailable for
            volume formulas until a valid ingredient density exists.
          </p>
        </div>
        <BatchCalculator formula={formula} />
      </section>
      <section id="production-steps" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Production Steps</p>
          <h2>Version-specific instructions</h2>
        </div>
        {formula.productionSteps.length ? (
          <ol className="production-step-list">
            {formula.productionSteps.map((step) => (
              <li key={step.id}>
                <span>{step.stepNumber}</span>
                <div>
                  <p className="card-eyebrow">
                    {step.phase}
                    {step.required ? " · Required" : ""}
                  </p>
                  <h3>{step.instruction}</h3>
                  <p>{step.notes}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="record-empty">
            <strong>Production steps not entered.</strong>
            <p>
              No steps were invented for the canonical formula because none were
              supplied in the repository.
            </p>
          </div>
        )}
      </section>
      <section id="version-history" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Version History</p>
          <h2>Immutable formula lineage</h2>
        </div>
        <div className="version-list">
          {versions.map((version) => (
            <article key={version.versionId}>
              <span>
                {version.versionId === formula.versionId
                  ? "Current"
                  : "Historical"}
              </span>
              <h3>
                <Link href={asRoute(`/formulas/${version.versionId}`)}>
                  Version {version.version}
                </Link>
              </h3>
              <p>
                {labelFor(version.status)} ·{" "}
                {version.changeReason ?? "Change reason not entered"}
              </p>
            </article>
          ))}
        </div>
        {comparison ? (
          <div className="comparison-panel">
            <h3>Changes from version {previous?.version}</h3>
            <p>
              Added: {comparison.added.length} · Removed:{" "}
              {comparison.removed.length} · Percentage changes:{" "}
              {comparison.changed.length} · Steps changed:{" "}
              {comparison.productionStepsChanged ? "Yes" : "No"}
            </p>
            <p>
              Basis: {labelFor(previous?.formulaBasis ?? formula.formulaBasis)}{" "}
              → {labelFor(formula.formulaBasis)}
            </p>
            <p>
              Default bottle: {previous?.defaultBottleSize ?? "Not entered"}{" "}
              {previous?.defaultBottleSizeUnit
                ? labelFor(previous.defaultBottleSizeUnit)
                : ""}{" "}
              → {formula.defaultBottleSize ?? "Not entered"}{" "}
              {formula.defaultBottleSizeUnit
                ? labelFor(formula.defaultBottleSizeUnit)
                : ""}
            </p>
            <p>
              Default overage:{" "}
              {previous?.defaultOveragePercent ?? "Not entered"}% →{" "}
              {formula.defaultOveragePercent ?? "Not entered"}%
            </p>
            <p>
              Status: {labelFor(previous?.status ?? "unknown")} →{" "}
              {labelFor(formula.status)} · Change reason:{" "}
              {formula.changeReason ?? "Not entered"}
            </p>
            {comparison.added.map((line) => (
              <p key={`added-${line.ingredientId}`}>
                Added {line.ingredientName} at {line.percentage}%
              </p>
            ))}
            {comparison.removed.map((line) => (
              <p key={`removed-${line.ingredientId}`}>
                Removed {line.ingredientName} ({line.percentage}%)
              </p>
            ))}
            {comparison.changed.map((change) => (
              <p key={change.ingredientId}>
                {change.ingredientName}: {change.before}% → {change.after}%
              </p>
            ))}
          </div>
        ) : (
          <div className="record-empty">
            <strong>No previous version to compare.</strong>
          </div>
        )}
      </section>
      <section id="experiments" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Experiments</p>
          <h2>R&D evidence for this exact version</h2>
        </div>
        {experiments.length ? (
          <div className="record-grid">
            {experiments.map((experiment) => (
              <article key={experiment.id}>
                <p className="card-eyebrow">{experiment.experimentNumber}</p>
                <h3>
                  <Link href={asRoute(`/experiments/${experiment.id}`)}>
                    {experiment.name}
                  </Link>
                </h3>
                <p>{experiment.objective}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="record-empty">
            <strong>No experiments recorded.</strong>
            <p>
              Production-ready status is supplied canonical data, not a claim
              that experiments or safety validation exist in Legacy House.
            </p>
          </div>
        )}
      </section>
      <section id="notes" className="workspace-section phase-boundary">
        <p className="eyebrow">Formula notes</p>
        <h2>
          Use product notes and decisions for current institutional memory.
        </h2>
        <p>
          A dedicated version-note record was not authorized in the Phase 02
          database contract; no duplicate note system was invented.
        </p>
      </section>
      <section id="supplier-selections" className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Formula sourcing</p>
          <h2>Supplier selections and cost blockers</h2>
        </div>
        <div className="record-grid">
          {formula.ingredients.map((line) => {
            const choices = commercial.supplierProducts.filter(
              (r) => r.ingredientId === line.ingredientId,
            );
            const selection = commercial.supplierSelections.find(
              (r) => r.formulaIngredientId === line.id && r.preferred,
            );
            return (
              <article key={line.id}>
                <h3>{line.ingredientName}</h3>
                <p>
                  Preferred:{" "}
                  {selection
                    ? (choices.find((r) => r.id === selection.supplierProductId)
                        ?.name ?? "Linked product unavailable")
                    : "Not selected"}
                </p>
                <p>
                  {choices.length} supplier option
                  {choices.length === 1 ? "" : "s"} ·{" "}
                  {line.densityGramsPerMl
                    ? "Density entered"
                    : "Density unknown"}
                </p>
              </article>
            );
          })}
        </div>
        <p>
          No consumed formula cost is reported until every required supplier
          price and compatible unit conversion is available.
        </p>
      </section>
    </div>
  );
}
