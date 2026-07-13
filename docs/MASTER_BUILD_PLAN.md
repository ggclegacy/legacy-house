# Legacy House Master Build Plan

## Delivery model

Build one phase at a time in dependency order. Phase files are implementation contracts; this document controls sequence and cross-phase boundaries. Phase completion requires its data models, screens, services, tests, acceptance criteria, documentation, migration safety, responsive/accessibility checks, production build, and Vercel-compatible runtime smoke test. Security, authorization, auditability, testing, accessibility, and provenance begin in Phase 1 and continue throughout; Phase 8 verifies and hardens them rather than introducing them late.

No phase may populate invented suppliers, manufacturers, formulas, ingredient densities, costs, inventory, sales, certifications, claims, test results, or analytics. Clearly labeled synthetic fixtures may be used only in isolated tests and must never resemble production truth.

## Dependency path

`Phase 1 foundation → Phase 2 product/R&D → Phase 3 sourcing/costing → Phase 4 operations/traceability → Phase 5 quality/control → Phase 6 launch/Shopify → Phase 7 intelligence → Phase 8 hardening/deployment`

Some discovery may happen ahead of sequence, but implementation cannot bypass upstream identifiers, history, authorization, or audit invariants.

## Phase 1 — Foundation and Design System

- **Outcome:** A reproducible, accessible, secure-by-default application shell and database foundation.
- **Models:** users/roles or selected identity mapping, product lines, audit-event foundation, shared document metadata, units/dimensions.
- **Screens:** branded home hero, navigation shell, authenticated/unauthorized states, component showcase where useful.
- **Services:** configuration validation, database connection, authorization policy boundary, audit interface, health check.
- **Tests:** configuration, database/migrations, authorization skeleton, core UI accessibility/responsiveness, build/runtime.
- **Non-goals:** product workflow CRUD and operational records.
- **Dependency:** initialization review and safe Git strategy.
- **Contract:** `phases/01-foundation-design-system.md`.

## Phase 2 — Product Pipeline, Formulas, Ingredients, and R&D

- **Outcome:** Truthful CREATE workflows from product idea through versioned formula experiments.
- **Models:** products, briefs, lifecycle history, ingredients, formula/version/lines, experiments/observations, decisions, evidence.
- **Screens:** portfolio/pipeline, product workspace, formula editor/history/compare, ingredient records, experiment log.
- **Services:** lifecycle rules, formula validation/versioning, unit-safe scaling, decision/evidence history.
- **Tests:** formula totals/version immutability, dimensional rejection, supplied oil calculation, unknown white-label behavior.
- **Non-goals:** purchasing, stock, production execution, quality release, commerce.
- **Dependency:** Phase 1.
- **Contract:** `phases/02-product-pipeline-formulas-rnd.md`.

## Phase 3 — Sourcing, Manufacturers, White Label, Packaging, and Costing

- **Outcome:** BUILD workflows compare sourced options and calculate traceable costs without fabricated facts.
- **Models:** organizations/contacts, capabilities, catalog items, packaging, samples, quotes and lines, price history, MOQs/lead times, cost scenarios/snapshots.
- **Screens:** supplier/manufacturer workspaces, white-label catalog, sample/quote comparison, packaging specs, cost/margin scenarios.
- **Services:** quote normalization, unit/currency-aware costing, scenario comparison, provenance.
- **Tests:** price history, quote effective dates, rounding/unit rules, unknown formula path, snapshot immutability.
- **Non-goals:** posted inventory, production, vendor portal, payments.
- **Dependency:** Phase 2 product identity and units.
- **Contract:** `phases/03-sourcing-packaging-costing.md`.

## Phase 4 — Inventory, Purchasing, Production, and Traceability

- **Outcome:** CONTROL workflows preserve a complete material and batch chain of custody.
- **Models:** locations, items/lots/statuses, purchase orders, receipts, immutable inventory transactions, production orders/batches, allocations, planned/actual consumption, snapshots.
- **Screens:** inventory/lot views, PO/receiving, transaction history, production plan/execution, traceability explorer.
- **Services:** posting/reversal, availability, receiving, allocation, batch scaling/snapshot, genealogy.
- **Tests:** ledger balance/reversal/idempotency, negative-stock control, lot status exclusion, plan-vs-actual, backward/forward trace.
- **Non-goals:** accounting ledger, carrier/WMS replacement, quality release automation.
- **Dependency:** Phases 2–3.
- **Contract:** `phases/04-inventory-production-traceability.md`.

## Phase 5 — Quality, Stability, Labels, and Complaints

- **Outcome:** Controlled quality evidence, disposition, label/claim history, changes, and complaint investigations.
- **Models:** specifications, inspections/tests/results, dispositions, stability protocols/timepoints, label/claim versions/evidence, complaints/adverse flags, CAPA/change control.
- **Screens:** quality queue, lot disposition, stability schedule, label/claim workspace, complaint/investigation, change control.
- **Services:** eligibility/release policy, protocol scheduling, controlled approvals, complaint escalation, impact analysis.
- **Tests:** release separation, hold enforcement, immutable approval history, due dates, claim provenance, complaint permissions.
- **Non-goals:** automated regulatory conclusions, medical advice, public complaint intake.
- **Dependency:** Phase 4 traceability; Phase 2/3 evidence.
- **Contract:** `phases/05-quality-labels-complaints.md`.

## Phase 6 — Launches, Shopify, and Market Performance

- **Outcome:** Launch readiness connects controlled internal records to read-only commerce performance.
- **Models:** launches, milestones/gates, Shopify connection/sync cursors/mappings, imported products/orders/lines/refunds, normalized performance aggregates.
- **Screens:** launch command center, readiness checklist, integration health/mapping, product/launch performance.
- **Services:** read-only sync, webhook verification if used, idempotent import, reconciliation, timezone/currency normalization.
- **Tests:** API contract fixtures, retry/idempotency, mapping, partial failure, refunds, permission and secret boundaries.
- **Non-goals:** Shopify write-back, ad attribution platform, invented historical analytics.
- **Dependency:** Phase 5 launch/release controls.
- **Contract:** `phases/06-launches-shopify-performance.md`.

## Phase 7 — Operational Intelligence and Forecasting

- **Outcome:** SCALE workflows turn trusted history into explainable forecasts, exceptions, and decisions.
- **Models:** metric definitions/snapshots, forecast runs/inputs/outputs, scenarios, overrides, alert rules/events, recommendations/decisions.
- **Screens:** executive/operations overview, forecast/scenarios, exception queue, portfolio review, metric lineage.
- **Services:** deterministic metrics, demand/lead-time models, reorder proposals, accuracy/backtesting, explainability.
- **Tests:** time boundaries, sparse data, deterministic recomputation, backtests, permissions, no-data/uncertainty states.
- **Non-goals:** autonomous purchasing, opaque AI decisions, fabricated metrics.
- **Dependency:** sufficient real Phase 4 and 6 history.
- **Contract:** `phases/07-operational-intelligence-forecasting.md`.

## Phase 8 — Security, Hardening, and Deployment

- **Outcome:** Production-readiness is evidenced across security, privacy, resilience, performance, observability, recovery, CI/CD, and Vercel deployment.
- **Models:** only retention/security support needed after review; avoid duplicating identity/audit models.
- **Screens:** operational diagnostics and authorized security/session controls only where justified.
- **Services:** hardened auth/session, rate/abuse controls, headers, secret rotation procedures, backup/restore, monitoring, deployment checks.
- **Tests:** authorization matrix, dependency/security scans, performance/accessibility budgets, backup restore, migration rollback/forward, failure drills.
- **Non-goals:** new business modules or security theater.
- **Dependency:** Phases 1–7 and a deployment environment.
- **Contract:** `phases/08-security-hardening-deployment.md`.

## Global stop conditions

Stop a phase when its acceptance criteria are met, required validation fails, authoritative facts are missing, destructive action lacks approval, existing work cannot be preserved, or a required architecture decision is unresolved. Update `BUILD_STATUS.md`; do not roll directly into the next phase.
