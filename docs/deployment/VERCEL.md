# Vercel Hosting

## Supported shape

Legacy House is one Next.js application at the repository root. Import the GitHub repository into Vercel with the project root set to `.` and the Next.js framework preset. Vercel should detect pnpm from `packageManager` and `pnpm-lock.yaml`.

Use these project settings:

- Install command: Vercel default (`pnpm install` from the lockfile)
- Build command: `pnpm build`
- Output directory: Vercel default; do not set one
- Development command: `pnpm dev`
- Node.js: a Vercel-supported Node.js 24 release compatible with `package.json`

Do not add a nested project, static export, custom server, build-time database access, migration hook, or seed hook. `vercel.json` intentionally declares only the framework.

## Environment model

Vercel Development, Preview, and Production scopes are separate release environments. Assign distinct credentials as defined in `ENVIRONMENT_VARIABLES.md`. Never copy the Production database URL into Preview. Pulling Vercel variables locally is optional, temporary, and must not replace `.env.example` or be committed.

Preview data access is allowed only after Vercel Deployment Protection is enabled and independently confirmed through `VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED=true`. Preview mutation remains off unless `PREVIEW_DATABASE_WRITES_ENABLED=true` is deliberately set.

## Production hold

Do not promote a deployment, assign the production domain, or otherwise expose Production until the separately authorized passkey/PIN Private Beta gate is implemented and tested. Keep `PRIVATE_BETA_GATE_ENABLED` absent or `false` and preferably keep `DATABASE_URL` absent in Production until then.

Vercel Standard Protection protects Preview and other generated deployment URLs but does not protect the production domain. If a Production deployment must exist before the application gate, configure Vercel protection that explicitly covers all deployments, including Production, and verify the account plan supports it. This is a manual dashboard control, not something this repository can assert.

## Request and job model

Route Handlers must finish bounded request work and release database clients. The application currently has no background worker. Future long operations must use a durable Vercel-compatible queue, workflow, or cron design with idempotency keys, persisted job state, bounded retries, and recovery visibility. Never rely on an in-memory timer, singleton, or the function filesystem.

## Health behavior

- `GET /api/health` reports only process liveness and is not cached.
- `GET /api/ready` reports a generic ready/unavailable state and is not cached.
- Neither endpoint returns credentials, connection strings, provider error text, or internal topology.

Hosted acceptance is incomplete until the relevant checklist in `DEPLOYMENT_CHECKLISTS.md` is performed against a protected project.
