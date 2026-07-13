# Phase 5 — Quality, Stability, Labels, and Complaints

## Objective and dependencies

Add controlled quality evidence and release governance without making regulatory or medical conclusions. Requires Phase 4 lots, production snapshots, traceability, roles, and audit history plus earlier product/vendor evidence.

## Domain model

Versioned specifications and acceptance criteria; inspection/test request, method reference, result, attachment and reviewer; lot/batch disposition and hold/release history; stability protocol, condition, timepoint, sample, observation and result; versioned label artifact and claim with market/context, source evidence and review state; complaint, product/lot association, reporter handling boundaries, seriousness/adverse-event flag, investigation, response, CAPA, and closure; change request, affected records, approvals, implementation and effectiveness review.

Sensitive complaint data is minimized and access-controlled. “Pass,” “approved,” “compliant,” and shelf-life claims require recorded authority/evidence, never system inference.

## Screens and workflows

Quality work queue; specification/test workspace; lot hold/disposition/release; stability calendar/protocol/timepoints; label and claims version comparison with evidence; complaint intake/investigation/CAPA; change-control impact map and approvals. Critical states include text, icons, reason, actor, and time.

## Services and invariants

Disposition eligibility and segregation; controlled approval/versioning; stability scheduling and overdue logic; claim-evidence linkage; complaint triage/escalation policy configured with qualified owner input; CAPA/change-control lifecycle and cross-domain impact analysis. Completion never auto-releases a batch; expired/held/rejected status continues to constrain availability.

## Test plan

Release separation and permission matrix; hold effects across inventory; immutable approved specs/labels/claims; evidence-required transitions; stability due-date/timezone rules; complaint privacy and escalation flags; CAPA/change dependencies; traceability from complaint to lot/batch/input; accessible sensitive confirmation and error flows.

## Acceptance criteria

Users can prove why a lot is held or released, follow stability obligations, recover every approved label/claim version and evidence source, investigate a complaint through traceability, and control changes without rewriting history. Required expert-owned policies are documented, checks pass, and no regulatory conclusion is fabricated.

## Non-goals and stop conditions

No legal/regulatory advice, laboratory instrument replacement, automatic shelf-life/claim approval, public complaint portal, or medical diagnosis. Stop until qualified ownership defines ambiguous escalation/retention rules; also stop on privacy gaps, mutable approvals, broken inventory enforcement, failing checks, or acceptance. Recommend Phase 6 only.
