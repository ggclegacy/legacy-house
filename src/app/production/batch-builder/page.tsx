import Link from "next/link";

import { asRoute } from "@/src/navigation/as-route";
import { BatchCalculator } from "@/src/presentation/development/batch-calculator";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";

export default async function BatchBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ formula?: string }>;
}) {
  const query = await searchParams;
  const development = await loadDevelopmentSnapshot();
  const formula =
    development.formulas.find(
      (item) =>
        item.versionId === query.formula ||
        (!query.formula && item.activeVersionId === item.versionId),
    ) ?? null;

  return (
    <div className="production-builder-page">
      <header className="production-builder-header">
        <p className="eyebrow">Production · Batch Builder</p>
        <h1>Exact Batch Builder</h1>
        <p>
          Scale one exact formula version without consuming or reserving
          inventory.
        </p>
      </header>
      {formula ? (
        <section aria-labelledby="builder-formula-title">
          <div className="production-builder-context">
            <div>
              <p className="card-eyebrow">Selected formula</p>
              <h2 id="builder-formula-title">{formula.productName}</h2>
              <p>Formula {formula.version}</p>
            </div>
            <Link href={asRoute(`/formulas/${formula.versionId}`)}>
              Open Formula
            </Link>
          </div>
          <BatchCalculator
            formula={formula}
            batchModeHref="/production/batch-mode"
          />
        </section>
      ) : (
        <section className="production-setup-state">
          <h2>No selected formula is available.</h2>
          <p>Choose an active formula from the Formula Vault.</p>
          <Link className="button" href="/modules/formula-vault">
            Open Formula Vault
          </Link>
        </section>
      )}
    </div>
  );
}
