# Deployment Checklists

## Repository readiness

- [ ] Frozen install succeeds.
- [ ] Format, lint, strict type-check, tests, migration integrity, and production build pass.
- [ ] No build/start script runs a database command.
- [ ] `logo.png` remains the official unchanged root asset.
- [ ] Vercel detects the root Next.js application without a custom output directory.
- [ ] Secret scan and Git diff contain no credentials or `.vercel/` metadata.

## Protected Preview

- [ ] Preview deployment is protected in the Vercel dashboard and protection is tested in a signed-out browser.
- [ ] Preview uses its own pooled PostgreSQL URL scoped only to Preview.
- [ ] `VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED=true` is set only after the preceding check.
- [ ] `PREVIEW_DATABASE_WRITES_ENABLED=false` for initial acceptance.
- [ ] Explicit Preview migration completed outside the build; seed was omitted or separately reviewed and confirmed.
- [ ] Production database and object-store credentials are absent from Preview.
- [ ] `/api/health` exposes only liveness; `/api/ready` exposes only generic readiness.
- [ ] A protected smoke test covers navigation, read-only fallbacks, mobile/desktop behavior, and expected mutation denial.

## Private Beta Production — future authorization required

- [ ] Passkey/PIN application gate is implemented, tested, rate-limited, and reviewed.
- [ ] Vercel protection coverage for Production is deliberately selected and verified; Standard Preview protection alone is not treated as Production protection.
- [ ] Dedicated Production database, backup, restore test, monitoring, and release owner are confirmed.
- [ ] Production migration is reviewed and run explicitly with the guarded target confirmation.
- [ ] Private object storage adapter and retention/authorization controls are verified, or storage remains unavailable.
- [ ] `PRIVATE_BETA_GATE_ENABLED=true` is set only after the gate is proven.
- [ ] Production-domain signed-out and signed-in smoke tests pass without leaking data or internal errors.
- [ ] Rollback/forward-fix and incident contacts are recorded.

Until every applicable Production item is satisfied, do not expose the Production domain and do not enable Production data access.
