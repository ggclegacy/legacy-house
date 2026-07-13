# Phase 1 — Foundation and Design System

> **Implementation status (2026-07-13):** Implemented and locally validated. Final phase acceptance remains blocked on running the migration/seed against an actual supplied PostgreSQL service and validating a hosted Replit workspace. Phase 2 has not begun.

## Objective and dependencies

Create one reproducible, accessible application foundation on which every later domain can safely build. Begin only after initialization review and a user-approved approach to the missing local Git metadata. Confirm the proposed Next.js/TypeScript/PostgreSQL/Drizzle/Zod stack, package manager, supported runtime, identity approach, and test tools; supersede ADRs if evidence requires another choice.

## In scope

- Scaffold one root application—never a nested or second app—with strict TypeScript and minimal dependencies.
- Establish modular boundaries, environment validation, PostgreSQL connection, one migration workflow, health/readiness behavior, structured errors/logging, and initial authorization/audit interfaces.
- Implement responsive application shell and the official `logo.png` hero with CREATE/BUILD/CONTROL/SCALE relationships, accessible static meaning, and reduced-motion support.
- Define design tokens, typography, spacing, focus, form, status, table/mobile, dialog, feedback, empty/error/loading states, and product-line theming.
- Add lint, formatting, type-check, unit/integration/browser tests, production build, CI baseline, `.env.example`, and Replit run configuration.

## Initial data and service boundaries

Model only foundation needs: product lines; identity/user mapping and roles as required by the chosen authentication design; audit-event envelope; units and physical dimensions; and shared attachment metadata if storage is explicitly selected. Keep authorization policies and audit recording behind interfaces. Do not create speculative domain tables.

Configuration validation must fail clearly on missing secrets. Migrations have one owner. Health checks distinguish process liveness from dependency readiness without leaking secrets.

## Screens

Branded home/orientation hero; responsive authenticated shell/navigation; signed-out, unauthorized, not-found, loading, empty, and error surfaces; a development-only component showcase if it materially improves consistency. No fake dashboard metrics or placeholder product records.

## Test plan

- Clean database migration and schema repeatability.
- Environment failure/success, database health, authorization deny-by-default, and audit envelope tests.
- Keyboard navigation, focus management, semantic landmarks, contrast, reduced motion, zoom/reflow, and mobile-to-large-desktop layouts.
- Logo source hash remains unchanged; hero static and reduced-motion states remain understandable.
- Lint, strict type-check, test suites, production build, secret scan, Replit host/`PORT` smoke test.

## Acceptance criteria

- A fresh environment can install, migrate, test, build, and run using documented commands and no local-only assumptions.
- PostgreSQL and the single ORM are wired with safe migrations; no authoritative business data uses browser storage.
- The shell and hero match `BRAND_SYSTEM.md`, use root `logo.png` unchanged, and pass agreed accessibility/responsive checks.
- Authorization/audit seams are testable, dependencies are justified, CI runs required checks, and README/ADRs/status are current.

## Non-goals and stop conditions

No product pipeline, formulas, vendors, stock, production, quality, commerce, forecasts, or fabricated data. Stop after foundation acceptance; also stop for unresolved identity/runtime choices, unsafe Git reconciliation, migration risk, inaccessible brand implementation, failing checks, or missing Replit proof. Recommend Phase 2 but do not begin it.
