"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  developmentPaths,
  labelFor,
  pipelineStatuses,
  productPriorities,
} from "@/src/domain/development/development";
import {
  pipelineGroupFor,
  pipelineGroups,
} from "@/src/domain/development/pipeline";
import type {
  DevelopmentFormula,
  DevelopmentProduct,
} from "@/src/domain/development/snapshot";
import { asRoute } from "@/src/navigation/as-route";

type View = "board" | "list" | "product_line";

export function ProductPipelineView({
  products,
  formulas,
  persistence,
}: {
  products: readonly DevelopmentProduct[];
  formulas: readonly DevelopmentFormula[];
  persistence: "database" | "unavailable";
}) {
  const [view, setView] = useState<View>("board");
  const [query, setQuery] = useState("");
  const [line, setLine] = useState("all");
  const [path, setPath] = useState("all");
  const [stage, setStage] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("recent");
  const [feedback, setFeedback] = useState<string | null>(null);
  const filtered = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.active &&
            [product.name, product.description, product.productLineName]
              .join(" ")
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()) &&
            (line === "all" || product.productLineSlug === line) &&
            (path === "all" || product.developmentPath === path) &&
            (stage === "all" ||
              pipelineGroupFor(product.pipelineStatus) === stage) &&
            (priority === "all" || product.priority === priority),
        )
        .sort((left, right) =>
          sort === "name"
            ? left.name.localeCompare(right.name)
            : (right.updatedAt ?? "").localeCompare(left.updatedAt ?? ""),
        ),
    [line, path, priority, products, query, sort, stage],
  );

  async function changeStatus(product: DevelopmentProduct, next: string) {
    const response = await fetch("/api/development/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_product_status",
        productId: product.id,
        pipelineStatus: next,
        expectedUpdatedAt: product.updatedAt ?? undefined,
      }),
    });
    const body = (await response.json()) as { error?: string };
    setFeedback(
      response.ok
        ? `${product.name} moved to ${labelFor(next)}. Refreshing…`
        : (body.error ?? "Status was not changed."),
    );
    if (response.ok) window.location.reload();
  }

  async function archiveProduct(product: DevelopmentProduct) {
    const response = await fetch("/api/development/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "archive_product",
        productId: product.id,
      }),
    });
    const body = (await response.json()) as { error?: string };
    setFeedback(
      response.ok
        ? `${product.name} archived. Refreshing…`
        : (body.error ?? "Product was not archived."),
    );
    if (response.ok) window.location.reload();
  }

  const lines = [
    ...new Map(
      products.map((item) => [item.productLineSlug, item.productLineName]),
    ).entries(),
  ];
  return (
    <>
      <div className="view-toolbar" aria-label="Product pipeline controls">
        <div className="segmented-control" aria-label="Pipeline view">
          {(["board", "list", "product_line"] as const).map((option) => (
            <button
              type="button"
              key={option}
              aria-pressed={view === option}
              onClick={() => setView(option)}
            >
              {option === "product_line"
                ? "Product-line view"
                : labelFor(option)}
            </button>
          ))}
        </div>
        <label className="filter-search">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
          />
        </label>
        <select
          aria-label="Filter product line"
          value={line}
          onChange={(event) => setLine(event.target.value)}
        >
          <option value="all">All product lines</option>
          {lines.map(([value, name]) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort products"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="recent">Recently updated</option>
          <option value="name">Product name</option>
        </select>
        <select
          aria-label="Filter development path"
          value={path}
          onChange={(event) => setPath(event.target.value)}
        >
          <option value="all">All development paths</option>
          {developmentPaths.map((value) => (
            <option key={value} value={value}>
              {labelFor(value)}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter Command stage"
          value={stage}
          onChange={(event) => setStage(event.target.value)}
        >
          <option value="all">All Command stages</option>
          {Object.keys(pipelineGroups).map((value) => (
            <option key={value} value={value}>
              {labelFor(value)}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="all">All priorities</option>
          {productPriorities.map((value) => (
            <option key={value} value={value}>
              {labelFor(value)}
            </option>
          ))}
        </select>
      </div>
      {feedback ? (
        <div className="inline-feedback" role="status">
          {feedback}
        </div>
      ) : null}
      {view === "board" ? (
        <>
          <div className="pipeline-board">
            {Object.keys(pipelineGroups).map((group) => {
              const groupProducts = filtered.filter(
                (product) => pipelineGroupFor(product.pipelineStatus) === group,
              );
              return (
                <section
                  key={group}
                  className="pipeline-column"
                  aria-labelledby={`pipeline-${group}`}
                >
                  <header>
                    <h2 id={`pipeline-${group}`}>{labelFor(group)}</h2>
                    <span>{groupProducts.length}</span>
                  </header>
                  {groupProducts.length ? (
                    groupProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        persistence={persistence}
                        formula={formulas.find(
                          (formula) =>
                            formula.productId === product.id &&
                            formula.activeVersionId === formula.versionId,
                        )}
                        changeStatus={changeStatus}
                        archiveProduct={archiveProduct}
                      />
                    ))
                  ) : (
                    <p className="column-empty">No products in this stage.</p>
                  )}
                </section>
              );
            })}
          </div>
          <div
            className="pipeline-mobile-list"
            aria-label="Focused product list"
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                persistence={persistence}
                formula={formulas.find(
                  (formula) =>
                    formula.productId === product.id &&
                    formula.activeVersionId === formula.versionId,
                )}
                changeStatus={changeStatus}
                archiveProduct={archiveProduct}
              />
            ))}
          </div>
        </>
      ) : view === "product_line" ? (
        <div className="line-view">
          {lines.map(([slug, name]) => (
            <section key={slug}>
              <header>
                <h2>{name}</h2>
                <span>
                  {
                    filtered.filter((item) => item.productLineSlug === slug)
                      .length
                  }{" "}
                  products
                </span>
              </header>
              <div className="record-grid">
                {filtered
                  .filter((item) => item.productLineSlug === slug)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      persistence={persistence}
                      formula={formulas.find(
                        (formula) =>
                          formula.productId === product.id &&
                          formula.activeVersionId === formula.versionId,
                      )}
                      changeStatus={changeStatus}
                      archiveProduct={archiveProduct}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div
          className="responsive-table"
          role="region"
          aria-label="Product list"
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Line</th>
                <th>Path</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link href={asRoute(`/products/${product.slug}`)}>
                      {product.name}
                    </Link>
                  </td>
                  <td>{product.productLineName}</td>
                  <td>{labelFor(product.developmentPath)}</td>
                  <td>{labelFor(product.pipelineStatus)}</td>
                  <td>{labelFor(product.priority)}</td>
                  <td>
                    {product.updatedAt
                      ? new Date(product.updatedAt).toLocaleDateString()
                      : "Not persisted"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!filtered.length ? (
        <div className="record-empty">
          <strong>No products match these filters.</strong>
          <p>
            Clear a filter or search for another supplied or persisted product.
          </p>
        </div>
      ) : null}
    </>
  );
}

function ProductCard({
  product,
  persistence,
  formula,
  changeStatus,
  archiveProduct,
}: {
  product: DevelopmentProduct;
  persistence: "database" | "unavailable";
  formula?: DevelopmentFormula;
  changeStatus: (product: DevelopmentProduct, next: string) => Promise<void>;
  archiveProduct: (product: DevelopmentProduct) => Promise<void>;
}) {
  const [confirmArchive, setConfirmArchive] = useState(false);
  const blockers = [
    !product.targetCustomer,
    !product.problemToSolve,
    !product.desiredBenefits,
    product.developmentPath === "custom_formula" && !formula,
  ].filter(Boolean).length;
  return (
    <article
      className={`product-card theme-${product.productLineSlug === "legacy-reserve" ? "reserve" : "sanctum"}`}
    >
      <p className="card-eyebrow">{product.productLineName}</p>
      <h3>
        <Link href={asRoute(`/products/${product.slug}`)}>{product.name}</Link>
      </h3>
      <dl>
        <div>
          <dt>Path</dt>
          <dd>{labelFor(product.developmentPath)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{labelFor(product.pipelineStatus)}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{labelFor(product.priority)}</dd>
        </div>
        <div>
          <dt>Active formula</dt>
          <dd>{formula ? labelFor(formula.status) : "Not linked"}</dd>
        </div>
        <div>
          <dt>Development gaps</dt>
          <dd>{blockers}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>
            {product.updatedAt
              ? new Date(product.updatedAt).toLocaleDateString()
              : "Not persisted"}
          </dd>
        </div>
      </dl>
      {product.targetLaunchDate ? (
        <p>Target launch: {product.targetLaunchDate}</p>
      ) : null}
      <label className="card-status-control">
        <span>Move status</span>
        <select
          value={product.pipelineStatus}
          disabled={persistence !== "database"}
          onChange={(event) => void changeStatus(product, event.target.value)}
        >
          {pipelineStatuses.map((status) => (
            <option value={status} key={status}>
              {labelFor(status)}
            </option>
          ))}
        </select>
      </label>
      {persistence !== "database" ? (
        <small>Database required for status changes.</small>
      ) : null}
      <div className="product-card-actions">
        <Link className="text-link" href={asRoute(`/products/${product.slug}`)}>
          Open product →
        </Link>
        {confirmArchive ? (
          <div
            className="archive-confirmation"
            role="group"
            aria-label={`Archive ${product.name}`}
          >
            <span>Preserve history and remove from the active pipeline?</span>
            <button
              type="button"
              className="button-secondary"
              onClick={() => setConfirmArchive(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => void archiveProduct(product)}
            >
              Confirm archive
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="text-button"
            disabled={persistence !== "database"}
            onClick={() => setConfirmArchive(true)}
          >
            Archive product
          </button>
        )}
      </div>
    </article>
  );
}
