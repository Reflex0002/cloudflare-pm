---
type: reference
audience: ai-agent
topics: [mcp-tools, cloudflare, workers, observability]
related: [OBSERVABILITY_GUIDE.md, BINDINGS_REFERENCE.md, ../README.md]
---
# Cloudflare MCP Tools Guide

This guide explains how to discover and use the Cloudflare MCP tools available in this workspace.

## Quick start for AI agents

1. List tool schemas in `/mcps/<server>/tools/*.json`
2. Read `/mcps/<server>/INSTRUCTIONS.md` if present
3. Use the schema to build valid arguments (do not guess)
4. Call the tool with the exact schema fields

## Available MCP servers

### user-cloudflare-observability

Purpose: Query Worker logs and metrics.

Core tools:

- `observability_keys`: list filterable keys
- `observability_values`: list valid values for a key
- `query_worker_observability`: query events, calculations, invocations
- `workers_list`: list Workers
- `workers_get_worker`: metadata about a Worker
- `workers_get_worker_code`: fetch Worker code
- `search_cloudflare_documentation`: search official docs

When to use:

- Debug Worker behavior, errors, or latency
- Verify endpoints are being hit
- Investigate slow paths or error spikes

Typical workflow:

1. `workers_list` to confirm the service name
2. `observability_keys` to find valid filter keys
3. `observability_values` for the target key
4. `query_worker_observability` with validated filters

### user-worker-bindings

Purpose: Manage and query Cloudflare resources (D1, KV, R2, Vectorize, Hyperdrive).

Core tools:

- D1: `d1_database_query`, `d1_database_get`, `d1_databases_list`
- KV: `kv_namespaces_list`, `kv_namespace_get`, `kv_namespace_create`, `kv_namespace_update`, `kv_namespace_delete`
- R2: `r2_buckets_list`, `r2_bucket_get`, `r2_bucket_create`, `r2_bucket_delete`
- Hyperdrive: `hyperdrive_configs_list`, `hyperdrive_config_get`, `hyperdrive_config_edit`, `hyperdrive_config_delete`

When to use:

- Inspect or validate D1 schema/data
- List and manage KV namespaces and R2 buckets
- Verify configured bindings exist in the account

### user-ai-search / user-auto-rag

Purpose: Search Cloudflare documentation or custom RAG content.

Use for:

- Finding official Cloudflare docs or examples
- Clarifying product limits or API behavior

### cursor-browser-extension / user-Playwright

Purpose: Browser automation for UI validation.

Use for:

- UI smoke tests
- Capturing screenshots of the app

## Tool-call hygiene

- Always read the tool schema JSON before calling
- Required arguments are listed under `required`
- Do not invent fields or argument names
- Use `observability_keys` and `observability_values` before filtering logs

## Examples

### D1 query (list feedback items)

Schema: `user-worker-bindings/tools/d1_database_query.json`

```json
{
  "database_id": "<from d1_databases_list>",
  "sql": "SELECT id, title, status FROM feedback_items LIMIT 5"
}
```

### Observability query (last hour errors)

Schema: `user-cloudflare-observability/tools/query_worker_observability.json`

```json
{
  "query": {
    "queryId": "workers-logs-events",
    "view": "events",
    "parameters": {
      "filters": [
        {
          "key": "$metadata.service",
          "operation": "eq",
          "type": "string",
          "value": "feedback-tracker-api"
        },
        {
          "key": "$metadata.error",
          "operation": "exists",
          "type": "string"
        }
      ]
    },
    "timeframe": {
      "reference": "1970-01-01T00:00:00Z",
      "offset": "-1h"
    }
  }
}
```

## See also

- `OBSERVABILITY_GUIDE.md`
- `BINDINGS_REFERENCE.md`
- `examples/`
- `wrangler.toml`
