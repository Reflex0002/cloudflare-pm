---
type: reference
audience: ai-agent
topics: [observability, logs, metrics, workers]
related: [MCP_TOOLS_GUIDE.md, WORKER_DEVELOPMENT.md, ../README.md]
---
# Observability Guide

Use the `user-cloudflare-observability` MCP server to inspect Worker logs and metrics.

## Recommended workflow

1. `workers_list` to confirm the Worker service name
2. `observability_keys` to see available keys
3. `observability_values` to find valid values for a key
4. `query_worker_observability` using validated keys/values

## Common queries

### 1) Events: list recent errors (last hour)

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
    },
    "limit": 20
  }
}
```

### 2) Calculations: p99 duration by endpoint

```json
{
  "query": {
    "queryId": "workers-logs-calculations",
    "view": "calculations",
    "parameters": {
      "filters": [
        {
          "key": "$metadata.service",
          "operation": "eq",
          "type": "string",
          "value": "feedback-tracker-api"
        }
      ],
      "calculations": [
        {
          "operator": "p99",
          "key": "statistics.elapsed",
          "keyType": "number",
          "alias": "p99_elapsed"
        }
      ],
      "groupBys": [
        {
          "type": "string",
          "value": "$metadata.trigger"
        }
      ],
      "orderBy": {
        "value": "p99_elapsed",
        "order": "desc"
      },
      "limit": 10
    },
    "timeframe": {
      "reference": "1970-01-01T00:00:00Z",
      "offset": "-1h"
    }
  }
}
```

### 3) Invocations: find a slow request

```json
{
  "query": {
    "queryId": "workers-logs-invocations",
    "view": "invocations",
    "parameters": {
      "filters": [
        {
          "key": "$metadata.service",
          "operation": "eq",
          "type": "string",
          "value": "feedback-tracker-api"
        },
        {
          "key": "statistics.elapsed",
          "operation": "gt",
          "type": "number",
          "value": 1.0
        }
      ]
    },
    "timeframe": {
      "reference": "1970-01-01T00:00:00Z",
      "offset": "-6h"
    },
    "limit": 5
  }
}
```

## Troubleshooting tips

- If a query returns no results, widen the time range or remove filters
- Always validate keys with `observability_keys` and values with `observability_values`
- Use `dry: true` first when exploring new queries

## See also

- `MCP_TOOLS_GUIDE.md`
- `examples/debugging_worker_errors.md`
- `functions/api/[[path]].ts`
