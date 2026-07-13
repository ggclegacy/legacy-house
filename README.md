# Legacy House

Legacy House is Groomed Gent Co.'s private Product Intelligence OS. It is planned to connect product creation, sourcing and costing, operational control, and market intelligence across Legacy Reserve, Legacy Sanctum, and future product lines.

## Current repository state

Phase 3 is implemented locally and awaiting review. The single root application includes the Phase 1/2 foundation and product-development system plus commercial supplier, manufacturer, packaging, configuration, costing, document, and readiness foundations. Vercel is now the official hosting target. A real external PostgreSQL migration, private object-store adapter, protected Preview, and future Private Beta gate remain unverified because those environments and credentials were not supplied.

See `BUILD_STATUS.md` for exact validation evidence.

## Stack

- Next.js 16 App Router, React 19, and strict TypeScript 6
- Tailwind CSS 4 plus repository-owned accessible components and design tokens
- PostgreSQL as the persistent source of truth
- Drizzle ORM as the sole ORM
- Zod for boundary validation
- Vitest, Testing Library, PGlite migration tests, and Playwright browser tests
- pnpm 11 and Node.js 24

## Setup and commands

Prerequisites are Node.js 24+, pnpm 11.6+, and PostgreSQL 16-compatible hosting. From the repository root:

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Set a development-only `DATABASE_URL` in `.env.local` before database commands. Keep `DATABASE_TARGET=development`; never place Preview or Production credentials in this file.

| Capability                      | Command                                                |
| ------------------------------- | ------------------------------------------------------ |
| Install                         | `pnpm install --frozen-lockfile`                       |
| Development server              | `pnpm dev`                                             |
| Production build/start          | `pnpm build`, `pnpm start`                             |
| Format check/write              | `pnpm format:check`, `pnpm format`                     |
| Lint                            | `pnpm lint`                                            |
| Type-check                      | `pnpm typecheck`                                       |
| Unit/integration tests          | `pnpm test`, `pnpm test:coverage`                      |
| Browser tests                   | `pnpm test:e2e`                                        |
| Generate/check/apply migrations | `pnpm db:generate`, `pnpm db:check`, `pnpm db:migrate` |
| Seed foundation records         | `pnpm db:seed`                                         |
| Full non-browser validation     | `pnpm validate`                                        |

`pnpm db:seed` idempotently establishes the two authorized product lines, the supplied Legacy Reserve Hair & Beard Oil formula facts, its 2 US fl oz active finished configuration, and nine named Legacy Sanctum research/white-label planning records with unknown fields left unknown. It records no supplier, price, inventory, manufacturing, certification, test-result, sales, or analytics claims.

## Environment and Vercel

Vercel uses the root Next.js application, pnpm lockfile, and `pnpm build`; there is no nested app, custom output directory, or static export. Builds never migrate or seed a database. Development, Preview, and Production must have separate PostgreSQL credentials, preferably provider-supplied pooled URLs. Preview writes are off by default, and Production data access stays off until the future passkey/PIN Private Beta gate is implemented and verified.

`/api/health` is a non-cached process-liveness response with no secret or dependency details. `/api/ready` is also non-cached and returns only a generic readiness state. See the deployment runbooks before connecting any hosted environment:

- `docs/deployment/VERCEL.md`
- `docs/deployment/ENVIRONMENT_VARIABLES.md`
- `docs/deployment/DATABASE_MIGRATIONS.md`
- `docs/deployment/OBJECT_STORAGE.md`
- `docs/deployment/DEPLOYMENT_CHECKLISTS.md`

## Architecture overview

The system is a modular monolith. `src/app` owns routes and transport, `src/presentation` owns reusable UI, `src/domain` owns policy and calculations, `src/services` owns use-case orchestration, and `src/infrastructure` owns PostgreSQL/Drizzle implementation. Zod validates trust boundaries. Typed registries own global navigation/search/create availability. The schema contains the foundation and development records plus the 20 Phase 03 commercial entities in `commercial-schema.ts`.

Authentication-provider selection is intentionally deferred. The foundation stores provider-neutral external subjects and enforces a deny-by-default authorization policy seam; no protected product workflow exists yet.

The official `logo.png` remains unchanged in the project root and is the application-shell emblem. The Command hero uses a separately scoped reactor illustration as environmental product-intelligence artwork under ADR-044; it does not replace the official mark or the `/emblem` route.

## Implemented modules

- Responsive branded shell and chamber-style Command core for CREATE, BUILD, CONTROL, and SCALE
- Complete desktop/mobile navigation and structural routes for every planned module
- Grouped global search and a registry-driven create dialog with truthful availability
- Settings for currency, units, precision, date format, product-line context, reduced motion, and sidebar behavior
- Product-line repository/service boundaries and authorized idempotent foundation seed
- Loading, error, not-found, and unauthorized states
- Liveness and database-readiness endpoints
- PostgreSQL/Drizzle foundation schema and generated migration
- Environment validation, deny-by-default capability policy, and audit event contract
- Unit, integration, clean-migration, desktop/mobile, reduced-motion, and runtime tests
- CI and Vercel-compatible configuration with fail-closed environment policy
- Product Pipeline, product workspaces, structured briefs, notes, decisions, and activity
- Formula Vault, immutable versioning, composition validation, exact batch scaling, and production steps
- Ingredient intelligence with explicit unknown/density boundaries and formula usage
- R&D experiments, observations, sensory scoring, completion, and evidence-oriented history
- Dynamic Command metrics, attention items, activity, and Phase 02 search/create actions
- Supplier Network, ingredient-linked supplier products, append-only price history, and normalized unit costing
- Manufacturer/catalog/candidate/quote structures with line totals and factual comparison badges
- Packaging library, append-only pricing, explicit compatibility, and finished configurations
- Formula/white-label/packaging/fully-loaded COGS services, margins, purchase estimates, scenarios, and immutable snapshots
- Document Vault metadata/link model with a provider-neutral object-storage boundary
- Deterministic commercial readiness, Phase 03 Command/search/create expansion, and commercial settings

## Commercial data rules

- Monetary values use ISO 4217 three-letter currency codes and fixed-scale decimal strings; no live or silent exchange rate is applied.
- Supplier and packaging prices append historical rows. Old quotes and cost snapshots are never recalculated from current master data.
- Volume and weight normalize within their dimension. Crossing dimensions requires an entered density; packs/cases require an explicit count factor.
- Purchase cost is the packages paid for; consumed cost is only the quantity used. Missing required cost inputs block a complete COGS claim.
- A finished configuration references either a formula version or manufacturer catalog product, never a fabricated white-label formula.
- PostgreSQL stores document metadata and links only. Raw files require a future `ObjectStorage` adapter; the unavailable adapter fails closed.

## Documentation map

- `AGENTS.md` — permanent agent, architecture, quality, brand, and Git rules
- `PLANS.md` — execution loop, validation, stop conditions, and definition of done
- `BUILD_STATUS.md` — current phase ledger and real validation state
- `ARCHITECTURE_DECISIONS.md` — durable decisions and invariants
- `docs/PRODUCT_VISION.md` — users, lifecycle, supplied product facts, and non-goals
- `docs/BRAND_SYSTEM.md` — permanent visual and interaction system
- `docs/MASTER_BUILD_PLAN.md` — phase dependencies and roadmap
- `docs/phases/` — detailed scope and acceptance contract for each phase
- `docs/deployment/` — Vercel environments, database releases, object storage, and deployment checklists

## Roadmap

1. Foundation and Design System
2. Product Pipeline, Formulas, Ingredients, and R&D
3. Sourcing, Manufacturers, White Label, Packaging, and Costing
4. Inventory, Purchasing, Production, and Traceability
5. Quality, Stability, Labels, and Complaints
6. Launches, Shopify, and Market Performance
7. Operational Intelligence and Forecasting
8. Security, Hardening, and Deployment

Current limitations are explicit: no authentication provider is integrated, no external database/private object storage or protected Vercel project is provisioned, and canonical fallback data is read-only without PostgreSQL. Do not expose a Production deployment publicly before the future Private Beta gate. Git is on `main` and nothing has been pushed during this work.

After Phase 03 review and external acceptance, the recommended next phase is Phase 04 — Inventory, Purchasing, Production, and Traceability. Phase 04 has not started.
