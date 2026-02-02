---
type: example
audience: ai-agent
topics: [d1, data, queries]
related: [../BINDINGS_REFERENCE.md, ../MCP_TOOLS_GUIDE.md]
---
# Querying Feedback Data (D1)

## Problem

Inspect recent feedback items and verify tag counts.

## Tools

- `user-worker-bindings/d1_databases_list`
- `user-worker-bindings/d1_database_query`

## Steps

1. Find the D1 database ID:
   - Call `d1_databases_list`
2. Query recent items:
   - Call `d1_database_query` with a SQL `SELECT`
3. Validate tag distribution:
   - Run a `GROUP BY` query against `tags` and `feedback_tags`

## Example queries

```json
{
  "database_id": "<from d1_databases_list>",
  "sql": "SELECT id, title, status, priority, created_at FROM feedback_items ORDER BY created_at DESC LIMIT 10"
}
```

```json
{
  "database_id": "<from d1_databases_list>",
  "sql": "SELECT t.name, COUNT(*) as count FROM feedback_tags ft JOIN tags t ON t.id = ft.tag_id GROUP BY t.name ORDER BY count DESC LIMIT 10"
}
```

## Interpret results

- Confirm `status` and `priority` fields align with the UI filters
- Use the counts to sanity-check tag usage in analytics
