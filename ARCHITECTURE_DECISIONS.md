# Legacy House Architecture Decisions

This is a compact decision log. Decisions are immutable records: supersede them with a new entry rather than silently rewriting their meaning. “Accepted” decisions govern future implementation; “Proposed” decisions must be confirmed during the named phase.

## ADR-001 — PostgreSQL is the persistent source of truth

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Store authoritative business data in PostgreSQL. Local/browser storage may hold only preferences, temporary drafts, and recovery state.
- **Reason:** Relational integrity, transactions, auditability, reporting, and future operational scale require one durable authority.
- **Consequences:** Schema changes use reviewed migrations; backup/restore and connection security are deployment requirements; offline drafts need explicit reconciliation.

## ADR-002 — Use exactly one ORM

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Use one ORM across the application; Drizzle is the empty-repository baseline pending Phase 1 confirmation.
- **Reason:** Multiple persistence abstractions create divergent models, migration ownership, and transaction behavior.
- **Consequences:** Direct SQL is reserved for documented cases and remains inside the persistence boundary. Any different ORM choice must supersede this ADR before schema work.

## ADR-003 — Root logo.png is the official emblem

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Preserve root `logo.png` as the official hero icon, application emblem, and loading mark. Do not replace, redraw, overwrite, recolor, or introduce a competing emblem.
- **Reason:** The supplied asset is authoritative brand identity.
- **Consequences:** UI work references the asset responsively, supplies accessible context, and uses restrained motion around—not destructive edits to—the file.

## ADR-004 — Approved formulas are versioned records

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** A formula has immutable versions and explicit lifecycle state. Production-ready or approved versions are never edited in place.
- **Reason:** Reproducibility, founder decisions, quality investigations, costing, and production history depend on exact composition.
- **Consequences:** New revisions create versions; approvals record actor/time; totals and dimensions validate; batches reference a version and preserve a snapshot.

## ADR-005 — Units enforce physical dimensions

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Store normalized quantities with unit and dimension metadata. Never convert weight and volume without an explicit sourced density and context.
- **Reason:** `1 mL = 1 g` is unsafe for general ingredients and can corrupt formulas, inventory, and costs.
- **Consequences:** Conversion services reject incompatible dimensions; density carries provenance and validity; display units do not change stored meaning.

## ADR-006 — Inventory uses an immutable transaction ledger

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Derive on-hand balances from posted inventory transactions. Correct posted entries through linked reversals and replacements, never mutation or deletion.
- **Reason:** Traceability and reconciliation require a complete history.
- **Consequences:** Transactions are idempotent and auditable; availability excludes ineligible statuses; negative inventory is rejected or routed through explicit authorized exception policy.

## ADR-007 — Production preserves snapshots and separates completion from release

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Production records snapshot the formula, configuration, planned quantities, relevant lot allocations, and cost context. Completion does not imply quality release.
- **Reason:** Later master-data changes must not rewrite batch history, and quality disposition is a distinct control.
- **Consequences:** Planned and actual consumption remain separate; released inventory requires a recorded disposition.

## ADR-008 — White-label products do not require invented formulas

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Represent white-label products through product, vendor, sample, quote, specification, document, and status records even when the internal formula is unknown.
- **Reason:** A fabricated formula is worse than an explicit unknown and misrepresents vendor-owned information.
- **Consequences:** Formula linkage is optional; unknown fields remain unknown; claims and facts retain source/provenance.

## ADR-009 — Shopify integration begins read-only

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Initial Shopify integration imports/synchronizes permitted catalog, order, and performance data without writing back to Shopify.
- **Reason:** Read-only scope limits operational risk while identity mapping, retries, reconciliation, and permissions mature.
- **Consequences:** Write-back requires a later ADR, explicit authorization, idempotency, audit events, and rollback/reconciliation design.

## ADR-010 — AI follows structured data

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** AI features operate over permission-filtered structured records, cite their source records, label uncertainty, and never become the authoritative store or silently approve/change controlled data.
- **Reason:** Operational trust depends on provenance, deterministic calculations, access control, and human accountability.
- **Consequences:** AI is deferred until domain data is mature; suggestions require review; prompt/output handling must meet security and retention rules.

## ADR-011 — One modular web application is the initial topology

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Start with one Next.js App Router application using strict TypeScript, modular domain boundaries, server-side capabilities, and separately testable services.
- **Reason:** The empty repository does not justify distributed services; a modular monolith minimizes operational burden while preserving future seams.
- **Consequences:** No nested/second application; background work and integrations use explicit boundaries; extraction requires measured need and a superseding ADR.

## ADR-012 — Facts and temporal values carry provenance

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Distinguish actual, quoted, estimated, calculated, and forecast values. Supplier prices, costs, claims, test results, and external facts carry source and effective/observed time where applicable.
- **Reason:** Operational and regulatory decisions must not blur assumptions with evidence.
- **Consequences:** UI labels value class; historical rows are preserved; no seeded production-looking data without clear fixture labeling.

## ADR-013 — Provider-neutral identity with deny-by-default authorization

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Keep Phase 1 identity mapping provider-neutral through an external subject, internal roles, and capability policies that deny actors with no assigned role. Select and integrate a production authentication provider only with deployment and ownership requirements.
- **Reason:** No authoritative identity provider or access lifecycle was supplied. Inventing one would create avoidable lock-in and a false security claim.
- **Consequences:** Public foundation surfaces contain no controlled business records; future protected routes must resolve a verified external identity before policy evaluation; provider integration and session hardening remain explicit work.

## ADR-014 — pnpm, Node.js 24, and layered test tooling

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Use pnpm 11 with a locked dependency graph on Node.js 24. Use Vitest/Testing Library for domain and component checks, PGlite for clean PostgreSQL migration validation, and Playwright Chromium for desktop/mobile browser behavior.
- **Reason:** The combination provides fast deterministic feedback, PostgreSQL-compatible migration evidence without production credentials, and real-browser responsive/reduced-motion coverage.
- **Consequences:** Required dependency build scripts are explicitly allowlisted; CI installs Chromium; deployment still uses PostgreSQL rather than PGlite.

## ADR-015 — Initialize local Git without manufacturing history

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Initialize the supplied folder on `main`, configure the supplied GitHub URL as `origin`, and leave all work uncommitted and unpushed for owner review.
- **Reason:** The folder contained no `.git` metadata and the remote exposed no refs. Initialization was authorized, but rewriting or inventing remote history was not.
- **Consequences:** Git status is meaningful locally; the owner controls the first commit and push; the existing folder is not renamed.

## ADR-016 — Serve the root emblem without a duplicate asset

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** A server route streams root `logo.png` at `/emblem`, and one `LegacyHouseMark` component provides semantic or decorative use throughout the UI.
- **Reason:** Next.js normally serves public assets from `public`, but copying the emblem would create a second asset capable of drifting from the official root source.
- **Consequences:** The route reads the unchanged root file at runtime; source and served hashes can be compared; no generated or competing emblem is permitted.

## ADR-017 — Database absence is explicit and non-authoritative fallbacks stay read-only

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Builds and the branded foundation may run without `DATABASE_URL`, while `/api/ready`, persistence controls, creation actions, migration, and seed commands report the database as unavailable. Canonical product-line definitions and setting defaults may support read-only orientation but are never represented as persisted records.
- **Reason:** Phase 1 must be inspectable without credentials and must not fabricate persistence or silently move authoritative data into the browser.
- **Consequences:** Real readiness requires a successful PostgreSQL query. Writes return a truthful service-unavailable response when disconnected. Real migration and seed verification remain blocked until a PostgreSQL service is supplied.

## ADR-018 — Typed registries own navigation, search, and create availability

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Keep global destinations, grouped search entries, and currently permitted create actions in typed registries rather than duplicating them across desktop and mobile components.
- **Reason:** One registry prevents route drift, inaccessible mobile-only omissions, and UI claims for workflows that do not exist.
- **Consequences:** Future phases add entries only when their destinations or creation flows work; registry tests enforce uniqueness and phase boundaries.

## ADR-019 — Workspace settings are typed; only experience preferences use local storage

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Persist shared workspace defaults as a versionable JSON value in PostgreSQL through the settings repository. Permit local storage only for reduced motion and desktop-sidebar collapse because those are device experience preferences.
- **Reason:** Currency, unit, precision, date, and product-context defaults affect future domain presentation and need one authority; device-specific comfort preferences should apply even while the database is unavailable.
- **Consequences:** Settings UI distinguishes device behavior from unavailable database persistence. Formatters consume the typed settings contract. Browser storage must not contain authoritative business data.

## ADR-020 — Native HTML and CSS own foundation interaction and motion

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Use native dialogs, inputs, landmarks, and links with repository CSS/SVG for the Phase 1 shell and motion; add no component or animation framework.
- **Reason:** Native semantics reduce dependency weight and provide strong keyboard/focus behavior for bounded foundation interactions.
- **Consequences:** Dialog focus behavior follows the platform; all custom visual controls preserve a real native control; operating-system and workspace reduced-motion states disable nonessential effects.

## ADR-021 — Replit uses the same root app and explicit release sequence

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Replit runs the single root application on `0.0.0.0` and the supplied `PORT`. Deployment installs/builds, then migrates, idempotently seeds authorized foundation records, and starts the production server.
- **Reason:** One runtime path avoids a Replit-only duplicate app and makes database preparation visible.
- **Consequences:** `DATABASE_URL` must be a Replit Secret; migration/seed failure prevents a misleading healthy deployment; hosted Replit behavior remains unverified until a workspace is supplied.

## ADR-022 — Formula arithmetic uses fixed-scale decimal strings

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Formula percentages, batch quantities, and densities cross boundaries as decimal strings and are calculated with a BigInt fixed-scale engine. PostgreSQL numeric columns store controlled scale; JavaScript floating-point values are not authoritative.
- **Reason:** Exact totals and reproducible batch sheets must not accumulate binary floating-point drift.
- **Consequences:** Display rounding is separate from stored/calculated values. Volume-to-weight conversion requires explicit density; absent density produces an explicit unavailable result.

## ADR-023 — Formula version numbers and controlled-state immutability

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Formula versions use `major.minor` identifiers. Creating a version copies composition and production steps inside a transaction; controlled statuses are read-only and revisions create a new version.
- **Reason:** Development comparison and later production traceability require preserved historical composition.
- **Consequences:** Draft and experimental versions may be edited in place. Submitting review changes lifecycle state; approved/production history cannot be overwritten.

## ADR-024 — Product lifecycle changes are explicit and archival is reversible data preservation

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Product status and priority changes use validated actions and optimistic timestamps. Archive sets the record inactive, records the archived time and archived status, and preserves all related records.
- **Reason:** Silent state mutation and deletion destroy product-development history.
- **Consequences:** Active pipeline queries exclude archived products. UI archival requires explicit typed confirmation; activity events explain persisted state changes.

## ADR-025 — Activity and attention claims are deterministic

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Persisted mutations emit database activity events. Command attention items are deterministic rules over missing brief fields, formula totals/status, and experiment state—not invented analytics or AI conclusions.
- **Reason:** Operational summaries must be traceable to real records.
- **Consequences:** Read-only canonical definitions do not manufacture event history. Counts are labeled and derived from the loaded snapshot.

## ADR-026 — Phase 02 search is snapshot-backed and scoped

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Global search builds typed, grouped entries from the current Phase 02 snapshot for products, formulas, ingredients, experiments, notes, and decisions. It is navigation search, not an external full-text index.
- **Reason:** Current dataset scale and scope do not justify another persistence system.
- **Consequences:** Search respects only loaded records and explicit fields. Ranking/index infrastructure requires measured need and a later decision.

## ADR-027 — Browser draft recovery is non-authoritative

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Product-brief text may autosave locally for crash/reload recovery, but only an explicit validated PostgreSQL save changes the authoritative brief.
- **Reason:** Draft resilience is useful while business data still needs one durable authority and visible commit semantics.
- **Consequences:** The UI labels draft versus persisted state. Local drafts contain no supplier, inventory, production, quality, or market records and may be cleared after successful save.

## ADR-028 — Experiments are product-local numbered evidence records

- **Status:** Accepted
- **Date:** 2026-07-13
- **Decision:** Experiments receive a transactionally assigned product-local `EXP-###` number and link to an exact formula version. Completion requires at least one observation and an explicit result/conclusion.
- **Reason:** R&D evidence must remain tied to the tested composition and readable in founder workflows.
- **Consequences:** Observation flags and optional sensory scores are working evidence, not safety, efficacy, stability, or certification claims. Production and quality approval remain later phases.
