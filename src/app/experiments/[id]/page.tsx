import Link from "next/link";
import { notFound } from "next/navigation";

import { labelFor } from "@/src/domain/development/development";
import { asRoute } from "@/src/navigation/as-route";
import { BatchCalculator } from "@/src/presentation/development/batch-calculator";
import { ExperimentControls } from "@/src/presentation/development/experiment-controls";
import { PersistenceBanner } from "@/src/presentation/development/persistence-banner";
import { loadDevelopmentSnapshot } from "@/src/services/development/load-development";

export default async function ExperimentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snapshot = await loadDevelopmentSnapshot();
  const experiment = snapshot.experiments.find((item) => item.id === id);
  if (!experiment) notFound();
  const product = snapshot.products.find(
    (item) => item.id === experiment.productId,
  );
  const formula = snapshot.formulas.find(
    (item) => item.versionId === experiment.formulaVersionId,
  );
  if (!product || !formula) notFound();
  return (
    <div className="destination-page experiment-workspace">
      <header className="record-header">
        <div>
          <p className="eyebrow">R&D Lab · {experiment.experimentNumber}</p>
          <h1>{experiment.name}</h1>
          <p>
            <Link href={asRoute(`/products/${product.slug}`)}>
              {product.name}
            </Link>{" "}
            ·{" "}
            <Link href={asRoute(`/formulas/${formula.versionId}`)}>
              Formula {formula.version}
            </Link>
          </p>
        </div>
        <div className="record-header-status">
          <span>{labelFor(experiment.status)}</span>
          <span>{labelFor(experiment.result)}</span>
        </div>
      </header>
      <PersistenceBanner persistence={snapshot.persistence} />
      <section className="workspace-section">
        <dl className="fact-list">
          <div>
            <dt>Objective</dt>
            <dd>{experiment.objective}</dd>
          </div>
          <div>
            <dt>Hypothesis</dt>
            <dd>{experiment.hypothesis}</dd>
          </div>
          <div>
            <dt>Production date</dt>
            <dd>{experiment.productionDate ?? "Not entered"}</dd>
          </div>
          <div>
            <dt>Conclusion</dt>
            <dd>{experiment.conclusion ?? "Not entered"}</dd>
          </div>
          <div>
            <dt>Next change</dt>
            <dd>{experiment.nextChange ?? "Not entered"}</dd>
          </div>
          <div>
            <dt>Observations</dt>
            <dd>{experiment.observationCount}</dd>
          </div>
        </dl>
      </section>
      <section className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Test-batch calculation</p>
          <h2>Exact formula version</h2>
        </div>
        <BatchCalculator
          formula={formula}
          initial={{
            count: 1,
            size: experiment.testBatchSize,
            unit: experiment.testBatchUnit,
            overage: "0",
          }}
        />
      </section>
      <section className="workspace-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Production steps</p>
          <h2>Copied from formula version</h2>
        </div>
        {formula.productionSteps.length ? (
          <ol>
            {formula.productionSteps.map((step) => (
              <li key={step.id}>{step.instruction}</li>
            ))}
          </ol>
        ) : (
          <div className="record-empty">
            <strong>No production steps entered.</strong>
          </div>
        )}
      </section>
      <section className="workspace-section">
        <ExperimentControls
          experimentId={experiment.id}
          status={experiment.status}
          persistence={snapshot.persistence}
        />
      </section>
    </div>
  );
}
