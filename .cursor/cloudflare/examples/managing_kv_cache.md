---
type: example
audience: ai-agent
topics: [kv, cache]
related: [../BINDINGS_REFERENCE.md, ../WORKER_DEVELOPMENT.md]
---
# Managing KV Cache

## Problem

Confirm the KV namespace exists and understand cache key conventions.

## Tools

- `user-worker-bindings/kv_namespaces_list`
- `user-worker-bindings/kv_namespace_get`

## Steps

1. List KV namespaces:
   - Call `kv_namespaces_list`
2. Find the namespace with ID `66823948eeac44a48621707ec8ed0b77`
3. Retrieve metadata with `kv_namespace_get`
4. Use `src/server/cache/kv.ts` for key naming rules

## Key patterns

From `src/server/cache/kv.ts`:

- `query:<hash>`
- `analytics:<metric>`
- `item:<id>`

## Notes

The MCP tools manage namespaces, not individual keys. To inspect key values, use Worker code or add an API endpoint for debugging.
