# Phase 6 — Launches, Shopify, and Market Performance

## Objective and dependencies

Connect launch readiness to read-only Shopify facts and explainable market performance. Requires Phase 5 release/label/quality gates and stable product identifiers. External access needs explicit credentials and authorization.

## Domain model

Launch, market/channel, milestone, dependency, owner, due date, readiness gate/evidence and decision; Shopify shop/connection metadata, sync cursor/job/run/error, external-to-internal mapping, imported product/variant, order/line, discount, tax, shipping and refund facts as justified; normalized daily performance aggregates with currency/timezone and lineage. Minimize customer data and define retention before import.

Imported raw facts remain distinguishable from derived metrics. No write-capable token scope is requested for initial integration.

## Screens and workflows

Launch command center and critical-path readiness; gate evidence/approval; Shopify connection health and mapping review; sync history/reconciliation exceptions; product/variant/launch performance with metric definitions, period, currency, refunds, data freshness, and no-data states.

## Services and invariants

Read-only least-privilege Shopify client; secure token handling; cursor/webhook ingestion as chosen; signature verification where applicable; rate-limit aware retries; idempotent imports; mapping/reconciliation; timezone/currency normalization; deterministic metric aggregation. Shopify write-back is blocked by design.

## Test plan

Official API contract fixtures; token-scope enforcement; signature validation; pagination, retry/backoff and idempotency; mapping collisions; partial sync recovery; refund/cancellation and timezone boundaries; deterministic aggregates; permission/privacy; accessible charts with text summaries. Use no real customer payloads in fixtures.

## Acceptance criteria

Launch status is evidence-based; released product readiness can be reviewed without bypassing controls; authorized users can sync and reconcile read-only Shopify facts; metrics state definition, period, freshness, currency and lineage. Failure is recoverable and observable. All validation and Replit integration checks pass.

## Non-goals and stop conditions

No product/order/inventory write-back, fulfillment, marketing automation, ad attribution, fabricated analytics, or broad customer-data warehouse. Stop for excessive OAuth scopes, undefined data retention, unreliable identity mapping, API/version uncertainty (verify official docs), failing checks, or acceptance. Recommend Phase 7 only.
