# Database Migration and Seed Runbook

## Invariant

`pnpm build`, Vercel builds, application startup, and ordinary requests never run migrations or seeds. A database release is a separate operator action against one identified environment. Back up Production and confirm the rollback/forward-fix plan before changing it.

## Development

1. Put a development-only pooled PostgreSQL URL in `.env.local`.
2. Set `DATABASE_TARGET=development`.
3. Run `pnpm db:check`.
4. Run `pnpm db:migrate`.
5. Run `pnpm db:seed` only when the repository-authorized idempotent records are wanted.
6. Verify `/api/ready` locally and run the relevant tests.

## Preview

1. Create a database that is not Production and can be reset independently.
2. Enable and verify Vercel Deployment Protection before adding credentials.
3. Scope its pooled `DATABASE_URL` to Preview only.
4. From a controlled operator shell, load only the intended Preview variables and set `DATABASE_TARGET=preview`.
5. Run `pnpm db:check`, then `pnpm db:migrate`.
6. Seeding is optional and requires `CONFIRM_PREVIEW_SEED=legacy-house-preview`. Inspect the authorized seed first; never add fabricated commercial or operational records.
7. Keep `PREVIEW_DATABASE_WRITES_ENABLED=false` for read-only acceptance. Enable it only for a deliberate protected mutation test, then turn it off again if writes are not required.

## Production

Production release is blocked until the Private Beta gate and deployment protection decision are complete.

When separately authorized:

1. Confirm the target is the dedicated Production database and backups/restores are verified.
2. Review generated SQL and compatibility with the currently deployed application.
3. Set `DATABASE_TARGET=production` and `CONFIRM_PRODUCTION_DATABASE_COMMAND=legacy-house-production` only in the controlled operator shell.
4. Run `pnpm db:check` and `pnpm db:migrate` before promoting the compatible application release.
5. Do not seed Production by default. If an authorized idempotent seed is explicitly approved, review its exact records and use the same Production confirmation.
6. Smoke-test generic health/readiness, then the authenticated application gate and critical workflow.

Database scripts refuse to infer a target during a Vercel build. A failed release is handled as an explicit forward fix or reviewed rollback; it must never be hidden by automatic startup retries.
