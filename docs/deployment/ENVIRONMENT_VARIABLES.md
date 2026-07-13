# Environment Variables

All values are server-side unless explicitly documented otherwise. Never use a `NEXT_PUBLIC_` prefix for database or object-storage credentials.

| Variable                                 | Development                       | Preview                                      | Production                                  | Purpose                                         |
| ---------------------------------------- | --------------------------------- | -------------------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`                           | Separate development DB           | Separate Preview DB                          | Separate Production DB, withheld until gate | PostgreSQL pooled connection URL                |
| `VERCEL_ENV`                             | Supplied by Vercel/absent locally | Supplied by Vercel                           | Supplied by Vercel                          | Runtime environment; do not override            |
| `VERCEL_DEPLOYMENT_PROTECTION_CONFIRMED` | `false`/absent                    | `true` only after protection is verified     | Not an application gate                     | Fail-closed Preview data access acknowledgement |
| `PREVIEW_DATABASE_WRITES_ENABLED`        | `false`/absent                    | `false` initially; enable deliberately       | Not applicable                              | Additional Preview mutation gate                |
| `PRIVATE_BETA_GATE_ENABLED`              | `false`/absent                    | `false`/absent                               | `false` until future gate passes            | Production data-access gate                     |
| `OBJECT_STORAGE_PROVIDER`                | `unavailable`                     | `unavailable` until adapter verified         | `unavailable` until adapter verified        | Selects a future private adapter                |
| `BLOB_READ_WRITE_TOKEN`                  | Optional local provider token     | Preview-only token                           | Production-only token                       | Server-only Vercel Blob credential              |
| `DATABASE_TARGET`                        | `development` for commands        | `preview` for explicit commands              | `production` for explicit commands          | Labels a manual database release                |
| `CONFIRM_PREVIEW_SEED`                   | Not set                           | Exact guarded value for authorized seed only | Not set                                     | Prevents accidental Preview seed                |
| `CONFIRM_PRODUCTION_DATABASE_COMMAND`    | Not set                           | Not set                                      | Exact guarded value for reviewed command    | Prevents accidental Production migrate/seed     |

Vercel must scope variables through the dashboard or CLI to Development, Preview, or Production. Do not use one shared secret value across all environments. A branch-specific Preview variable may be used when an isolated Preview database is required.

The `*_CONFIRMED` flags do not configure Vercel controls. They acknowledge that a human has already verified the corresponding dashboard control. Setting one without the control is a policy violation.

`.env.example` is safe documentation only. `.env`, `.env.local`, Vercel pull files, and `.vercel/` are ignored and must not be committed.
