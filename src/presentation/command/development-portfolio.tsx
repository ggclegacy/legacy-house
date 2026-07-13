"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { labelFor } from "@/src/domain/development/development";
import { asRoute } from "@/src/navigation/as-route";
import {
  developmentPortfolioStages,
  type DevelopmentPortfolioModel,
  type PortfolioProduct,
  type PortfolioStageId,
} from "@/src/services/command/development-portfolio";

import { QuickCreateButton } from "./quick-create-button";

const visibleProductLimit = 6;

function StageIcon({
  kind,
}: {
  kind: (typeof developmentPortfolioStages)[number]["icon"];
}) {
  if (kind === "spark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
      </svg>
    );
  }
  if (kind === "search") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 5 5" />
      </svg>
    );
  }
  if (kind === "vessel") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3h8M10 3v6l-4 8.3A2.5 2.5 0 0 0 8.3 21h7.4a2.5 2.5 0 0 0 2.3-3.7L14 9V3M8 16h8" />
      </svg>
    );
  }
  if (kind === "link") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9.5 14.5-2 2a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0M14.5 9.5l2-2a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0M8.5 15.5l7-7" />
      </svg>
    );
  }
  if (kind === "package") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10" />
      </svg>
    );
  }
  if (kind === "measure") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4zM8 5v4M12 5v2M16 5v4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M10 5h9v9M5 7v12h12" />
    </svg>
  );
}

function ProductCapsule({
  product,
  selected,
  onSelect,
}: {
  product: PortfolioProduct;
  selected: boolean;
  onSelect: () => void;
}) {
  const stage = developmentPortfolioStages.find(
    (item) => item.id === product.stageId,
  );
  return (
    <button
      className="portfolio-capsule"
      type="button"
      data-accent={product.accent}
      aria-pressed={selected}
      aria-label={`Focus ${product.name}, ${stage?.label ?? "stage information incomplete"}`}
      onClick={onSelect}
    >
      <span className="portfolio-capsule-surface">
        <span className="capsule-corner" aria-hidden="true" />
        <span className="capsule-line">{product.productLineName}</span>
        <strong>{product.name}</strong>
        <span className="capsule-path">
          {labelFor(product.developmentPath)}
        </span>
        <span className="capsule-stage">
          <i aria-hidden="true" />
          {stage?.label ?? "Stage information incomplete"}
        </span>
        <small>{product.supportingDetail}</small>
        <span className="capsule-select-state">
          {selected ? "Focused" : "Select product"}
        </span>
      </span>
    </button>
  );
}

export function DevelopmentPortfolio({
  model,
}: {
  model: DevelopmentPortfolioModel;
}) {
  const [lineFilter, setLineFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState<PortfolioStageId | "all">(
    "all",
  );
  const [selectedProductId, setSelectedProductId] = useState(
    model.products[0]?.id ?? "",
  );

  const lineProducts = useMemo(
    () =>
      model.products.filter(
        (product) =>
          lineFilter === "all" || product.productLineId === lineFilter,
      ),
    [lineFilter, model.products],
  );
  const filteredProducts = useMemo(
    () =>
      lineProducts.filter(
        (product) => stageFilter === "all" || product.stageId === stageFilter,
      ),
    [lineProducts, stageFilter],
  );
  const visibleProducts = filteredProducts.slice(0, visibleProductLimit);
  const selectedProduct =
    visibleProducts.find((product) => product.id === selectedProductId) ??
    visibleProducts[0] ??
    null;

  return (
    <section
      className="development-portfolio"
      aria-labelledby="development-portfolio-title"
    >
      <header className="portfolio-heading">
        <div>
          <p className="eyebrow">Development portfolio</p>
          <h2 id="development-portfolio-title">Development Portfolio</h2>
          <p>See every product and where it stands in the build journey.</p>
        </div>
        <Link href="/modules/product-pipeline">View full portfolio</Link>
      </header>

      {model.products.length ? (
        <>
          <div
            className="portfolio-line-filter"
            role="group"
            aria-label="Filter portfolio by product line"
          >
            <button
              type="button"
              aria-pressed={lineFilter === "all"}
              onClick={() => setLineFilter("all")}
            >
              <span aria-hidden="true">00</span>
              All Products
              <strong>{model.products.length}</strong>
            </button>
            {model.productLines.map((line, index) => (
              <button
                key={line.id}
                type="button"
                aria-pressed={lineFilter === line.id}
                onClick={() => setLineFilter(line.id)}
              >
                <span aria-hidden="true">0{index + 1}</span>
                {line.name}
                <strong>
                  {
                    model.products.filter(
                      (product) => product.productLineId === line.id,
                    ).length
                  }
                </strong>
              </button>
            ))}
          </div>

          <div
            className="portfolio-stage-scroller"
            role="region"
            aria-label="Development journey stages"
            tabIndex={0}
          >
            <div className="portfolio-stage-track">
              {developmentPortfolioStages.map((stage, index) => {
                const count = lineProducts.filter(
                  (product) => product.stageId === stage.id,
                ).length;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    aria-pressed={stageFilter === stage.id}
                    aria-label={`${stage.label}, ${count} ${count === 1 ? "product" : "products"}`}
                    onClick={() =>
                      setStageFilter((current) =>
                        current === stage.id ? "all" : stage.id,
                      )
                    }
                  >
                    <span className="stage-sequence" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span className="stage-node-icon">
                      <StageIcon kind={stage.icon} />
                    </span>
                    <strong>{stage.label}</strong>
                    <span className="stage-product-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {visibleProducts.length ? (
            <>
              <div className="portfolio-products-heading">
                <p>
                  {stageFilter === "all"
                    ? "Current portfolio"
                    : developmentPortfolioStages.find(
                        (stage) => stage.id === stageFilter,
                      )?.label}
                </p>
                <span>
                  Showing {visibleProducts.length} of {filteredProducts.length}
                </span>
              </div>
              <div
                className="portfolio-capsule-scroller"
                role="region"
                aria-label="Portfolio products"
                tabIndex={0}
              >
                <div className="portfolio-capsule-rail">
                  {visibleProducts.map((product) => (
                    <ProductCapsule
                      key={product.id}
                      product={product}
                      selected={product.id === selectedProduct?.id}
                      onSelect={() => setSelectedProductId(product.id)}
                    />
                  ))}
                </div>
              </div>
              {selectedProduct ? (
                <div
                  className="portfolio-selected-actions"
                  data-accent={selectedProduct.accent}
                  aria-live="polite"
                >
                  <div>
                    <span>{selectedProduct.productLineName}</span>
                    <strong>{selectedProduct.name}</strong>
                    <small>{selectedProduct.supportingDetail}</small>
                  </div>
                  <nav aria-label={`Actions for ${selectedProduct.name}`}>
                    <Link
                      className="portfolio-primary-action"
                      href={asRoute(selectedProduct.openHref)}
                    >
                      Open product
                    </Link>
                    {selectedProduct.continueHref ? (
                      <Link
                        className="portfolio-secondary-action"
                        href={asRoute(selectedProduct.continueHref)}
                      >
                        Continue build
                      </Link>
                    ) : null}
                  </nav>
                </div>
              ) : null}
            </>
          ) : (
            <div className="portfolio-empty-state">
              <p className="card-eyebrow">Selected stage</p>
              <h3>No products are currently in this stage.</h3>
              <Link href="/modules/product-pipeline">View all products</Link>
            </div>
          )}
        </>
      ) : (
        <div className="portfolio-empty-state portfolio-empty-state-all">
          <p className="card-eyebrow">Portfolio empty</p>
          <h3>No products have entered the portfolio yet.</h3>
          <QuickCreateButton
            kind="product"
            className="portfolio-primary-action"
          >
            Start new product
          </QuickCreateButton>
        </div>
      )}
    </section>
  );
}
