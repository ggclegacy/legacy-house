import Link from "next/link";

import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import { asRoute } from "@/src/navigation/as-route";

function newestFormula(snapshot: DevelopmentSnapshot) {
  return (
    snapshot.formulas.find(
      (formula) => formula.activeVersionId === formula.versionId,
    ) ??
    snapshot.formulas[0] ??
    null
  );
}

export function ResearchFormulaLab({
  development,
}: {
  development: DevelopmentSnapshot;
}) {
  const formula = newestFormula(development);
  const product = formula
    ? (development.products.find((item) => item.id === formula.productId) ??
      null)
    : null;
  const experiment = formula
    ? (development.experiments.find(
        (item) =>
          item.formulaVersionId === formula.versionId ||
          item.productId === formula.productId,
      ) ?? null)
    : null;
  const formulaIngredientIds = new Set(
    formula?.ingredients.map((line) => line.ingredientId) ?? [],
  );
  const ingredientRecords = development.ingredients.filter((ingredient) =>
    formulaIngredientIds.has(ingredient.id),
  );
  const total = formula
    ? formulaTotal(formula.ingredients.map((line) => line.percentage))
    : null;

  return (
    <section
      className="command-workspace command-lab"
      aria-labelledby="research-formula-lab-title"
    >
      <header className="command-section-heading">
        <div>
          <p className="eyebrow">Create · Formulation chamber</p>
          <h2 id="research-formula-lab-title">Research &amp; Formula Lab</h2>
        </div>
        <p>
          Enter the active formula, experiment evidence, or ingredient record.
        </p>
      </header>

      <div
        className="command-workspace-grid"
        role="region"
        aria-label="Formula lab modules"
        tabIndex={0}
      >
        <article className="command-feature command-formula-feature">
          <span className="command-feature-index" aria-hidden="true">
            01
          </span>
          <div>
            <p className="card-eyebrow">Active formula</p>
            {formula ? (
              <>
                <h3>{formula.familyName}</h3>
                <p>{formula.productName}</p>
                <dl className="command-fact-row">
                  <div>
                    <dt>Version</dt>
                    <dd>{formula.version}</dd>
                  </div>
                  <div>
                    <dt>State</dt>
                    <dd>{labelFor(formula.status)}</dd>
                  </div>
                  <div>
                    <dt>Composition</dt>
                    <dd>
                      {total?.total}% · {labelFor(total?.state ?? "invalid")}
                    </dd>
                  </div>
                  <div>
                    <dt>Ingredients</dt>
                    <dd>{formula.ingredients.length}</dd>
                  </div>
                </dl>
                <Link
                  className="command-inline-action"
                  href={asRoute(`/formulas/${formula.versionId}`)}
                >
                  Open active formula
                </Link>
              </>
            ) : (
              <div className="command-honest-empty">
                <h3>No formula is recorded.</h3>
                <p>White-label products do not require an invented formula.</p>
              </div>
            )}
          </div>
        </article>

        <article className="command-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ◇
          </span>
          <p className="card-eyebrow">Experiment / R&amp;D</p>
          {experiment ? (
            <>
              <h3>{experiment.name}</h3>
              <p>
                {experiment.experimentNumber} · {labelFor(experiment.status)}
              </p>
              <Link href={asRoute(`/experiments/${experiment.id}`)}>
                Open experiment
              </Link>
            </>
          ) : (
            <>
              <h3>No experiment recorded</h3>
              <p>
                {product
                  ? `No R&D experiment is linked to ${product.name}.`
                  : "No formula-linked experiment is available."}
              </p>
              <Link href="/modules/r-and-d">Open R&amp;D Lab</Link>
            </>
          )}
        </article>

        <article className="command-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ⟡
          </span>
          <p className="card-eyebrow">Ingredient research</p>
          <h3>
            {formula
              ? `${ingredientRecords.length} linked research records`
              : "No active formula context"}
          </h3>
          <p>
            {ingredientRecords[0]
              ? `${ingredientRecords[0].commonName} and ${Math.max(ingredientRecords.length - 1, 0)} additional formula ingredients are available in the library.`
              : "Ingredient research remains available without fabricating formula usage."}
          </p>
          <Link href="/modules/ingredients">Open ingredient library</Link>
        </article>
      </div>

      <nav className="command-tool-rail" aria-label="Formula lab tools">
        <span>Lab tools</span>
        <Link href="/modules/formula-vault">Open Formula Vault</Link>
        <Link href="/modules/formula-vault">Compare Formulas</Link>
        <Link href="/modules/ingredients">Open Ingredient Library</Link>
        {formula ? (
          <Link
            href={asRoute(`/formulas/${formula.versionId}#batch-calculator`)}
          >
            Calculate Legacy Reserve Batch
          </Link>
        ) : (
          <span aria-disabled="true">Batch calculator unavailable</span>
        )}
      </nav>
    </section>
  );
}
