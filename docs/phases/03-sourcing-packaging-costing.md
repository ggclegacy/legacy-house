# Phase 3 — Sourcing, Manufacturers, White Label, Packaging, and Costing

## Objective and dependencies

Deliver BUILD workflows that compare real sourced options and preserve commercial history. Requires Phase 2 product, ingredient, unit, evidence, and development-path models.

## Domain model

Organizations with supplier/manufacturer roles, contacts and capabilities; product/ingredient/vendor links; white-label catalog items and vendor specifications; packaging components/configurations; samples and evaluations; RFQ/quote and quote lines; currency, unit, MOQ, lead time and effective dates; supplier price history; freight/fee/tax assumptions; cost scenario, line, snapshot, yield/overage assumption, price and margin target. Facts carry source, observed/effective time, and value classification.

Do not infer that a vendor is qualified or that a catalog item has a known internal formula. Avoid duplicate supplier/manufacturer tables when one organization can hold multiple roles.

## Screens and workflows

Organization directory/detail; supplier/manufacturer capabilities; white-label catalog and product linkage; packaging configuration; sample tracker/evaluation; quote capture and normalized comparison; cost scenario builder and margin view with visible assumptions, exclusions, currency, units, and timestamps.

## Services and invariants

Organization deduplication guidance; quote normalization; unit- and currency-aware costing without silent exchange rates; scenario comparison; packaging quantity/yield calculations; immutable approved cost snapshots; historical price append/effective dating. Estimated landed costs remain distinct from actual costs.

## Test plan

Overlapping/effective price periods; MOQ and packaging quantity boundaries; unit conversion rejection; currency/rounding precision; quote comparison with missing data; cost snapshot immutability; white-label path with no formula; organization multi-role behavior; provenance/audit and permissions; responsive dense comparisons.

## Acceptance criteria

Users can evaluate sourced options using only entered/sourced facts, see unknowns, reproduce a cost scenario, and recover the historical quote/price/cost context. White-label and custom products share appropriate commercial workflows without fabricated formulas. Required checks and documentation pass.

## Non-goals and stop conditions

No vendor portal, payments/accounting, purchase-order posting, stock, production, quality conclusions, Shopify, live exchange-rate dependency, or invented business records. Stop when authoritative commercial facts are absent, normalization would hide uncertainty, snapshot history is mutable, checks fail, or acceptance is met. Recommend Phase 4 only.

## Implementation record

Implemented in migration `0003_happy_marrow.sql` with a separate commercial schema module, centralized fixed-decimal unit/cost/readiness services, a typed database repository and commands, Phase 03 workspaces/detail routes, registry-backed search/create, settings, and an unavailable-by-default object-storage adapter. The only approved commercial seed is the Legacy Reserve Hair & Beard Oil 2 oz configuration. External PostgreSQL, private object storage, and protected Vercel Preview acceptance remain environment blockers; no Phase 04 model or workflow was started.
