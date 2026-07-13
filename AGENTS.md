# Legacy House Agent Instructions

These instructions apply to the entire repository. More-specific `AGENTS.md` files may add constraints but must not weaken these rules.

## Mission and product boundaries

Legacy House is Groomed Gent Co.'s private product intelligence and operations platform for Legacy Reserve, Legacy Sanctum, and future product lines. It supports four permanent operating pillars:

- **CREATE:** research, concepts, briefs, formulas, R&D, refinement, and founder decisions.
- **BUILD:** ingredients, suppliers, manufacturers, white-label catalogs, packaging, samples, quotes, costing, margins, and launch preparation.
- **CONTROL:** inventory, purchasing, receiving, production, lots, traceability, quality, stability, labels, complaints, change control, and records.
- **SCALE:** Shopify, launches, performance, demand, reorders, forecasting, portfolio decisions, and operational intelligence.

Build a coherent operating system, not disconnected CRUD screens. Do not begin work outside the active phase.

## Required preflight

Before feature work, read in order:

1. `AGENTS.md`
2. `docs/PRODUCT_VISION.md`
3. `docs/MASTER_BUILD_PLAN.md`
4. `BUILD_STATUS.md`
5. `ARCHITECTURE_DECISIONS.md`
6. The active document in `docs/phases/`
7. Relevant source, migrations, tests, configuration, and current Git status

Confirm scope, dependencies, risks, and validation before editing. Preserve legitimate work and inspect local changes before modifying overlapping files.

## Phase execution

- Follow the dependency order in `docs/MASTER_BUILD_PLAN.md`; one major phase is active at a time.
- Keep work within the active phase and its acceptance criteria. Do not opportunistically begin the next phase.
- Use the loop in `PLANS.md` for long-running work.
- Add schema changes, validation, error handling, responsive behavior, accessibility, and tests with the feature.
- Never present visible controls that do nothing.
- Stop on failed validation, destructive migration risk, missing authority, unclear factual product data, or a scope decision that materially changes the plan.
- At phase completion, update `BUILD_STATUS.md` and any affected architecture decisions before recommending the next phase.

## Architecture rules

- Maintain one application and one PostgreSQL source of truth. Do not create nested or duplicate apps.
- Use one ORM only. The initial recommendation is Drizzle unless Phase 1 documents a stronger reason.
- Prefer strict TypeScript, typed repositories, domain services, Zod boundary schemas, reusable accessible components, and thin routes/pages.
- Keep business rules out of page components and transport handlers.
- Separate domain, application, infrastructure, and presentation concerns without ceremonial abstraction.
- Avoid `any`, hidden global state, unnecessary dependencies, hardcoded secrets, and machine-specific absolute paths.
- Local storage is limited to temporary drafts, preferences, and recovery state; it is never authoritative business storage.
- Model external integrations behind explicit adapters. Shopify begins read-only.
- AI may interpret or assist structured records; it must not replace authoritative structured data, approvals, calculations, or audit history.
- Add or revise an ADR in `ARCHITECTURE_DECISIONS.md` for durable architecture decisions.

## Data integrity and factuality

- Version approved formulas; never silently overwrite a production-ready formula.
- Snapshot formula versions, configuration, and relevant costs for production history.
- Preserve historical supplier prices and historical costs.
- Inventory is an immutable transaction ledger. Correct posted entries with linked reversals.
- Keep planned and actual consumption separate. Do not allow silent negative stock.
- Exclude quarantined, held, rejected, and expired stock from availability.
- Keep production completion separate from internal batch release.
- Enforce unit dimensions. Never assume `1 mL = 1 g`; weight-volume conversion requires an explicit sourced density and conversion context.
- White-label products may exist without internal formulas. Never fabricate them.
- Clearly label actual, quoted, estimated, calculated, and forecast values.
- Do not invent formulas, blend proportions, densities, suppliers, manufacturers, prices, inventory, sales, certifications, tests, claims, approvals, shelf life, analytics, regulatory conclusions, or customer data.
- Treat the canonical Legacy Reserve formula and named Legacy Sanctum planning records in `docs/PRODUCT_VISION.md` as supplied facts; do not extrapolate missing facts.

## Brand and experience

- Root `logo.png` is the official hero and application emblem. Never replace, redraw, overwrite, recolor, or create a competing mark.
- Follow `docs/BRAND_SYSTEM.md`. Obsidian carries the interface; gold conveys authority and hierarchy; purple supplies depth and intelligence.
- Avoid generic SaaS, bright-white dashboards, blue-primary styling, gaming/crypto motifs, meaningless effects, fake metrics, fake charts, stock imagery, tiny low-contrast text, and excessive rounding or glow.
- Design small mobile, large mobile, tablet, laptop, and large desktop together. No horizontal overflow.
- Use semantic HTML, explicit labels, keyboard operation, visible focus, touch-friendly controls, strong contrast, non-color-only status, accessible dialogs, readable table alternatives, chart summaries, and clear loading/empty/error states.
- Honor reduced motion. Motion must communicate system state or hierarchy, never merely decorate.

## Tests and validation

Run every command that exists and applies: migrations or migration checks, fixtures when explicitly required, format/lint, type-check, unit/integration tests, production build, and runtime smoke checks. Add tests at the appropriate layer for business invariants, authorization, calculations, data boundaries, accessibility-critical interactions, and regressions. Never report an unavailable command as passing.

Record commands and exact results in `BUILD_STATUS.md`. Fix errors introduced by the active work. Do not advance with failing required validation.

## Vercel and environment

- Keep setup reproducible from repository files and standard commands; do not rely on local-only paths or uncommitted global tools.
- Keep secrets in environment variables, document them in `.env.example`, and never commit credentials.
- Vercel is the official hosting platform. Keep the single root Next.js application compatible with normal Vercel framework detection.
- Use PostgreSQL through one environment-scoped `DATABASE_URL`; use a serverless-compatible pooled URL where the provider offers one.
- Never run migrations or seeds as part of `pnpm build` or every deployment. Database release commands are explicit, reviewed operations.
- Preview and Production must use different database credentials. Preview writes are disabled by default.
- Never use the Vercel Function filesystem as persistent storage. Private documents require authenticated external object storage behind the repository interface.
- Production data access remains disabled until the separate Private Beta authentication gate is implemented and verified.
- Vercel runtime and protected Preview checks replace the historical Replit acceptance requirement.

## Git restrictions

- Do not push, force-push, rewrite history, change remotes, or delete user work unless explicitly authorized.
- Do not use destructive Git commands to clean a working tree.
- Use focused changes and report the branch/status. If Git metadata is absent, state that plainly; do not initialize or clone over the directory without approval.

## Reporting contract

Every major handoff reports: scope completed; files changed; work preserved; architecture/data decisions; migrations; validation commands and results; accessibility/responsive coverage; Vercel result; known issues and blockers; Git status; and the single recommended next action. Claims must be evidence-based.
