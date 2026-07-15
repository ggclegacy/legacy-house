import Link from "next/link";

import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";

export function ProductionHome({
  development,
}: {
  development: DevelopmentSnapshot;
}) {
  const formula =
    development.formulas.find(
      (item) =>
        item.activeVersionId === item.versionId &&
        item.status === "production_ready",
    ) ?? null;

  return (
    <div className="production-home">
      <header className="production-module-header">
        <p className="eyebrow">Control · Production</p>
        <h1>Production</h1>
        <p>Prepare an exact formula batch without posting inventory usage.</p>
      </header>

      {formula ? (
        <article className="production-active-formula">
          <div>
            <p className="card-eyebrow">Active production formula</p>
            <h2>{formula.productName}</h2>
            <p>
              Formula {formula.version} · {formula.productLineName}
            </p>
          </div>
          <dl>
            <div>
              <dt>Production status</dt>
              <dd>{labelFor(formula.status)}</dd>
            </div>
            <div>
              <dt>Formula basis</dt>
              <dd>{labelFor(formula.formulaBasis)}</dd>
            </div>
            <div>
              <dt>Default bottle</dt>
              <dd>
                {formula.defaultBottleSize ?? "Not entered"}{" "}
                {formula.defaultBottleSizeUnit
                  ? labelFor(formula.defaultBottleSizeUnit)
                  : ""}
              </dd>
            </div>
            <div>
              <dt>Default overage</dt>
              <dd>{formula.defaultOveragePercent ?? "Not entered"}%</dd>
            </div>
          </dl>
          <nav aria-label="Active formula actions">
            <Link
              className="button production-build-action"
              href={asRoute(
                `/production/batch-builder?formula=${formula.versionId}`,
              )}
            >
              Build Batch
            </Link>
            <Link
              className="button-secondary"
              href={asRoute(`/formulas/${formula.versionId}`)}
            >
              Open Formula
            </Link>
            <Link
              className="production-vault-link"
              href="/modules/formula-vault"
            >
              Formula Vault
            </Link>
          </nav>
        </article>
      ) : (
        <section
          className="production-setup-state"
          aria-labelledby="production-setup-title"
        >
          <p className="card-eyebrow">Setup required</p>
          <h2 id="production-setup-title">No active production formula</h2>
          <p>
            A production-ready active formula is required before a batch can be
            built.
          </p>
          <Link className="button" href="/modules/formula-vault">
            Open Formula Vault
          </Link>
        </section>
      )}
    </div>
  );
}
