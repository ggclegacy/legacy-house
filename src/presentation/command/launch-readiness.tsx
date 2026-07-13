import Link from "next/link";

import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";
import { buildProductWorkspaceModel } from "@/src/services/command/build-workspace";

interface ReadinessStage {
  label: string;
  complete: boolean;
  detail: string;
}

export function LaunchReadiness({
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
  const product = continuation?.product ?? null;
  const formula = continuation?.formula ?? null;
  const configuration = continuation?.configuration ?? null;
  const candidate = product
    ? (commercial.candidates.find((item) => item.productId === product.id) ??
      null)
    : null;
  const formulaSelections = formula
    ? commercial.supplierSelections.filter(
        (item) => item.formulaVersionId === formula.versionId,
      )
    : [];
  const sourcedLineIds = new Set(
    formulaSelections.map((item) => item.formulaIngredientId),
  );
  const sourceComplete = product
    ? product.developmentPath === "custom_formula"
      ? Boolean(formula)
      : Boolean(candidate)
    : false;
  const sourcingComplete = product
    ? product.developmentPath === "custom_formula"
      ? Boolean(formula?.ingredients.length) &&
        formula!.ingredients.every((line) => sourcedLineIds.has(line.id))
      : Boolean(candidate)
    : false;
  const packagingLinks = configuration
    ? commercial.configurationPackaging.filter(
        (item) => item.finishedProductConfigurationId === configuration.id,
      )
    : [];
  const costSnapshot = configuration
    ? (commercial.snapshots.find(
        (item) => item.finishedProductConfigurationId === configuration.id,
      ) ?? null)
    : null;
  const relatedIds = new Set(
    [product?.id, formula?.versionId, configuration?.id].filter(
      (value): value is string => Boolean(value),
    ),
  );
  const documentCount = new Set(
    commercial.documentLinks
      .filter((item) => relatedIds.has(item.entityId))
      .map((item) => item.documentId),
  ).size;
  const launchReadinessItems = product
    ? commercial.readiness.filter(
        (item) =>
          item.productId === product.id && item.readinessCategory === "launch",
      )
    : [];
  const launchPreparationComplete =
    product?.pipelineStatus === "launch_planning" ||
    product?.pipelineStatus === "launched" ||
    launchReadinessItems.some(
      (item) => item.status === "complete" || item.status === "not_applicable",
    );

  const stages: readonly ReadinessStage[] = [
    {
      label: "Product / Source",
      complete: sourceComplete,
      detail: sourceComplete
        ? product?.developmentPath === "custom_formula"
          ? `Formula ${formula?.version} recorded`
          : "Manufacturer candidate recorded"
        : "Product source incomplete",
    },
    {
      label: "Sourcing",
      complete: sourcingComplete,
      detail: sourcingComplete
        ? "Required source selections recorded"
        : "Source selections incomplete",
    },
    {
      label: "Packaging",
      complete: packagingLinks.length > 0,
      detail: packagingLinks.length
        ? `${packagingLinks.length} configuration components linked`
        : "Packaging components not linked",
    },
    {
      label: "Costing",
      complete: Boolean(costSnapshot),
      detail: costSnapshot ? "Cost snapshot recorded" : "Cost snapshot missing",
    },
    {
      label: "Documentation",
      complete: documentCount > 0,
      detail: documentCount
        ? `${documentCount} linked documents`
        : "Commercial documents not linked",
    },
    {
      label: "Launch Preparation",
      complete: launchPreparationComplete,
      detail: launchPreparationComplete
        ? "Recorded launch preparation complete"
        : "Launch preparation not recorded",
    },
  ];
  const completed = stages.filter((stage) => stage.complete).length;

  return (
    <section
      className="command-workspace launch-readiness"
      aria-labelledby="launch-readiness-title"
    >
      <header className="command-section-heading">
        <div>
          <p className="eyebrow">Scale · Final build chamber</p>
          <h2 id="launch-readiness-title">Launch Readiness</h2>
        </div>
        <p>
          See recorded build evidence without implying a Phase 06 launch
          approval.
        </p>
      </header>

      <article className="launch-readiness-chamber">
        <div className="launch-product">
          <p className="card-eyebrow">Product nearest to launch</p>
          {product ? (
            <>
              <h3>{product.name}</h3>
              <p>
                {product.productLineName} · {labelFor(product.pipelineStatus)}
              </p>
              <strong>
                {completed} completed · {stages.length - completed} incomplete
              </strong>
            </>
          ) : (
            <div className="command-honest-empty">
              <h3>No active product is available.</h3>
              <p>Readiness requires a real active product record.</p>
            </div>
          )}
        </div>

        <ol className="readiness-path" aria-label="Product readiness path">
          {stages.map((stage, index) => (
            <li key={stage.label} data-complete={stage.complete}>
              <span className="readiness-marker" aria-hidden="true">
                {stage.complete ? "✓" : String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong>{stage.label}</strong>
                <span>{stage.complete ? "Complete" : "Incomplete"}</span>
                <small>{stage.detail}</small>
              </div>
            </li>
          ))}
        </ol>

        <nav className="launch-actions" aria-label="Launch readiness actions">
          {product ? (
            <Link href={asRoute(`/products/${product.slug}`)}>
              Open Product
            </Link>
          ) : null}
          {formula ? (
            <Link href={asRoute(`/formulas/${formula.versionId}`)}>
              Continue Build
            </Link>
          ) : configuration ? (
            <Link href={asRoute(`/configurations/${configuration.id}`)}>
              Continue Build
            </Link>
          ) : null}
          <Link href="/modules/costing#readiness-heading">Open Readiness</Link>
          <Link href="/modules/product-pipeline">View Launch Products</Link>
        </nav>
      </article>
    </section>
  );
}
