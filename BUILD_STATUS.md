# Legacy House Build Status

## Current state

- **Current phase:** Phase 2 — Product Pipeline, Formulas, Ingredients, and R&D
- **Status:** Implementation complete locally; external acceptance partially blocked
- **Last updated:** 2026-07-13 (America/Chicago)
- **Next recommended phase:** Phase 3 — Sourcing, Manufacturers, White Label, Packaging, and Costing. Do not begin automatically.

Phase 02 was explicitly authorized on 2026-07-13. Its local application, schema, migration, canonical seed definitions, workflows, and tests are implemented. A reachable external PostgreSQL `DATABASE_URL` and hosted Replit workspace were not supplied, so external migration/seed evidence and hosted runtime verification remain blockers to full Phase 01/02 acceptance. The application reports that limitation and keeps canonical fallback data read-only.

## Phase 2 delivered

- Product pipeline with board, list, and product-line views; search and line/path/status/priority filters.
- Product workspaces with phase-aware tabs, structured locally recoverable brief drafts, explicit database save, status/priority/archive controls, notes, decisions, relationships, and actual activity history.
- Formula Vault and immutable formula-version records; draft composition editing, ordering, review transition, version copy, production steps, comparison, and history.
- Exact decimal formula validation and batch scaling for volume and weight bases; volume/weight conversion requires an explicit density.
- Ingredient directory/detail with explicit unknowns, density provenance boundaries, and formula usage.
- R&D experiment records, observations, optional 1–5 sensory scores, condition flags, completion rules, and scheduling helpers.
- Dynamic Command metrics, deterministic attention items, activity, global search, and database-gated create actions.
- Authorized seed definitions only: the supplied Legacy Reserve Hair & Beard Oil formula and nine named Legacy Sanctum research/white-label records. No invented suppliers, costs, inventory, certifications, tests, sales, or analytics.
- Phase 03 through Phase 08 remain structural destinations only.

## Validation evidence

| Check                              | Result                                                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Git                                | `main`; no commits; supplied `origin`; all work untracked; no push                                                     |
| Official logo                      | Pass — unchanged 2000×2000 PNG; SHA-256 `8b3d03bf01b9078ed1318ac2e1c44b66b5896b123d3bb0f447d7b207f9026920`             |
| Drizzle migration                  | Pass — `pnpm db:check`; clean PGlite migration and persistence integration tests                                       |
| External PostgreSQL migration/seed | Blocked — `DATABASE_URL` absent                                                                                        |
| Unit/integration                   | Pass — 61 tests across 23 files                                                                                        |
| Coverage                           | Pass — 98.29% statements, 93.33% branches, 97.95% functions, 98.83% lines                                              |
| Formula acceptance examples        | Pass — 10/20/30/50 bottles calculate 21/42/63/105 fl oz exactly; missing density remains explicit                      |
| Browser tests                      | Pass — 24 desktop/mobile/keyboard/settings/health scenarios in 1.5 minutes                                             |
| Format/lint/type-check/build       | Pass — `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, and production build                                        |
| Production build/runtime           | Pass — 20 routes/pages; `0.0.0.0`, supplied `PORT`, and `/api/health` verified                                         |
| Replit                             | Partial — root app, host/`PORT`, build/migrate/seed/start contract present; hosted workspace and database not supplied |

## Current blockers and debt

- External PostgreSQL and hosted Replit acceptance cannot be performed in this workspace.
- Production authentication/session integration remains deferred; database-backed mutation controls must not be exposed as a public production deployment before Phase 08 hardening.
- There is no Git history or initial commit; owner review controls the first commit and push.
- Phase 02 attachment/document storage is represented only by phase boundaries; no external object-store decision was supplied.
- Concurrent product updates use optimistic timestamps; formula-version creation relies on database transactions and uniqueness but production concurrency still needs real PostgreSQL verification.
- Two deprecated transitive `@esbuild-kit` development packages remain upstream tooling debt and are not production vulnerabilities.

## Phase checklist

- [ ] Phase 1 — Foundation and Design System (local implementation complete; external PostgreSQL/Replit acceptance blocked)
- [ ] Phase 2 — Product Pipeline, Formulas, Ingredients, and R&D (local implementation complete; external PostgreSQL/Replit acceptance blocked)
- [ ] Phase 3 — Sourcing, Manufacturers, White Label, Packaging, and Costing (recommended next; not started)
- [ ] Phase 4 — Inventory, Purchasing, Production, and Traceability
- [ ] Phase 5 — Quality, Stability, Labels, and Complaints
- [ ] Phase 6 — Launches, Shopify, and Market Performance
- [ ] Phase 7 — Operational Intelligence and Forecasting
- [ ] Phase 8 — Security, Hardening, and Deployment
