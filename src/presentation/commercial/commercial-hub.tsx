"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";

import type { CommercialSnapshot } from "@/src/domain/commercial/snapshot";
import { quoteComparisonBadges } from "@/src/domain/commercial/costing";

type Area =
  "suppliers" | "manufacturers" | "packaging" | "costing" | "documents";

export function CommercialHub({
  area,
  snapshot,
}: {
  area: Area;
  snapshot: CommercialSnapshot;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const includes = (...values: (string | null | undefined)[]) =>
    values.join(" ").toLowerCase().includes(normalized);
  const records = (() => {
    if (area === "suppliers")
      return snapshot.suppliers
        .filter((r) => includes(r.name, r.supplierType, r.status))
        .map((r) => ({
          id: r.id,
          name: r.name,
          meta: `${r.supplierType} · ${r.status}`,
          href: `/suppliers/${r.id}`,
        }));
    if (area === "manufacturers")
      return snapshot.manufacturers
        .filter((r) => includes(r.name, r.manufacturerType, r.status))
        .map((r) => ({
          id: r.id,
          name: r.name,
          meta: `${r.manufacturerType} · ${r.status}`,
          href: `/manufacturers/${r.id}`,
        }));
    if (area === "packaging")
      return snapshot.packaging
        .filter((r) => includes(r.name, r.componentType, r.sku))
        .map((r) => ({
          id: r.id,
          name: r.name,
          meta: `${r.componentType} · ${r.unitCost ? `${r.currency ?? "Currency unknown"} ${r.unitCost}` : "price missing"}`,
          href: `/packaging/${r.id}`,
        }));
    if (area === "documents")
      return snapshot.documents
        .filter((r) => includes(r.title, r.documentType, r.fileName))
        .map((r) => ({
          id: r.id,
          name: r.title,
          meta: `${r.documentType} · ${r.status}`,
          href: `/documents/${r.id}`,
        }));
    return snapshot.configurations
      .filter((r) => includes(r.name, r.sku))
      .map((r) => ({
        id: r.id,
        name: r.name,
        meta: `${r.fillSize} ${r.fillSizeUnit} · ${snapshot.snapshots.some((s) => s.finishedProductConfigurationId === r.id) ? "costed" : "COGS incomplete"}`,
        href: `/configurations/${r.id}`,
      }));
  })();
  const labels = {
    suppliers: "Supplier Network",
    manufacturers: "Manufacturer & White-Label Directory",
    packaging: "Packaging Library",
    costing: "Configurations & Costing",
    documents: "Document Vault",
  };
  const createKinds = {
    suppliers: "supplier",
    manufacturers: "manufacturer",
    packaging: "packaging",
    costing: "finished-configuration",
    documents: "document",
  } as const;
  const quoteBadges = quoteComparisonBadges(
    snapshot.quotes.map((r) => ({
      id: r.id,
      total: r.totalQuotedCost,
      unitCost: r.estimatedUnitCost,
      setupFee: r.setupFee,
      minimum: r.minimumQuantity,
      leadTimeDays: r.estimatedLeadTimeDays,
    })),
  );
  return (
    <div className="commercial-workspace">
      <section className="commercial-summary" aria-label="Commercial status">
        <article>
          <span>Suppliers</span>
          <strong>{snapshot.suppliers.length}</strong>
          <small>entered records</small>
        </article>
        <article>
          <span>Manufacturers</span>
          <strong>{snapshot.manufacturers.length}</strong>
          <small>entered records</small>
        </article>
        <article>
          <span>Active configurations</span>
          <strong>
            {
              snapshot.configurations.filter((r) => r.active && !r.archivedAt)
                .length
            }
          </strong>
          <small>approved definitions</small>
        </article>
        <article>
          <span>Cost snapshots</span>
          <strong>{snapshot.snapshots.length}</strong>
          <small>immutable history</small>
        </article>
      </section>
      <section className="commercial-panel">
        <div className="commercial-toolbar">
          <div>
            <p className="card-eyebrow">Build · Phase 03</p>
            <h2>{labels[area]}</h2>
          </div>
          <button
            className="button"
            type="button"
            disabled={snapshot.persistence !== "database"}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("legacy:create", {
                  detail: { kind: createKinds[area] },
                }),
              )
            }
          >
            Add record
          </button>
        </div>
        <label className="commercial-search">
          <span>Search {labels[area]}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search entered facts"
          />
        </label>
        {records.length ? (
          <div className="commercial-record-grid">
            {records.map((record) => (
              <Link key={record.id} href={record.href as Route}>
                <strong>{record.name}</strong>
                <span>{record.meta.replaceAll("_", " ")}</span>
                <small>Open record →</small>
              </Link>
            ))}
          </div>
        ) : (
          <div className="commercial-empty">
            <strong>No matching records.</strong>
            <p>
              No commercial facts have been entered in this area. Missing
              information remains visible and is never estimated.
            </p>
          </div>
        )}
      </section>
      {area === "suppliers" ? (
        <section className="commercial-panel">
          <p className="card-eyebrow">Supplier products & price history</p>
          <h2>Ingredient-linked offers</h2>
          {snapshot.supplierProducts.length ? (
            <div className="commercial-record-grid">
              {snapshot.supplierProducts.map((r) => (
                <article key={r.id}>
                  <strong>{r.name}</strong>
                  <span>
                    {
                      snapshot.supplierPrices.filter(
                        (p) => p.supplierProductId === r.id,
                      ).length
                    }{" "}
                    preserved price record(s)
                  </span>
                  <small>
                    {r.landedCost
                      ? `${r.currency ?? "Currency unknown"} ${r.landedCost} landed`
                      : "Price not entered"}
                  </small>
                </article>
              ))}
            </div>
          ) : (
            <p>No supplier products entered.</p>
          )}
        </section>
      ) : null}
      {area === "manufacturers" ? (
        <section className="commercial-panel">
          <p className="card-eyebrow">Catalog & quote comparison</p>
          <h2>Entered manufacturer options</h2>
          <div className="commercial-record-grid">
            {snapshot.catalogProducts.map((r) => (
              <article key={r.id}>
                <strong>{r.name}</strong>
                <span>Catalog product · {r.status.replaceAll("_", " ")}</span>
                <small>
                  {r.estimatedUnitCost
                    ? `${r.currency ?? "Currency unknown"} ${r.estimatedUnitCost}`
                    : "Unit cost unknown"}
                </small>
              </article>
            ))}
            {snapshot.quotes.map((r) => (
              <article key={r.id}>
                <strong>Quote {r.quoteNumber}</strong>
                <span>
                  {r.quoteStatus.replaceAll("_", " ")} · {r.currency}
                </span>
                <small>
                  {[
                    quoteBadges.lowestTotal === r.id && "Lowest total",
                    quoteBadges.lowestUnitCost === r.id && "Lowest unit cost",
                    quoteBadges.fastestLeadTime === r.id && "Fastest lead time",
                  ]
                    .filter(Boolean)
                    .join(" · ") ||
                    `${snapshot.quoteLines.filter((l) => l.manufacturerQuoteId === r.id).length} line item(s)`}
                </small>
              </article>
            ))}
          </div>
          {!snapshot.catalogProducts.length && !snapshot.quotes.length ? (
            <p>No catalog products or quotes entered.</p>
          ) : null}
        </section>
      ) : null}
      {area === "packaging" ? (
        <section className="commercial-panel">
          <p className="card-eyebrow">Compatibility</p>
          <h2>User-entered test status</h2>
          <p>
            {snapshot.compatibility.length
              ? `${snapshot.compatibility.length} compatibility record(s); ${snapshot.compatibility.filter((r) => r.status !== "confirmed").length} not confirmed.`
              : "No compatibility has been inferred or recorded."}
          </p>
        </section>
      ) : null}
      {area === "costing" ? (
        <section className="commercial-panel">
          <p className="card-eyebrow">Scenario & snapshot history</p>
          <h2>Reproducible cost context</h2>
          <p>
            {snapshot.scenarios.length} saved scenario(s) ·{" "}
            {snapshot.snapshots.length} immutable snapshot(s). Purchase cost and
            consumed cost remain separate.
          </p>
        </section>
      ) : null}
      {area === "documents" ? (
        <section className="commercial-panel">
          <p className="card-eyebrow">Storage & links</p>
          <h2>External objects, relational metadata</h2>
          <p>
            {snapshot.documentLinks.length} link(s). Raw file bytes are never
            stored in PostgreSQL; upload remains unavailable until an
            object-storage adapter is configured.
          </p>
        </section>
      ) : null}
      <section className="commercial-panel" aria-labelledby="readiness-heading">
        <p className="card-eyebrow">Deterministic readiness</p>
        <h2 id="readiness-heading">Commercial blockers</h2>
        <ul className="blocker-list">
          {snapshot.suppliers.length === 0 ? (
            <li>
              <strong>Supplier options missing</strong>
              <span>No supplier records exist.</span>
            </li>
          ) : null}
          {snapshot.packaging.length === 0 ? (
            <li>
              <strong>Packaging missing</strong>
              <span>
                No bottle, closure, label, or other component has been entered.
              </span>
            </li>
          ) : null}
          {snapshot.snapshots.length === 0 ? (
            <li>
              <strong>Cost snapshot missing</strong>
              <span>No reproducible COGS result has been preserved.</span>
            </li>
          ) : null}
          {snapshot.documents.length === 0 ? (
            <li>
              <strong>Commercial documents missing</strong>
              <span>No external evidence metadata is stored.</span>
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
