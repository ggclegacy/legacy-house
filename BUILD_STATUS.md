# Legacy House Build Status

## Current state

- **Current phase:** Phase 4 — bounded Production batch-planning slice
- **Status:** Production prompts 01–09 are locally complete; inventory, purchasing, traceability, external database, and hosted acceptance remain outside this slice or blocked
- **Last updated:** 2026-07-15 (America/Chicago)
- **Next recommended action:** Review the bounded Production workflow. Do not begin inventory, purchasing, lots, consumption, finished goods, or another phase automatically.

## Production module build sequence

- Production Prompt 01 complete — the working formula-detail calculator, incomplete Production boundary, canonical seed/fallback formula, decimal-safe calculations, and absent canonical production steps were audited; no duplicate make-batch route required removal.
- Production Prompt 02 complete — the mobile dock now exposes Command, Products, Production, Search, and Create directly, with Production routed to `/modules/production` and existing dialog behavior preserved.
- Production Prompt 03 complete — `/modules/production` now opens a focused real-data home with the active Reserve formula, defaults, honest missing-formula state, and working Build Batch, Open Formula, and Formula Vault routes.
- Production Prompt 04 complete — `/production/batch-builder` provides instant decimal-safe presets/custom inputs, fl oz and mL outputs, optional density-based grams, selectable precision, and a hard 100% formula-total gate.
- Production Prompt 05 complete — canonical Reserve percentages, 10/20/30/40/50 bottle totals, exact 20-bottle fl oz/mL outputs, and density-required gram states are locked by decimal-safe tests.
- Production Prompt 06 complete — focused Batch Mode preserves in-session phase/step/note state, copies and prints the worksheet, and saves an immutable calculation-only Batch Plan without inventory, lots, consumption, reservations, outputs, or production history.
- Production Prompt 07 complete — Batch Mode now uses stored exact-version steps when present or the authorized ten-heading editable draft, with reorder, instruction/note editing, required/check-off state, and worksheet printing without invented technical values.
- Production Prompt 08 complete — Production Home, Batch Builder, and Batch Mode now use the locked obsidian, purple-glass, ivory, and restrained gold-edge system with premium measurement cards, one focused phase, and persistent execution actions.
- Production Prompt 09 complete — 320/375/390/430px geometry and the one-handed custom-count workflow pass with readable density-safe measurements, unobstructed controls, check-off steps, Copy, Print, stock-neutral Save, and working Production navigation.
- Production final validation — `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, 120/120 unit/integration tests, `pnpm db:check`, both focused Production browser scenarios, and `pnpm build` (27/27 generated pages) passed. External PostgreSQL save/migration and Vercel were not run because credentials/project access were not supplied; the local API fails honestly without `DATABASE_URL`.

## Command page build sequence

- Homepage rebuild Prompt 01 complete — section order preserved; below-hero spacing, heading scale, module density, and action hierarchy are compact and scan-first without changing routes or data.
- Homepage rebuild Prompt 02 complete — all below-hero modules now share rounded featured, standard, compact, and action-card glass treatments with consistent focus and pressed states.
- Homepage rebuild Prompt 03 complete — below-hero color, depth, and typography now use the locked luminous plum, dimensional gold, warm ivory, and muted lavender hierarchy.
- Homepage rebuild Prompt 04 complete — each existing homepage workspace now uses one calm featured record, compact supporting modules, clean action rails, and honest states within the shared card system.
- Homepage rebuild Prompt 05 complete — 320–430px layouts use bounded snap rails, compact type and readiness cards, 44px controls, reduced-motion-safe interactions, and bottom-dock clearance without page overflow.
- Homepage rebuild validation — all five production builds passed (24 pages); format, lint, type-check, 109 unit tests, schema check, homepage action checks, and six-viewport workspace/portfolio geometry passed. One pre-existing route smoke assertion remains mismatched: `/modules/product-pipeline` renders the working `Product Development` H1 while the test expects `Product Pipeline`.

- Prompt 01 complete — Command Core preserves the official emblem, four routed pillars, responsive chamber geometry, sequential energy, and reduced-motion behavior; production build passed.
- Prompt 02 complete — Product Build Workspace preserves the real continuation dossier, controlled creation gateways, active Product Dock, and routed stage rail; five targeted tests and the production build passed.
- Prompt 03 complete — Development Portfolio keeps real filters and seven mapped stages, replaces the duplicate focus panel with a compact selected-product action rail, and adds mobile scroll snapping; seven targeted tests and the production build passed.
- Prompt 04 complete — Research & Formula Lab exposes the canonical active formula, honest experiment state, linked ingredient research, and four real tool routes; its targeted action test and production build passed.
- Prompt 05 complete — Sourcing & Packaging Network ties the current product to real Phase 03 records and explicit supplier, manufacturer, quote, and packaging gaps; its targeted action test and production build passed.
- Prompt 06 complete — Costing & Margin Studio exposes the current configuration, honest missing COGS, price, margin, and scenario states, plus the existing scenario-create action; its targeted action test and production build passed.
- Prompt 07 complete — Product Memory separates dated meaningful memory from undated canonical history and exposes real note, decision, document, and history actions; its targeted action test and production build passed.
- Prompt 08 complete — Launch Readiness derives six non-percentage evidence markers for the most advanced real product and reports one complete and five incomplete canonical stages; its targeted action test and production build passed.
- Prompt 09 complete — Final integration removes obsolete foundation filler, unifies section rhythm, adds contained mobile instrument rails, preserves focus/reduced-motion behavior, and keeps Launch Readiness as the final operational chamber.

Phase 03 was explicitly authorized and remains the current completed implementation scope. The focused hosting migration now makes Vercel the official target without beginning Phase 04: normal root Next.js detection, deployment-safe scripts, environment-isolated/fail-closed data policy, serverless-bounded PostgreSQL access, private storage contracts, guarded database releases, and deployment runbooks are established. A reachable external PostgreSQL service, private object-storage adapter, protected Vercel project, and future Private Beta application gate were not supplied, so hosted data and storage acceptance remain blocked.

## Product Build Workspace visual elevation delivered

- Redesigned only the Product Build Workspace material layer as a contained obsidian-plum development studio with restrained drafting arcs, layered purple atmosphere, and controlled gold lighting.
- Elevated the existing continuation module into a brushed-gold, chamfered product dossier with inset framing, purple hierarchy, capsule statuses, and dimensional gold/plum controls. The three existing creation paths now use matching machined-gold gateway shells and premium purple icon chambers.
- Preserved the Command hero, header, bottom navigation, Development Portfolio, later homepage sections, component structure, copy, routes, create events, real continuation facts, dock, stage links, schema, database, dependencies, and Phase 04 boundary.
- Responsive/accessibility coverage preserves semantic controls, visible keyboard focus, 44px targets, reduced-motion behavior, no horizontal overflow, and the existing sub-1200px workspace-height budget at 320×568, 375×667, 430×820, 768×900, 1366×768, and 1920×1080.
- Validation passed: Prettier check; `pnpm lint`; `pnpm typecheck`; focused Vitest (5/5); focused Playwright workspace geometry and action coverage (2/2); and `pnpm build` (24 pages). The initial type-check encountered stale duplicate `.next/types` artifacts and passed after the production build regenerated them. Sandboxed build/browser starts were blocked by local port permissions; approved reruns passed.
- No migration, seed, database release, Vercel deployment, route, data, architecture decision, or functional change was required.

The latest focused Command hero correction is implemented locally and awaiting review. The opening now uses the unchanged official emblem as its dominant core inside a layered plum-black command chamber with precision rings, sculpted subsystem orbs, and sequenced housed conduits. The header, mobile command dock, Product Build Workspace, deeper Command sections, data behavior, registered routes, schema, hosting, and Phase 04 remain unchanged by this pass.

The Command opening hero was surgically rebuilt on 2026-07-13 without changing the operational Command sections below it. The compact identity, official emblem, layered precision rings, four linked pillar nodes, sequential energy path, restrained breathing motion, responsive radial layout, accessible routes, and static reduced-motion state are locally validated. No Phase 04, database, hosting, navigation-shell, or unrelated-page work was included.

The Command hero was elevated again on 2026-07-14 around the unchanged root `icon.png`, now the permanent hero identity. This presentation-only pass enlarges the sharp core artwork, replaces diffuse glow and broad technical grids with a layered contained gold/purple halo, two slow precision-ring assemblies, restrained product-laboratory drafting references, and a soft atmospheric handoff into Product Build Workspace. The header, navigation, Product Build Workspace, all lower homepage sections, routes, records, database, and Phase 04 remain unchanged.

## Latest Command hero elevation delivered

- Preserved `icon.png` byte-for-byte (2000×2000; SHA-256 `7f77c47d8dac98b30fe913dd084ce9045c8a1ccba0557ce578423abf3785454d`) and increased its rendered mechanism area by moving the reactor frame from a 19% inset to 12% with the image filling that frame.
- Rebuilt only the opening chamber with the locked obsidian-plum, imperial-purple, brushed-gold, champagne, warm-ivory, and lavender-gray material system.
- Replaced broad grids, orbit noise, and signal lines with faint molecular geometry, formula references, measurement ticks, and a single radial engineering reference drawn in lightweight SVG.
- Reduced the mechanism to one premium outer ring and one secondary precision ring with segmented gold arcs, calibration interruptions, sparse markings, and internal purple channels. Rotation now takes 180 and 240 seconds.
- Added a synchronized 5.2-second `1 → 1.025` icon breath, a non-blurred four-stage gold halo behind the image, and restrained purple energy intensification. Reduced-motion settings remove all continuous hero animation without removing meaning.
- Reworked the hero-to-workspace edge as a layered gold and purple atmospheric continuation rather than a plain border; Product Build Workspace itself was not changed.
- Added ADR-046 to record `icon.png` as the permanent Command hero identity while leaving the existing header and shell emblem outside this pass.
- Validation passed: `pnpm format:check`; `pnpm lint`; `pnpm typecheck`; focused Vitest (2/2); focused Playwright reduced-motion and six-viewport geometry checks (2/2); and `pnpm build` (24 pages). The first sandboxed build and browser-server starts were blocked by local port permissions; approved reruns passed. A parallel dev-server browser attempt and its first serial retry also hit transient local navigation suspension/timeouts; the final focused rerun passed both checks.
- No migration, seed, database, dependency, header, navigation, route, Product Build Workspace, lower homepage section, hosting, Vercel, or Phase 04 change was included.

The Command section directly beneath that hero was then surgically rebuilt as the Product Build Workspace. It derives continuation context, linked formula/configuration evidence, a bounded product dock, and stage routes from real loaded records. It exposes exactly three new-product entry paths through the existing controlled creation dialog and honestly reports creation unavailability when PostgreSQL is unreachable. That pass preserved the hero and every later Command section; the separately authorized Development Portfolio pass below subsequently replaced only the next Commercial Readiness strip.

The third Command section is now a compact Development Portfolio. It maps detailed product statuses into seven read-only Command-stage groups without changing authoritative pipeline states, filters by actual product-line relationships, shows at most six real product capsules, and reveals a selected Product Focus panel with only record-backed evidence and routes. The hero, Product Build Workspace, Product Pipeline, product pages, schema, and every section after the former Commercial Readiness strip remain unchanged.

## Latest Command hero refinement delivered

- Restored the unchanged root `logo.png` through the existing `/emblem` and `LegacyHouseMark` path as the centered, dominant intelligence core; no new or modified artwork is rendered.
- Kept only `LEGACY HOUSE` and `GROOMED GENT CO. PRODUCT INTELLIGENCE OS` in the compact identity treatment and removed the extra Command identifier.
- Refined only the hero chamber, precision rings, four pillar orbs, and angular conduits with the approved obsidian-plum, imperial-purple, warm-ivory, muted lavender-gray, and brushed-gold values.
- Preserved Create, Build, Control, and Scale destinations and their accessible link names. Added restrained hover, tap, focus, counter-rotation, emblem breathing, and Create → Build → Control → Scale activation states.
- Reduced-motion preferences preserve the complete illuminated composition while collapsing continuous and repeated animation to one static pass.
- Verified the hero at 320×568, 375×667, 430×820, 768×900, 1366×768, and 1920×1080 with no page overflow or pillar-label overlap. The hero stays within the viewport at every tested size.
- Validation passed: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (92 tests), focused Playwright Command/viewport checks (3 passed, 1 expected project skip), focused reduced-motion checks (2 passed), and `pnpm build` (24 pages). The first sandboxed build attempt was blocked by Turbopack's internal port bind; the permitted rerun passed.
- No migration, database, route, dependency, header, bottom-navigation, Product Build Workspace, lower Command section, hosting, or Phase 04 change was included.

## Command home-screen correction delivered

- Replaced the root-emblem-in-rings hero treatment with the separately optimized 960×960 Command reactor artwork at `public/assets/legacy-house-command-core-v2.png`; root `logo.png` remains the official app-shell emblem and is unchanged.
- Rebuilt the hero environment with scoped Groomed Gent Co. material aliases, plum-black atmosphere, precision chamber arcs, controlled radial axes, metallic reactor locks, layered falloff, and no global redesign of unrelated pages.
- Replaced plain curved/dotted paths with angular housed conduits containing shadow channels, metallic rails, inner purple energy, mechanical couplers, traveling signal segments, and terminal activation.
- Rebuilt all four pillar links as clipped multi-layer subsystem apertures with mechanical brackets, rotating segmented rails, internal energy chambers, stronger icons, sequence indices, and preserved registered destinations.
- Slowed and restrained continuous motion around the core lens, reactor breath, rings, signals, terminals, and pillar activation. Operating-system and workspace reduced-motion settings leave the complete static relationship visible and remove traveling dash behavior.
- Rebuilt the Product Build Workspace material layer without changing its service model: the real continuation candidate now sits in a chamfered featured shell; Custom Formula, White-Label, and Product Concept use distinct sculpted gateways; dock and stage links share the same purple/gold depth language.
- Preserved the real Legacy Reserve continuation, formula/configuration evidence, database-gated create actions, active product dock, product-line facts, and registered routes. No product, activity, supplier, manufacturer, costing, readiness, or analytics record was added.
- Verified hero and workspace geometry at 320×568, 375×667, 430×820, 768×900, 1366×768, and 1920×1080 with no node overlap or page overflow. The smallest workspace remains below the existing 1200px compactness budget.
- No migration, seed, database, hosting, authentication, navigation-shell, deeper homepage-section, unrelated-page, or Phase 04 implementation was included.

## Development Portfolio delivered

- Replaced only the six-metric Commercial Readiness homepage strip with a product-development map; Phase 03 commercial modules and records remain intact.
- Centralized the seven Command stages, their order/icons, and detailed-status mapping in one service. `idea`/`product_brief` map to Concept; `research` to Research; `formulation`/`testing`/`refinement` to Formula / Source; `supplier_sourcing` to Sourcing; `packaging` to Packaging; `costing` to Costing; and `production_ready`/`launch_planning`/`launched` to Launch Ready.
- `on_hold`, `archived`, and unknown future statuses deliberately have no inferred Command-stage position and display `Stage information incomplete` when present.
- Added data-derived product-line filters, seven keyboard-accessible stage controls with real counts, six-product density limits, honest stage/no-product empty states, and real Product Pipeline navigation.
- Added sculpted product capsules with product-line accents, development path, mapped stage, and exactly one supporting detail selected from active formula, source candidate, costing/configuration, experiment, or an explicit missing-source/path state.
- Added a compact Product Focus panel with actual product-line/path/stage context, one supporting summary, `Open product`, and an optional real `Continue build` route only when supporting workspace evidence exists.
- Canonical fallback truth remains one Legacy Reserve Launch Ready product with Formula 1.0 and nine Legacy Sanctum Research/White Label planning products with no manufacturer selected. No product, manufacturer, costing, readiness, recency, or activity was invented.
- Added contained mobile product-line, stage, and capsule rails; capsule width remains at least 180px in the required matrix and the page never gains horizontal overflow.
- Verified 320×568, 375×667, 430×820, 768×900, 1366×768, and 1920×1080 geometry plus full-page visual inspection at 320, 430, and 1440 pixels. The section stays below 1250px tall in the matrix.
- No migration, seed, database, hosting, authentication, navigation-shell, Product Pipeline, product-detail, Phase 04, hero, Product Build Workspace, later-section, or logo change was made.

## Product Build Workspace delivered

- Replaced only the former Product Development Command section with a compact, engineered product-building control surface.
- Added deterministic continuation selection: use the most recently updated active product when a real `updatedAt` exists; otherwise identify the most advanced active product without claiming recency. An all-inactive portfolio renders an honest empty state.
- Connected the authorized Legacy Reserve product, Formula 1.0, and active 2 oz configuration through their existing product/formula routes without inventing a last-opened workspace or timestamp.
- Added exactly three premium New Product paths—Custom Formula, White-Label, and Product Concept—backed by the existing global product-create event, matching development-path presets, and database availability controls.
- Added a five-record active Product Dock and `View all products` route to Product Pipeline; no fake progress, metrics, prices, or activity were introduced.
- Added registered stage jumps for Research, Formula, Sourcing, Packaging, Costing, and Launch Readiness. Launch Readiness safely returns to the operational Product Pipeline until its Phase 06 workflow exists; no unfinished boundary screen is presented as operational.
- Added horizontal contained rails on small screens, visible native focus behavior, semantic headings/navigation/list structure, touch-sized actions, and global reduced-motion compliance.
- Verified the section at 320×568, 375×667, 430×820, 768×900, 1366×768, and 1920×1080 with no page overflow, a sub-1200px section-height budget, and correct separation from the unchanged hero and next section. Full-page visual captures were inspected at 320, 430, and 1440 pixels.
- No schema, migration, seed, hosting, shell navigation, unrelated route, Phase 04, or logo change was made for this workspace.

## Command hero delivered

- Removed the editorial headline, introductory paragraph, jump link, duplicated pillar explanation, and static pillar-card section from the Command opening.
- Preserved root `logo.png` unchanged and served it through the existing `/emblem` and `LegacyHouseMark` primitives.
- Added centralized pillar metadata backed by registered routes: Create → Product Pipeline, Build → Suppliers, Control → Inventory, and Scale → Launches.
- Built reusable hero, core, connection-path, and pillar-node components with inline decorative SVG and repository CSS only; no image or animation dependency was added.
- Added concentric precision rings, segmented arcs, radial marks, purple/gold atmosphere, an eight-second sequential signal cycle, a 5.2-second core breath, slow independent ring rotation, hover/focus path response, and full static reduced-motion meaning.
- Verified bounded four-quadrant composition at 320×568, 375×667, 430×820, 768×900, 1366×768, and 1920×1080 with no node overlap or horizontal overflow.
- At the time of the hero pass, everything beginning with Product Development Command remained structurally unchanged; the separately authorized Product Build Workspace pass later replaced only that first section.

## Vercel migration delivered

- Replaced Replit configuration and the custom host/port wrapper with normal Next.js commands and a minimal root `vercel.json`.
- Kept `pnpm build` pure: migrations and seeds are never deployment build/start hooks. Manual commands require an explicit environment target; Preview seed and every Production database command require additional confirmation.
- Isolated Development, Preview, and Production policy. Preview access requires confirmed Vercel Deployment Protection; Preview writes require a second opt-in. Production data access is disabled until the future Private Beta gate is implemented and enabled.
- Bounded each function-local PostgreSQL client to one connection with no prepared statements and finite connection lifetimes; pooled, environment-specific provider URLs are required in deployment guidance.
- Strengthened `ObjectStorage` around private objects and authorized expiring downloads. The unavailable adapter remains active until a real private provider is implemented and verified.
- Added deployment runbooks for Vercel setup, environment variables, database releases, object storage, protected Preview, and the Production hold.
- Preserved the single application, Phase 01–03 models and UI, official root `logo.png`, migrations, authorized seeds, and historical ADR-021 record. Phase 04 was not started.

## Phase 3 delivered

- Twenty connected PostgreSQL/Drizzle commercial entities for suppliers, supplier products/history/selections, manufacturers/catalog/candidates/quotes, packaging/history/compatibility, configurations/packaging/assumptions, scenarios/snapshots, documents/links, and readiness.
- Supplier Network and Manufacturer/White-Label, Packaging, Costing, and Document Vault workspaces with truthful empty states, search, detail views, comparisons, blockers, and database-gated create actions.
- Supplier-product creation appends the initial price-history row when a price is supplied. Preferred selection changes are transactionally line-scoped and never automatic.
- Unit conversion supports volume, weight, and count; weight/volume conversion requires density and pack/case conversion requires an explicit factor.
- Central formula-consumed, white-label, packaging, fully-loaded COGS, quote, margin/markup, and purchase-versus-consumed cost services.
- Finished configurations support exactly one formula version or manufacturer catalog product. The authorized Legacy Reserve 2 oz configuration is the only new seed; Legacy Sanctum remains formula-free white-label planning.
- Cost scenarios are editable records; snapshots have no update command and preserve inputs/outputs as immutable evidence.
- Document metadata and multi-entity links are relational. Raw bytes use a provider-neutral storage boundary whose default adapter fails closed.
- Deterministic readiness, commercial Command metrics, global search/create groups, commercial settings, and product/formula/ingredient commercial expansions.
- No suppliers, manufacturers, products, quotes, packaging, prices, documents, certifications, or analytics were fabricated.

## Single-core Command hero refinement

- Replaced only the Command hero's four pillar nodes and conduits with one centered command core using the existing root `icon.png` unchanged (2000×2000; SHA-256 `7f77c47d8dac98b30fe913dd084ce9045c8a1ccba0557ce578423abf3785454d`). The shell, routes, Product Build Workspace, data, and lower Command sections were not changed.
- Added lightweight SVG precision rings, segmented brushed-gold arcs, purple internal depth, a synchronized icon/halo breath, restrained chamber traces, and complete static reduced-motion styling.
- Validation passed: `pnpm lint`, `pnpm format:check`, `pnpm typecheck`, 97/97 unit/integration tests, and `pnpm build` with 24 generated pages. The focused Playwright suite passed its hero reduced-motion and six-viewport geometry checks; two cold-start desktop timeouts passed 2/2 when rerun serially.
- Vercel was not invoked for this local-only change; no commit or push was performed.

- Product Development sequence Prompt 01 complete — established the existing pipeline route as the compact module entry with working Create Product and pipeline/list access over real records.
- Product Development sequence Prompt 02 complete — refined product creation into three explicit paths with the required shared fields, generated slug, validated payload, and Product Brief continuation.
- Product Development sequence Prompt 03 complete — aligned the pipeline to seven Command stages with complete filters, accessible status/archive controls, and a focused mobile product list.
- Product Development sequence Prompt 04 complete — completed the Product Detail header and compact evidence-backed overview with real formula/source/configuration context and a grounded continuation.
- Product Development sequence Prompt 05 complete — organized the safe-draft Product Brief as a structured definition instrument with real-field completion and explicit PostgreSQL save.
- Product Development sequence Prompt 06 complete — replaced broad phase tabs with a compact, current-aware Product Build rail using only real contextual routes and an honest Launch Readiness unavailable state.
- Product Development sequence Prompt 07 complete — completed all product-note categories with filter/sort/open/edit, activity-recorded note revisions, and non-destructive founder decision review.
- Product Development sequence Prompt 08 complete — replaced raw activity with a real-event Development Timeline that groups exact repeats, resolves related records, and links only to existing destinations.
- Product Development sequence Prompt 09 complete — applied the locked obsidian-plum, imperial-purple, and dimensional-gold dossier system across Product Development only.
- Product Development sequence Prompt 10 complete — verified and polished 320px through desktop reflow, focused mobile pipeline use, compact build navigation, touch/focus states, and reduced motion without page overflow.
- Product Development sequence final validation passed — format and lint clean; 109/109 tests across 42 files; 11/11 applicable Product Development browser scenarios with one intentional matrix skip; clean production build generated 24 pages.

## Validation evidence

| Check                              | Result                                                                                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Git                                | `main` tracking `origin/main`; Command correction local only; no push                                                                                                          |
| Official logo                      | Pass — unchanged 2000×2000 PNG; SHA-256 `8b3d03bf01b9078ed1318ac2e1c44b66b5896b123d3bb0f447d7b207f9026920`                                                                     |
| Generated migration                | Pass — `drizzle/0003_happy_marrow.sql`; 38 total tables                                                                                                                        |
| Migration integrity                | Pass — `pnpm db:check` and clean PGlite application of all migrations                                                                                                          |
| External PostgreSQL migration/seed | Blocked — `DATABASE_URL` absent; commands were not falsely reported as run                                                                                                     |
| Unit/integration                   | Pass — 97 tests across 36 files                                                                                                                                                |
| Coverage                           | Pass — 99.07% statements, 94.9% branches, 98.92% functions, 99.35% lines                                                                                                       |
| Format/lint/type-check             | Pass — `pnpm format:check`, `pnpm lint`, `pnpm typecheck`                                                                                                                      |
| Production build                   | Pass — 24 generated static pages; the first restricted attempt hit Turbopack's sandbox port limit, and the permitted rerun completed                                           |
| Browser tests                      | Pass — 43 desktop/mobile scenarios; three intentional duplicate viewport-matrix skips                                                                                          |
| Responsive/accessibility           | Pass locally — six-width hero/workspace/portfolio matrices, full Command integration, no page overflow, real routes, visible focus, reduced motion, and contained mobile rails |
| Vercel repository readiness        | Pass — root Next.js detection, pure build, isolated policy, guarded release commands, runbooks                                                                                 |
| Vercel CLI/build                   | Not run — CLI is not installed; normal `pnpm build` passed                                                                                                                     |
| Hosted Vercel Preview              | Blocked — project, Deployment Protection, scoped Preview database, and credentials not supplied                                                                                |

## Current blockers and technical risks

- External PostgreSQL migration/seed and production transaction/concurrency behavior cannot be verified without `DATABASE_URL`.
- Real document upload/download/delete is intentionally unavailable until a private object-storage adapter, credentials, retention policy, MIME allowlist, maximum size, and authorization checks are implemented.
- Vercel dashboard environment scoping and Deployment Protection cannot be validated locally. The confirmation variable must not be enabled before the dashboard control is tested.
- Production authentication/session integration remains deferred. Production data access fails closed and no public Production deployment is authorized before the future passkey/PIN Private Beta gate.
- Provider connection-pool limits, function concurrency, cold starts, and hosted runtime behavior require protected Preview evidence.
- Currency conversion is intentionally absent; comparisons across currencies remain blocked rather than using a silent rate.
- Commercial action endpoints implement the connected persistence commands, while richer inline edit/compare ergonomics can evolve from real operator feedback without changing the Phase 03 data contract.
- Two deprecated transitive `@esbuild-kit` development packages remain upstream tooling debt.

## Phase checklist

- [ ] Phase 1 — Foundation and Design System (local implementation complete; external PostgreSQL/protected hosted acceptance blocked)
- [ ] Phase 2 — Product Pipeline, Formulas, Ingredients, and R&D (local implementation complete; external PostgreSQL/protected hosted acceptance blocked)
- [ ] Phase 3 — Sourcing, Manufacturers, White Label, Packaging, and Costing (local implementation complete; external PostgreSQL/private storage/protected Preview acceptance blocked)
- [ ] Phase 4 — Inventory, Purchasing, Production, and Traceability (bounded Production planning slice complete; inventory, purchasing, lots, consumption, finished goods, and traceability not started)
- [ ] Phase 5 — Quality, Stability, Labels, and Complaints
- [ ] Phase 6 — Launches, Shopify, and Market Performance
- [ ] Phase 7 — Operational Intelligence and Forecasting
- [ ] Phase 8 — Security, Hardening, and Deployment
