# Phase 8 — Security, Hardening, and Deployment

## Objective and dependencies

Demonstrate production readiness across security, privacy, resilience, performance, observability, recovery, CI/CD, and Replit deployment. Security controls have existed throughout; this phase performs systematic threat review, closes gaps, and validates operations. Requires completed prior phases and an authorized deployment environment.

## Workstreams

- Threat model assets, actors, trust boundaries, abuse cases, external integrations, uploads, controlled records, and sensitive complaint/customer data.
- Verify authentication/session security and least-privilege authorization matrix; privileged action confirmation and audit; rate/abuse/CSRF/SSRF/injection/upload protections as applicable; security headers and dependency/supply-chain policy.
- Secret inventory/rotation procedure, environment separation, data classification/minimization/retention/deletion, encrypted transport/storage assumptions, log redaction, and incident response ownership.
- Structured logs, metrics, traces as justified, health checks, alert/runbooks, sync/migration observability, performance budgets and query/index review.
- Automated backups, restore drill, migration forward/rollback strategy, failure/retry drills, dependency outage behavior, and recovery objectives approved by owner.
- CI quality gates and controlled Replit deployment with `0.0.0.0`, `PORT`, managed secrets, PostgreSQL, migration release procedure, domain/TLS as applicable, and rollback instructions.

## Data and screens

Add only justified session/security/retention metadata without duplicating identity or audit models. User-facing work is limited to authorized session/security controls and operational diagnostics that have clear owners; no “security dashboard” theater.

## Test plan

Full authorization matrix and tenant/scope boundaries if introduced; OWASP-oriented abuse tests; dependency, secret, and static scans; upload/content limits; log-redaction tests; accessibility regression and browser/device matrix; load/query budget tests; backup restore into isolated environment; migration and deployment rollback rehearsal; external-integration failure drills; smoke tests against production-like Replit configuration.

## Acceptance criteria

No known critical/high issue remains without explicit owner-approved risk treatment. Permissions and audit evidence cover controlled actions; secrets and sensitive data are minimized and protected; backups are restored successfully; runbooks name detection, response and recovery; CI blocks failing required checks; deployment and rollback are reproducible; performance/accessibility budgets pass; BUILD_STATUS and ADRs record exact evidence and residual risks.

## Non-goals and stop conditions

No new business modules, speculative compliance certification, checkbox security, or unapproved production traffic/data. Stop for unresolved critical/high findings, failed restore/rollback, missing incident/retention owner decisions, unavailable deployment authority, failing gates, or achieved acceptance. Declare production readiness only with evidence; otherwise report the precise blocker and remediation owner.
