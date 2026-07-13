# Phase 2 — Product Pipeline, Formulas, Ingredients, and R&D

## Objective and dependencies

Deliver the CREATE domain: a truthful product pipeline and evidence-backed R&D history. Requires completed Phase 1 identity, authorization, units, audit, UI, database, and test foundations.

## Domain model

- `ProductLine`, `Product`, development path, lifecycle state, brief, milestone/state transition, owner, decision, note, tag, and sourced evidence/document.
- `Ingredient` identity/synonyms and known specifications with provenance; density is optional, unit-qualified, sourced, and effective-dated.
- `Formula`, immutable `FormulaVersion`, formula lines, basis/dimension, totals, approval state and approval event.
- `Experiment`, linked formula version, hypothesis, procedure, observations, measurements, outcome, follow-up, and attachments.

Use stable IDs and explicit state transitions. White-label products may omit formula relationships. Seed/import only the user-supplied Legacy Reserve formula and named Legacy Sanctum planning records when authorized; preserve all unknowns.

## Screens and workflows

Portfolio/pipeline with truthful counts; create/edit product brief; product workspace and lifecycle history; ingredient directory/detail; formula editor, validation, compare, version history, scaling preview, and approval; experiment log/detail and decision/evidence timeline. Mobile layouts preserve units, state, and provenance.

## Services and invariants

Product lifecycle policy; formula version/create-revise-approve service; dimensional quantity/conversion and batch scaling; evidence/provenance linking; experiment/decision history. Approved versions are immutable. Percent formulas validate totals and basis. Weight↔volume conversion rejects missing density. The premixed oil base is one formula input with known constituents but unknown internal percentages.

## Test plan

State-transition permissions/history; formula total precision and immutable revisions; dimension incompatibility and sourced-density cases; exact 42 fl oz supplied oil batch calculation; concurrent revision behavior; white-label product without formula; experiment provenance; accessibility of editor errors and comparisons; integration tests across repositories and audit events.

## Acceptance criteria

A user can trace product intent, development path, state history, ingredients, formula versions, experiments, evidence, and decisions. The supplied oil formula calculates exactly from stored facts without inventing base proportions. The nine Sanctum records, if loaded, remain Research/White Label with absent unknown facts. All validation/build/Replit checks pass and docs/status/ADRs reflect implementation.

## Non-goals and stop conditions

No suppliers, quotes/costs, purchasing, inventory, production execution, quality release, claims approval, Shopify, or forecasts. Stop on unclear authoritative data, unsafe unit conversion, mutability of approved records, permission gaps, failing validation, or achieved acceptance. Recommend Phase 3 only.

## Implementation record — 2026-07-13

Phase 02 was explicitly authorized and implemented in the single root application. The domain/schema/repository, authorized idempotent seeds, product pipeline/workspace, Formula Vault/builder/calculator/version history, ingredient intelligence, R&D experiments/observations, Command, global search/create, responsive behavior, and automated coverage are present. Canonical definitions remain read-only when PostgreSQL is unavailable.

Local clean-database migration and persistence tests pass. External PostgreSQL migration/seed and hosted Replit acceptance remain blocked because neither environment was supplied. See `BUILD_STATUS.md` for the exact current evidence and open debt. Phase 03 has not started.
