# Legacy House

Legacy House is Groomed Gent Co.'s private Product Intelligence OS. It is planned to connect product creation, sourcing and costing, operational control, and market intelligence across Legacy Reserve, Legacy Sanctum, and future product lines.

## Current repository state

Phase 2 is implemented locally and awaiting review, with external-environment verification blocked. The single root application now includes the Phase 1 foundation plus product pipeline/workspaces, ingredients, immutable formula versions and exact batch calculation, R&D experiments, dynamic Command/search/create behavior, PostgreSQL models and migrations, CI, and Replit-compatible runtime configuration. A real PostgreSQL migration/seed and hosted Replit run remain unverified because neither environment was supplied.

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

Set `DATABASE_URL` in `.env.local` before database commands. Development and production servers bind to `0.0.0.0` and respect `PORT`.

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

`pnpm db:seed` idempotently establishes the two authorized product lines, the supplied Legacy Reserve Hair & Beard Oil formula facts, and nine named Legacy Sanctum research/white-label planning records with unknown fields left unknown. It records no supplier, price, inventory, manufacturing, certification, test-result, sales, or analytics claims.

## Environment and Replit

| Variable       | Required                    | Purpose                                                 |
| -------------- | --------------------------- | ------------------------------------------------------- |
| `DATABASE_URL` | Database commands/readiness | PostgreSQL connection string; never commit a real value |
| `PORT`         | Optional                    | Runtime port; defaults to `3000`                        |

`.replit` declares Node.js 24, PostgreSQL 16, development, build, migration, foundation seed, and production commands. Add `DATABASE_URL` as a Replit Secret, then run the project. `/api/health` reports process liveness; `/api/ready` returns `503` until PostgreSQL is configured and reachable. Local production host/port behavior is validated; a hosted Replit deployment still requires a provisioned workspace and secret.

## Architecture overview

The system is a modular monolith. `src/app` owns routes and transport, `src/presentation` owns reusable UI, `src/domain` owns policy and calculations, `src/services` owns use-case orchestration, and `src/infrastructure` owns PostgreSQL/Drizzle implementation. Zod validates trust boundaries. Typed registries own global navigation/search/create availability. The schema contains the foundation plus products, briefs, notes, decisions, ingredients, formula families/versions/lines/steps, experiments, and observations.

Authentication-provider selection is intentionally deferred. The foundation stores provider-neutral external subjects and enforces a deny-by-default authorization policy seam; no protected product workflow exists yet.

The official `logo.png` remains in the project root and is the hero/app emblem. It must not be replaced, redrawn, overwritten, or competed with by another mark.

## Implemented modules

- Responsive branded shell and command-core hero for CREATE, BUILD, CONTROL, and SCALE
- Complete desktop/mobile navigation and structural routes for every planned module
- Grouped global search and a registry-driven create dialog with truthful availability
- Settings for currency, units, precision, date format, product-line context, reduced motion, and sidebar behavior
- Product-line repository/service boundaries and authorized idempotent foundation seed
- Loading, error, not-found, and unauthorized states
- Liveness and database-readiness endpoints
- PostgreSQL/Drizzle foundation schema and generated migration
- Environment validation, deny-by-default capability policy, and audit event contract
- Unit, integration, clean-migration, desktop/mobile, reduced-motion, and runtime tests
- CI and Replit-compatible configuration
- Product Pipeline, product workspaces, structured briefs, notes, decisions, and activity
- Formula Vault, immutable versioning, composition validation, exact batch scaling, and production steps
- Ingredient intelligence with explicit unknown/density boundaries and formula usage
- R&D experiments, observations, sensory scoring, completion, and evidence-oriented history
- Dynamic Command metrics, attention items, activity, and Phase 02 search/create actions

## Documentation map

- `AGENTS.md` — permanent agent, architecture, quality, brand, and Git rules
- `PLANS.md` — execution loop, validation, stop conditions, and definition of done
- `BUILD_STATUS.md` — current phase ledger and real validation state
- `ARCHITECTURE_DECISIONS.md` — durable decisions and invariants
- `docs/PRODUCT_VISION.md` — users, lifecycle, supplied product facts, and non-goals
- `docs/BRAND_SYSTEM.md` — permanent visual and interaction system
- `docs/MASTER_BUILD_PLAN.md` — phase dependencies and roadmap
- `docs/phases/` — detailed scope and acceptance contract for each phase

## Roadmap

1. Foundation and Design System
2. Product Pipeline, Formulas, Ingredients, and R&D
3. Sourcing, Manufacturers, White Label, Packaging, and Costing
4. Inventory, Purchasing, Production, and Traceability
5. Quality, Stability, Labels, and Complaints
6. Launches, Shopify, and Market Performance
7. Operational Intelligence and Forecasting
8. Security, Hardening, and Deployment

Current limitations are explicit: no authentication provider is integrated, no external database or hosted Replit workspace is provisioned, and canonical fallback data is read-only without PostgreSQL. Git is on `main` with the supplied empty repository as `origin`, but there are no commits and nothing has been pushed.

After Phase 2 review and acceptance, the recommended next phase is Phase 3 — Sourcing, Manufacturers, White Label, Packaging, and Costing. Phase 3 has not started.
