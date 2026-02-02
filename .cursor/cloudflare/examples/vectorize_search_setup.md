---
type: example
audience: ai-agent
topics: [vectorize, search]
related: [../BINDINGS_REFERENCE.md, ../MCP_TOOLS_GUIDE.md]
---
# Vectorize Search Setup

## Problem

Understand how to use the `VECTORIZE` binding for semantic search over feedback.

## Tools

- `user-cloudflare-observability/search_cloudflare_documentation`

## Steps

1. Search Cloudflare docs for Vectorize usage:
   - Call `search_cloudflare_documentation` with keywords like `Vectorize bindings`
2. Inspect the binding in `wrangler.toml`:
   - `VECTORIZE` → index name `feedback_search`
3. Implement indexing and query flows inside the Worker using the bound index

## Notes

There is no dedicated MCP tool for Vectorize in this workspace. Use documentation search plus Worker code changes to integrate the binding.
