"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentFormula } from "@/src/domain/development/snapshot";
import { formulaTotal } from "@/src/domain/formulas/calculation";
import { asRoute } from "@/src/navigation/as-route";

const views = [
  "all",
  "draft",
  "experimental",
  "under_review",
  "approved",
  "production_ready",
  "superseded",
  "archived",
] as const;

export function FormulaVaultView({
  formulas,
}: {
  formulas: readonly DevelopmentFormula[];
}) {
  const [view, setView] = useState<(typeof views)[number]>("all");
  const [query, setQuery] = useState("");
  const [line, setLine] = useState("all");
  const [sort, setSort] = useState("recent");
  const filtered = useMemo(
    () =>
      formulas
        .filter(
          (formula) =>
            (view === "all" || formula.status === view) &&
            (line === "all" || formula.productLineName === line) &&
            [formula.familyName, formula.productName, formula.version]
              .join(" ")
              .toLocaleLowerCase()
              .includes(query.toLocaleLowerCase()),
        )
        .sort((left, right) =>
          sort === "name"
            ? left.familyName.localeCompare(right.familyName)
            : (right.updatedAt ?? "").localeCompare(left.updatedAt ?? ""),
        ),
    [formulas, line, query, sort, view],
  );
  const lines = [
    ...new Set(formulas.map((formula) => formula.productLineName)),
  ];
  return (
    <>
      <div
        className="vault-tabs"
        role="tablist"
        aria-label="Formula status views"
      >
        {views.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={view === status}
            onClick={() => setView(status)}
          >
            {labelFor(status)}
          </button>
        ))}
      </div>
      <div className="view-toolbar compact">
        <input
          type="search"
          aria-label="Search formulas"
          placeholder="Search formulas"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label="Filter formulas by product line"
          value={line}
          onChange={(event) => setLine(event.target.value)}
        >
          <option value="all">All product lines</option>
          {lines.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <select
          aria-label="Sort formulas"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="recent">Recent activity</option>
          <option value="name">Formula name</option>
        </select>
      </div>
      <div className="formula-grid">
        {filtered.map((formula) => {
          const total = formulaTotal(
            formula.ingredients.map((line) => line.percentage),
          );
          return (
            <article className="formula-card" key={formula.versionId}>
              <div className="record-status">
                <span>{labelFor(formula.status)}</span>
                <span className={`formula-state ${total.state}`}>
                  {total.total}% · {labelFor(total.state)}
                </span>
              </div>
              <p className="card-eyebrow">
                {formula.productLineName} · {formula.productName}
              </p>
              <h2>
                <Link href={asRoute(`/formulas/${formula.versionId}`)}>
                  {formula.familyName}
                </Link>
              </h2>
              <dl>
                <div>
                  <dt>Active version</dt>
                  <dd>{formula.version}</dd>
                </div>
                <div>
                  <dt>Basis</dt>
                  <dd>{labelFor(formula.formulaBasis)}</dd>
                </div>
                <div>
                  <dt>Ingredients</dt>
                  <dd>{formula.ingredients.length}</dd>
                </div>
                <div>
                  <dt>Production steps</dt>
                  <dd>{formula.productionSteps.length || "Not entered"}</dd>
                </div>
              </dl>
              <Link
                className="text-link"
                href={asRoute(`/formulas/${formula.versionId}`)}
              >
                Open formula <span aria-hidden="true">→</span>
              </Link>
            </article>
          );
        })}
      </div>
      {!filtered.length ? (
        <div className="record-empty">
          <strong>No formulas match this view.</strong>
          <p>Create or seed a real formula before it appears here.</p>
        </div>
      ) : null}
    </>
  );
}
