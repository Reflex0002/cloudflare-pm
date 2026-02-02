---
type: reference
audience: ai-agent
topics: [bindings, d1, kv, r2, ai, vectorize]
related: [WORKER_DEVELOPMENT.md, MCP_TOOLS_GUIDE.md, ../README.md]
---
# Cloudflare Bindings Reference

Bindings are defined in `wrangler.toml` and typed in `src/server/types/bindings.ts`.

## Current bindings

```ts
DB: D1Database
CACHE: KVNamespace
ATTACHMENTS: R2Bucket
AI: Ai
VECTORIZE: VectorizeIndex
```

## D1 database

Wrangler binding:

- `DB` → database name `feedback-tracker-db-v2`

Schema reference: `db/schema.sql`

Key tables:

- `users` (id, name, handle, company)
- `feedback_items` (matches FeedbackItem fields; `source_metadata` stored as JSON string)
- `tags`
- `feedback_tags` (join table)

Common query patterns live in `src/server/db/queries.ts`.

## KV cache

Wrangler binding:

- `CACHE` → KV namespace id `66823948eeac44a48621707ec8ed0b77`

Key patterns from `src/server/cache/kv.ts`:

- `query:<hash>`
- `analytics:<metric>`
- `item:<id>`

KV helpers:

- `getCache<T>(kv, key)` → JSON parse with null safety
- `setCache(kv, key, value, ttlSeconds)`

## R2 bucket

Wrangler binding:

- `ATTACHMENTS` → bucket `feedback-attachments`

Use for feedback attachments or exports.

## AI binding

Wrangler binding:

- `AI` → Cloudflare AI binding

Use for future chat/service enrichment or summary generation.

## Vectorize

Wrangler binding:

- `VECTORIZE` → index name `feedback_search`

Use for search or semantic retrieval over feedback items.

## MCP tool mapping

Use `user-worker-bindings` tools to inspect bindings:

- D1: `d1_databases_list`, `d1_database_query`
- KV: `kv_namespaces_list`, `kv_namespace_get`
- R2: `r2_buckets_list`, `r2_bucket_get`

## See also

- `WORKER_DEVELOPMENT.md`
- `wrangler.toml`
- `db/schema.sql`
- `src/server/cache/kv.ts`
