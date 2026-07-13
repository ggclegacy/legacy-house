import Link from "next/link";

import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentSnapshot } from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";
import { getNavigationDestination } from "@/src/navigation/navigation-registry";
import { buildProductWorkspaceModel } from "@/src/services/command/build-workspace";

import { QuickCreateButton } from "./quick-create-button";

const creationPaths = [
  {
    name: "Custom Formula",
    detail: "Develop a controlled formula from product intent through review.",
    icon: "formula",
    developmentPath: "custom_formula",
  },
  {
    name: "White-Label",
    detail:
      "Evaluate an existing manufacturer product without inventing a formula.",
    icon: "label",
    developmentPath: "white_label",
  },
  {
    name: "Product Concept",
    detail:
      "Capture a product direction before its development path is decided.",
    icon: "concept",
    developmentPath: "undecided",
  },
] as const;

const stageDestinations = [
  ["Research", "r-and-d"],
  ["Formula", "formula-vault"],
  ["Sourcing", "suppliers"],
  ["Packaging", "packaging"],
  ["Costing", "costing"],
  ["Launch Readiness", "product-pipeline"],
] as const;

function PathIcon({ kind }: { kind: (typeof creationPaths)[number]["icon"] }) {
  if (kind === "formula") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M11 4h10M14 4v7L7.5 24.2A2.6 2.6 0 0 0 9.8 28h12.4a2.6 2.6 0 0 0 2.3-3.8L18 11V4" />
        <path d="M10 21h12" />
      </svg>
    );
  }
  if (kind === "label") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 9h22v18H5zM9 5h14v4M9 14h14M9 19h9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M11 25h10M12 21h8v4M16 4a8 8 0 0 0-4.8 14.4c.7.5.8 1.4.8 2.6h8c0-1.2.1-2.1.8-2.6A8 8 0 0 0 16 4Z" />
      <path d="M16 1v2M5.5 6.5 7 8M25 8l1.5-1.5" />
    </svg>
  );
}

export function ProductBuildWorkspace({
  development,
  commercial,
}: {
  development: DevelopmentSnapshot;
  commercial: CommercialSnapshot;
}) {
  const model = buildProductWorkspaceModel(development, commercial);
  const continuation = model.continuation;

  return (
    <section
      className="product-build-workspace"
      aria-labelledby="product-build-workspace-title"
    >
      <header className="product-build-heading">
        <div>
          <p className="eyebrow">Create · Build control</p>
          <h2 id="product-build-workspace-title">Product Build Workspace</h2>
        </div>
        <p>Continue real product work or begin through one controlled path.</p>
      </header>

      <div className="product-build-primary">
        <article className="continue-building-card">
          <div className="continue-building-signal" aria-hidden="true" />
          <div className="continue-building-copy">
            <p className="card-eyebrow">Continue building</p>
            {continuation ? (
              <>
                <p className="continuation-basis">
                  {continuation.basis === "recently_updated"
                    ? "Recently updated active product"
                    : "Most advanced active product"}
                </p>
                <h3>{continuation.product.name}</h3>
                <p>{continuation.product.productLineName}</p>
                <div className="continuation-facts">
                  <span>{labelFor(continuation.product.pipelineStatus)}</span>
                  <span>{labelFor(continuation.product.developmentPath)}</span>
                  {continuation.formula ? (
                    <span>
                      Formula {continuation.formula.version} ·{" "}
                      {labelFor(continuation.formula.status)}
                    </span>
                  ) : null}
                  {continuation.configuration ? (
                    <span>
                      Active configuration · {continuation.configuration.name}
                    </span>
                  ) : null}
                </div>
                <div className="continuation-actions">
                  <Link
                    className="button-primary"
                    href={asRoute(`/products/${continuation.product.slug}`)}
                  >
                    Continue product
                  </Link>
                  {continuation.formula ? (
                    <Link
                      className="button-secondary"
                      href={asRoute(
                        `/formulas/${continuation.formula.versionId}`,
                      )}
                    >
                      Open formula
                    </Link>
                  ) : continuation.configuration ? (
                    <Link
                      className="button-secondary"
                      href={asRoute(
                        `/configurations/${continuation.configuration.id}`,
                      )}
                    >
                      Open configuration
                    </Link>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="continuation-empty">
                <h3>No active product work</h3>
                <p>
                  Start a controlled product record when the direction is ready.
                </p>
                <QuickCreateButton kind="product" className="button-primary">
                  Start a product
                </QuickCreateButton>
              </div>
            )}
          </div>
        </article>

        <div className="new-product-paths" aria-label="New product paths">
          {creationPaths.map((path, index) => (
            <QuickCreateButton
              key={path.name}
              kind="product"
              className="new-product-path"
              developmentPath={path.developmentPath}
            >
              <span className="path-index">0{index + 1}</span>
              <span className="path-icon">
                <PathIcon kind={path.icon} />
              </span>
              <span className="path-copy">
                <strong>{path.name}</strong>
                <span>{path.detail}</span>
              </span>
              <span className="path-arrow" aria-hidden="true">
                ↗
              </span>
            </QuickCreateButton>
          ))}
        </div>
      </div>

      <div className="product-dock-block">
        <div className="product-dock-heading">
          <div>
            <p className="card-eyebrow">Product dock</p>
            <h3>Active product records</h3>
          </div>
          <Link href="/modules/product-pipeline">View all products</Link>
        </div>
        {model.dockProducts.length ? (
          <div className="product-dock" role="list">
            {model.dockProducts.map((product) => (
              <Link
                key={product.id}
                role="listitem"
                href={asRoute(`/products/${product.slug}`)}
              >
                <span>{product.productLineName}</span>
                <strong>{product.name}</strong>
                <small>
                  {labelFor(product.developmentPath)} ·{" "}
                  {labelFor(product.pipelineStatus)}
                </small>
              </Link>
            ))}
          </div>
        ) : (
          <p className="product-dock-empty">No active products are recorded.</p>
        )}
      </div>

      <nav className="build-stage-rail" aria-label="Product build stages">
        <span className="stage-rail-label">Jump to stage</span>
        <div>
          {stageDestinations.map(([label, id], index) => {
            const destination = getNavigationDestination(id);
            if (!destination) return null;
            return (
              <Link key={id} href={asRoute(destination.href)}>
                <span>0{index + 1}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
