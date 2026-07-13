import Link from "next/link";

import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";
import { buildProductWorkspaceModel } from "@/src/services/command/build-workspace";

import { QuickCreateButton } from "./quick-create-button";

function recorded(value: string | null | undefined) {
  return value ?? "Not recorded";
}

export function CostingMarginStudio({
  development,
  commercial,
}: {
  development: DevelopmentSnapshot;
  commercial: CommercialSnapshot;
}) {
  const continuation = buildProductWorkspaceModel(
    development,
    commercial,
  ).continuation;
  const configuration = continuation?.configuration ?? null;
  const snapshots = configuration
    ? commercial.snapshots
        .filter(
          (item) => item.finishedProductConfigurationId === configuration.id,
        )
        .sort(
          (left, right) =>
            right.calculatedAt.getTime() - left.calculatedAt.getTime(),
        )
    : [];
  const snapshot = snapshots[0] ?? null;
  const scenarios = configuration
    ? commercial.scenarios.filter(
        (item) =>
          item.finishedProductConfigurationId === configuration.id &&
          !item.archivedAt,
      )
    : [];

  return (
    <section
      className="command-workspace command-cost-studio"
      aria-labelledby="costing-margin-title"
    >
      <header className="command-section-heading">
        <div>
          <p className="eyebrow">Build · Commercial architecture</p>
          <h2 id="costing-margin-title">Costing &amp; Margin Studio</h2>
        </div>
        <p>
          Review recorded cost evidence, pricing inputs, and saved scenarios.
        </p>
      </header>

      <div
        className="command-workspace-grid cost-studio-grid"
        role="region"
        aria-label="Costing and margin modules"
        tabIndex={0}
      >
        <article className="command-feature cost-feature">
          <span className="command-feature-index" aria-hidden="true">
            03
          </span>
          <div>
            <p className="card-eyebrow">Current cost workspace</p>
            {configuration ? (
              <>
                <h3>{configuration.name}</h3>
                <p>{continuation?.product.name}</p>
                <dl className="command-fact-row">
                  <div>
                    <dt>Cost evidence</dt>
                    <dd>{snapshot ? "Snapshot recorded" : "Incomplete"}</dd>
                  </div>
                  <div>
                    <dt>Scenarios</dt>
                    <dd>{scenarios.length}</dd>
                  </div>
                  <div>
                    <dt>Retail input</dt>
                    <dd>
                      {recorded(
                        snapshot?.retailPrice ??
                          configuration.targetRetailPrice,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>COGS / unit</dt>
                    <dd>{recorded(snapshot?.fullyLoadedCogsPerUnit)}</dd>
                  </div>
                </dl>
                <Link
                  className="command-inline-action"
                  href={asRoute(`/configurations/${configuration.id}`)}
                >
                  Open configuration
                </Link>
              </>
            ) : (
              <div className="command-honest-empty">
                <h3>No cost workspace is recorded.</h3>
                <p>A finished configuration is required before costing.</p>
              </div>
            )}
          </div>
        </article>

        <article className="command-instrument cost-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ◫
          </span>
          <p className="card-eyebrow">Cost composition</p>
          <h3>{snapshot ? "Recorded cost snapshot" : "COGS not calculated"}</h3>
          <p>
            {snapshot
              ? `Ingredient ${recorded(snapshot.ingredientCostPerUnit)} · Packaging ${recorded(snapshot.packagingCostPerUnit)} · Fully loaded ${snapshot.fullyLoadedCogsPerUnit}`
              : "Ingredient, packaging, labor, fees, and completed-unit costs remain unrecorded."}
          </p>
          <Link href="/modules/costing">Review cost inputs</Link>
        </article>

        <article className="command-instrument cost-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ⟐
          </span>
          <p className="card-eyebrow">Price and margin</p>
          <h3>
            {snapshot?.retailGrossMarginPercent
              ? `${snapshot.retailGrossMarginPercent}% retail margin`
              : "Margin not available"}
          </h3>
          <p>
            {snapshot?.retailPrice
              ? `Retail price ${snapshot.retailPrice} · gross profit ${recorded(snapshot.retailGrossProfitPerUnit)}`
              : "A retail price and fully loaded COGS snapshot are required for margin."}
          </p>
          <Link
            href={
              configuration
                ? asRoute(`/configurations/${configuration.id}`)
                : "/modules/costing"
            }
          >
            Review pricing
          </Link>
        </article>

        <article className="command-instrument cost-instrument">
          <span className="instrument-icon" aria-hidden="true">
            ⌗
          </span>
          <p className="card-eyebrow">Saved scenarios</p>
          <h3>
            {scenarios.length
              ? `${scenarios.length} active scenarios`
              : "No scenarios saved"}
          </h3>
          <p>
            {scenarios[0]
              ? scenarios.map((item) => item.name).join(" · ")
              : "No alternate cost assumptions have been recorded."}
          </p>
          <Link href="/modules/costing">Open cost scenarios</Link>
        </article>
      </div>

      <nav className="command-tool-rail" aria-label="Costing studio tools">
        <span>Studio tools</span>
        <Link href="/modules/costing">Open Costing</Link>
        <QuickCreateButton kind="cost-scenario" className="command-rail-button">
          Run Scenario
        </QuickCreateButton>
        <Link href="/modules/suppliers">Compare Supplier Costs</Link>
        <Link
          href={
            configuration
              ? asRoute(`/configurations/${configuration.id}`)
              : "/modules/costing"
          }
        >
          Review Pricing
        </Link>
      </nav>
    </section>
  );
}
