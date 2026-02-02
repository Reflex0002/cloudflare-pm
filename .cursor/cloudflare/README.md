---
type: reference
audience: ai-agent
topics: [cloudflare, workers, mcp-tools, design]
related: [DESIGN_PATTERNS.md, MCP_TOOLS_GUIDE.md, BINDINGS_REFERENCE.md]
---
# Cloudflare AI Reference Hub

This directory is the entry point for AI agents working on this repo. It centralizes the design spec, Worker patterns, and MCP tool usage so agents can discover the right information quickly.

## Start here

- Design patterns and data model: `DESIGN_PATTERNS.md`
- MCP tools discovery and usage: `MCP_TOOLS_GUIDE.md`
- Cloudflare bindings and resources: `BINDINGS_REFERENCE.md`
- Worker code structure and handlers: `WORKER_DEVELOPMENT.md`
- Observability queries and debugging: `OBSERVABILITY_GUIDE.md`
- End-to-end scenarios: `examples/`

## Quick discovery checklist

1. Read MCP tool schemas in `/mcps/<server>/tools/*.json`
2. Read per-server instructions in `/mcps/<server>/INSTRUCTIONS.md` when present
3. Confirm bindings in `wrangler.toml`
4. Align data model with `src/data/mockFeedback.js` and `db/schema.sql`

## See also

- `cloudflare_design.md`
- `src/server/router.ts`
- `src/server/types/bindings.ts`
