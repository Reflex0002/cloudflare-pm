---
type: example
audience: ai-agent
topics: [observability, errors, workers]
related: [../OBSERVABILITY_GUIDE.md, ../MCP_TOOLS_GUIDE.md]
---
# Debugging Worker Errors

## Problem

Find recent errors in the `feedback-tracker-api` Worker and inspect the offending requests.

## Tools

- `user-cloudflare-observability/observability_keys`
- `user-cloudflare-observability/observability_values`
- `user-cloudflare-observability/query_worker_observability`

## Steps

1. List valid keys:
   - Call `observability_keys`
2. Confirm the service name:
   - Call `observability_values` for `$metadata.service`
3. Query recent errors:
   - Call `query_worker_observability` (events view) with:
     - `$metadata.service` = `feedback-tracker-api`
     - `$metadata.error` exists
     - timeframe last hour

## Example query

```json
{
  "query": {
    "queryId": "workers-logs-events",
    "view": "events",
    "parameters": {
      "filters": [
        { "key": "$metadata.service", "operation": "eq", "type": "string", "value": "feedback-tracker-api" },
        { "key": "$metadata.error", "operation": "exists", "type": "string" }
      ]
    },
    "timeframe": { "reference": "1970-01-01T00:00:00Z", "offset": "-1h" },
    "limit": 10
  }
}
```

## Interpret results

- Look for repeated errors or specific endpoints in `$metadata.trigger`
- Use request IDs from the result to correlate client behavior
