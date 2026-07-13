# Private Object Storage

## Current state

PostgreSQL stores document metadata and relationships only. `ObjectStorage` is the provider-neutral boundary for bytes; `UnavailableObjectStorage` is the active fail-closed default. No upload, download, or delete is currently represented as working.

Vercel Function filesystems are ephemeral and must not hold authoritative uploads. A future adapter may use private Vercel Blob or an S3-compatible private bucket. It must preserve the interface contract:

- uploads return a private object key, size, and MIME type;
- downloads require an authenticated/authorized application decision and short-lived access;
- permanent public URLs are not stored or exposed;
- deletion follows an approved retention and audit policy.

## Vercel Blob adapter requirements

Use a current Vercel Blob server SDK with private storage support (private storage requires `@vercel/blob` 2.3 or later). Keep `BLOB_READ_WRITE_TOKEN` server-only and environment-specific. The adapter must validate permitted MIME types and size before transfer, generate collision-resistant scoped keys, and use authorized download semantics. It must not proxy unbounded files through a function or log tokens/URLs.

Before enabling `OBJECT_STORAGE_PROVIDER=vercel_blob`, add and test the adapter, configure a private store separately for Preview and Production, document retention/deletion, and add authorization, malware/content handling as required, rate limits, and audit coverage. Merely connecting a store does not complete those controls.

## S3-compatible alternative

Use a private bucket with least-privilege server credentials, encryption and lifecycle rules, blocked public access, scoped object keys, and short-lived signed operations. Preview and Production must not share credentials or authoritative buckets.
