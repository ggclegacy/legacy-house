# Phase 7 — Operational Intelligence and Forecasting

## Objective and dependencies

Turn trusted operational and commerce history into explainable exceptions, scenarios, and recommendations. Requires sufficient real Phase 4 and 6 history; a lack of data results in honest “insufficient evidence,” not synthetic metrics.

## Domain model

Versioned metric definition and lineage; metric snapshot; forecast run with model/version, input window, cutoff, granularity and assumptions; forecast output and interval/confidence representation; scenario and override with actor/reason; accuracy/backtest result; alert rule/event/acknowledgment; reorder proposal; recommendation and human decision/outcome.

Forecasts are append-only runs, not overwritten values. Actuals, estimates, forecasts, overrides, and recommendations are visually and structurally distinct.

## Screens and workflows

Executive and operations overview; metric lineage/detail; demand forecast with historical context and uncertainty; scenarios/overrides; inventory risk and reorder proposals; exception queue; portfolio review and recorded decision. Every visualization includes text, units, date range, freshness, and no/sparse-data explanation.

## Services and invariants

Deterministic metric calculation; demand and lead-time forecast baseline selected from evidence; inventory projection; reorder proposal constrained by available stock, holds, lead time and MOQ; backtesting/accuracy; alert evaluation/deduplication; explanation/provenance. AI summaries, if separately authorized, cite permission-filtered records and cannot approve actions.

## Test plan

Time zones, cutoff/no-future-leakage and period boundaries; sparse/missing/outlier/refund data; deterministic recomputation; backtest fixtures; uncertainty and override history; held-stock exclusion; alert deduplication; permissions; accessible chart summaries. Compare baseline behavior before adding complexity.

## Acceptance criteria

Users can reproduce a metric, inspect forecast inputs/assumptions/version, compare forecast to actual, override with an auditable reason, and turn exceptions into human decisions. The system declines unsupported conclusions and never orders automatically. Performance and all repository validation pass.

## Non-goals and stop conditions

No autonomous purchasing/production, black-box scores, uncited AI advice, invented demand, or causal marketing attribution. Stop if real history is insufficient (deliver honest readiness assessment), leakage/lineage is unresolved, actions bypass humans, checks fail, or acceptance is met. Recommend Phase 8 only.
