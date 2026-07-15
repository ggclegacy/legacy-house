"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { labelFor } from "@/src/domain/development/development";
import type { DevelopmentFormula } from "@/src/domain/development/snapshot";
import { calculateBatch } from "@/src/domain/formulas/calculation";
import { asRoute } from "@/src/navigation/as-route";

export function BatchCalculator({
  formula,
  initial,
  batchModeHref,
}: {
  formula: DevelopmentFormula;
  initial?: {
    count: number;
    size: string;
    unit: "us_fluid_ounces" | "milliliters" | "grams";
    overage: string;
  };
  batchModeHref?: string;
}) {
  const [count, setCount] = useState(
    String(initial?.count ?? formula.defaultBottleCount ?? 20),
  );
  const [size, setSize] = useState(
    initial?.size ?? formula.defaultBottleSize ?? "2",
  );
  const [unit, setUnit] = useState(
    initial?.unit ?? formula.defaultBottleSizeUnit ?? "us_fluid_ounces",
  );
  const [overage, setOverage] = useState(
    initial?.overage ?? formula.defaultOveragePercent ?? "5",
  );
  const [precision, setPrecision] = useState("12");
  const [copied, setCopied] = useState<string | null>(null);
  const result = useMemo(() => {
    try {
      return {
        value: calculateBatch({
          basis: formula.formulaBasis,
          bottleCount: Number(count),
          bottleSize: size,
          bottleSizeUnit: unit,
          overagePercent: overage,
          outputPrecision: Number(precision),
          ingredients: formula.ingredients.map((line) => ({
            id: line.id,
            name: line.ingredientName,
            percentage: line.percentage,
            densityGramsPerMl: line.densityGramsPerMl,
          })),
        }),
        error: null,
      };
    } catch (error) {
      return {
        value: null,
        error: error instanceof Error ? error.message : "Calculation failed.",
      };
    }
  }, [count, formula, overage, precision, size, unit]);
  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(`${label} copied.`);
  }
  return (
    <div className="batch-calculator">
      <div className="calculator-controls">
        <fieldset>
          <legend>Bottle count</legend>
          <div className="preset-row">
            {[10, 20, 30, 40, 50, 100].map((preset) => (
              <button
                type="button"
                key={preset}
                aria-pressed={count === String(preset)}
                onClick={() => setCount(String(preset))}
              >
                {preset}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={
                !["10", "20", "30", "40", "50", "100"].includes(count)
              }
              onClick={() => setCount("")}
            >
              Custom
            </button>
          </div>
          <label>
            <span>Custom count</span>
            <input
              inputMode="numeric"
              value={count}
              onChange={(event) => setCount(event.target.value)}
            />
          </label>
        </fieldset>
        <label>
          <span>Fill size</span>
          <input
            inputMode="decimal"
            value={size}
            onChange={(event) => setSize(event.target.value)}
          />
        </label>
        <label>
          <span>Fill unit</span>
          <select
            value={unit}
            onChange={(event) => setUnit(event.target.value as typeof unit)}
            disabled={formula.formulaBasis === "weight_percentage"}
          >
            <option value="us_fluid_ounces">US fluid ounces</option>
            <option value="milliliters">Milliliters</option>
            {formula.formulaBasis === "weight_percentage" ? (
              <option value="grams">Grams</option>
            ) : null}
          </select>
        </label>
        <fieldset>
          <legend>Production overage</legend>
          <div className="preset-row">
            {[0, 3, 5, 7, 10].map((preset) => (
              <button
                type="button"
                key={preset}
                aria-pressed={overage === String(preset)}
                onClick={() => setOverage(String(preset))}
              >
                {preset}%
              </button>
            ))}
          </div>
          <label>
            <span>Custom overage %</span>
            <input
              inputMode="decimal"
              value={overage}
              onChange={(event) => setOverage(event.target.value)}
            />
          </label>
        </fieldset>
        <label>
          <span>Output precision</span>
          <select
            value={precision}
            onChange={(event) => setPrecision(event.target.value)}
          >
            <option value="2">2 decimal places</option>
            <option value="4">4 decimal places</option>
            <option value="6">6 decimal places</option>
            <option value="12">12 decimal places</option>
          </select>
        </label>
      </div>
      {result.error ? (
        <div className="error-summary" role="alert">
          <strong>Calculation unavailable</strong>
          <p>{result.error}</p>
        </div>
      ) : result.value ? (
        <div className="batch-result">
          <div className="batch-summary">
            <article>
              <span>Required fill</span>
              <strong>
                {result.value.requiredFill} {labelFor(result.value.batchUnit)}
              </strong>
            </article>
            <article>
              <span>Overage</span>
              <strong>{result.value.overage}</strong>
            </article>
            <article>
              <span>Total batch</span>
              <strong>
                {result.value.totalBatch} {labelFor(result.value.batchUnit)}
              </strong>
              {result.value.totalFluidOunces &&
              result.value.totalMilliliters ? (
                <small>
                  {result.value.totalFluidOunces} fl oz ·{" "}
                  {result.value.totalMilliliters} mL
                </small>
              ) : null}
            </article>
            <article>
              <span>Formula validity</span>
              <strong>
                {result.value.validFormula
                  ? "Valid · exactly 100%"
                  : `Invalid · ${result.value.formulaTotal}%`}
              </strong>
            </article>
          </div>
          <div className="batch-lines">
            {result.value.ingredients.map((line) => (
              <article key={line.id}>
                <div>
                  <p className="card-eyebrow">{line.percentage}%</p>
                  <h3>{line.name}</h3>
                </div>
                <dl>
                  <div>
                    <dt>Fluid ounces</dt>
                    <dd>{line.fluidOunces ?? "Unsupported for basis"}</dd>
                  </div>
                  <div>
                    <dt>Milliliters</dt>
                    <dd>{line.milliliters ?? "Unsupported for basis"}</dd>
                  </div>
                  <div>
                    <dt>Grams</dt>
                    <dd>{line.grams ?? "Density required"}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() =>
                    void copy(
                      line.name,
                      `${line.name}: ${line.fluidOunces ?? "n/a"} fl oz / ${line.milliliters ?? "n/a"} mL / ${line.grams ?? "density required"} g`,
                    )
                  }
                >
                  Copy amount
                </button>
              </article>
            ))}
          </div>
          <div className="calculator-actions">
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                void copy(
                  "Complete formula",
                  result
                    .value!.ingredients.map(
                      (line) => `${line.name}: ${line.percentage}%`,
                    )
                    .join("\n"),
                )
              }
            >
              Copy complete formula
            </button>
            <button
              className="button"
              type="button"
              onClick={() => window.print()}
            >
              Print production worksheet
            </button>
            {batchModeHref ? (
              <Link
                className="button"
                href={asRoute(
                  `${batchModeHref}?formula=${formula.versionId}&count=${count}&size=${size}&unit=${unit}&overage=${overage}&precision=${precision}`,
                )}
              >
                Start Batch Mode
              </Link>
            ) : null}
          </div>
          {copied ? (
            <p role="status" className="inline-feedback">
              {copied}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
