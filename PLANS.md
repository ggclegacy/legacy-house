# Legacy House Execution Contract

This document defines how Codex executes work that spans more than a small isolated change.

## Read before planning

Read `AGENTS.md`, `docs/PRODUCT_VISION.md`, `docs/MASTER_BUILD_PLAN.md`, `BUILD_STATUS.md`, `ARCHITECTURE_DECISIONS.md`, the active phase file, and all relevant code/configuration/tests. Inspect Git status before edits. Resolve conflicts between a request and repository rules explicitly; user instructions control scope, while data-integrity and safety constraints remain mandatory.

## Phase order

The default order is Phase 1 through Phase 8 in `docs/MASTER_BUILD_PLAN.md`. A later phase may be planned early but may not be implemented until its declared dependencies and earlier integrity controls are satisfied. Security, accessibility, testing, auditability, and documentation are continuous responsibilities even though final hardening is Phase 8.

## Execution loop

1. **Orient:** establish current state, active phase, prior decisions, local changes, facts, and unknowns.
2. **Scope:** restate the phase outcome, in-scope work, non-goals, dependencies, risks, and acceptance criteria.
3. **Plan:** create verifiable slices ordered by dependency; mark only one slice active.
4. **Implement:** make the smallest coherent change, preserving established patterns and historical data.
5. **Validate continuously:** run targeted tests during each slice; do not defer all testing to the end.
6. **Inspect:** review the diff, error paths, authorization, data migrations, responsive behavior, accessibility, and observability.
7. **Reconcile:** update tests, docs, ADRs, environment examples, and `BUILD_STATUS.md` to match reality.
8. **Handoff:** report evidence, blockers, limitations, and exactly one recommended next phase or corrective action.

If interrupted, continue from the first incomplete checklist item in `BUILD_STATUS.md`; do not redo completed work or silently widen scope.

## Validation contract

Use repository-defined commands once they exist. A normal completed phase must include:

- migration generation/check and a clean-database migration test when the schema changes;
- seed/fixture validation only when non-production fixtures are part of scope;
- lint/format check;
- strict type-check;
- unit and integration tests, plus end-to-end tests for critical workflows;
- production build;
- runtime smoke test in the standard Next.js/Vercel function model;
- accessibility and responsive checks appropriate to changed screens;
- a final diff and secret scan.

Record pass, fail, or unavailable for every applicable check. “Unavailable” is a blocker when the active phase requires that capability.

## Stop conditions

Stop and request direction when:

- required source material or authoritative product data is missing and proceeding would require fabrication;
- a destructive migration, history rewrite, remote change, credential use, or external write lacks authorization;
- existing user work cannot be preserved safely;
- the requested direction conflicts with a recorded invariant and no approved ADR changes it;
- a major product or architecture choice has materially different outcomes and cannot be resolved from repository context;
- required validation fails and cannot be corrected within phase scope;
- the active phase acceptance criteria are met—do not start the next phase automatically.

## Definition of done

A phase is done only when its acceptance criteria are met; data invariants and authorization are enforced; migrations are safe; error/loading/empty states are complete; mobile, desktop, keyboard, focus, contrast, and reduced-motion behavior are verified where applicable; tests and build pass; Vercel build/function behavior and environment isolation are verified; documentation and decisions reflect the implementation; and `BUILD_STATUS.md` names the next phase without beginning it.
