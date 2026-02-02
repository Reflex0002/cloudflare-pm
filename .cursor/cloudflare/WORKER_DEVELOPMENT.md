---
type: reference
audience: ai-agent
topics: [workers, hono, api, handlers]
related: [BINDINGS_REFERENCE.md, OBSERVABILITY_GUIDE.md, ../README.md]
---
# Worker Development Guide

This project uses Cloudflare Pages Functions (Hono) under `functions/` with shared server code in `src/server/`.

## Structure

- Function entrypoint: `functions/api/[[path]].ts`
- Router: `src/server/router.ts`
- Handlers: `src/server/handlers/*`
- DB queries: `src/server/db/queries.ts`
- KV cache helpers: `src/server/cache/kv.ts`
- Bindings types: `src/server/types/bindings.ts`

## Routing

Routes defined in `src/server/router.ts`:

- `GET /api/feedback`
- `GET /api/feedback/:id`
- `PATCH /api/feedback/:id`
- `GET /api/analytics/sources`
- `GET /api/analytics/tags`
- `GET /api/analytics/views`
- `GET /api/analytics/triage-speed`
- `GET /api/search`
- `GET /api/sources/:sourceType`

## Middleware

In `functions/api/[[path]].ts`:

- CORS for `https://feedback-tracker.pages.dev` and `http://localhost:5173`
- Request logging with duration and status (structured JSON logs)

## Database patterns

The data access layer in `src/server/db/queries.ts`:

- `listFeedback` filters by source/status/priority/type/tag/search
- `getFeedbackById` fetches one item with tags
- `updateFeedback` updates status/priority and tags
- `getSourceCounts`, `getTagCounts`, `getViewCounts`

## Cache patterns

KV helper functions:

- `getCache` returns parsed JSON or null
- `setCache` stores JSON with TTL
- `cacheKeys` standardizes key names

## API client

The frontend uses `src/api/client.ts` to call the Worker API with query params.

## See also

- `MCP_TOOLS_GUIDE.md`
- `functions/api/[[path]].ts`
- `src/server/router.ts`
- `src/server/db/queries.ts`
- `src/server/cache/kv.ts`
