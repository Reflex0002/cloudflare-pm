---
type: reference
audience: ai-agent
topics: [design, data-model, tanstack, mock-data]
related: [BINDINGS_REFERENCE.md, WORKER_DEVELOPMENT.md, ../README.md]
---
# Design Patterns and Data Model

This document distills `cloudflare_design.md` into implementation-ready patterns aligned with the current codebase.

## Source of truth files

- Mock data: `src/data/mockFeedback.js`, `src/data/mockUsers.js`, `src/data/mockTags.js`
- API contracts (server): `src/server/db/queries.ts`, `db/schema.sql`

## Canonical FeedbackItem shape

Use this shape throughout the UI and API. It matches the current mock generator.

```ts
type FeedbackItem = {
  id: string;
  sourceType: "SUPPORT" | "DISCORD" | "GITHUB" | "EMAIL" | "X" | "FORUM";
  sourceLabel: string;
  title: string;
  snippet: string;
  body: string;
  authorName: string;
  authorHandle?: string;
  company?: string;
  createdAt: string; // ISO
  status: "NEW" | "TRIAGED" | "IN_PROGRESS" | "CLOSED";
  type: "BUG" | "FEATURE" | "QUESTION" | "PRAISE";
  priority: "P0" | "P1" | "P2" | "P3";
  sentiment: "NEGATIVE" | "NEUTRAL" | "POSITIVE";
  tags: string[];
  productArea?: "Networking" | "Security" | "Analytics" | "Edge";
  sourceMetadata: Record<string, unknown>;
};
```

## Source metadata shapes

Map `sourceMetadata` by `sourceType`:

- SUPPORT: `{ ticketId, queue, slaHoursRemaining }`
- DISCORD: `{ server, channel, messageId }`
- GITHUB: `{ repo, issueNumber, labels }`
- EMAIL: `{ mailbox, threadId, fromDomain }`
- X: `{ tweetId, followerCount }`
- FORUM: `{ forumName, category, upvotes }`

## Mock data generation rules

From `src/data/mockFeedback.js`:

- 60 items generated with `Array.from({ length: 60 })`
- `createdAt` spaced by 6 hours per index
- `tags` size: `(index % 3) + 1`
- `sourceLabel` derived from `sourceType` mapping

### Stability note

Some metadata IDs use `Date.now()` for DISCORD, EMAIL, X. If stable IDs are required (URL selection, caching, tests), prefer deterministic IDs:

- `messageId: msg-${index}`
- `threadId: thr-${index}`
- `tweetId: tw-${index}`

## Query patterns (TanStack Query)

Queries should be named and shaped consistently:

- `useFeedbackItemsQuery(filters)` returns `{ items, total }`
- `useFeedbackItemByIdQuery(id)` returns one item
- `useSourceCountsQuery()` returns counts by source
- `useTagCountsQuery()` returns counts by tag
- `useViewCountsQuery()` returns counts for sidebar views

Current client uses `src/api/client.ts` with filter query params.

## Filtering rules

Filters are expected to support:

- `sourceType`, `status`, `priority`, `type`, `tag`, `search`
- Free-text search over `title`, `snippet`, `body`, `authorName`, `company`

Sidebar views map to server rules (see `src/server/db/queries.ts`):

- `NEEDS_TRIAGE` → `status = NEW`
- `HIGH_IMPACT` → `priority IN (P0, P1)`
- `BUGS` → `type = BUG`
- `FEATURES` → `type = FEATURE`
- `UX_PAIN` → tags include `ux` or `usability`

## Sorting rules

Supported sort keys:

- `createdAt`
- `priority`
- `status`
- `sourceType`

## Table column mapping

Required columns for TanStack Table:

- Source: `sourceType`, `sourceLabel`
- Title: `title`, `snippet`
- Type: `type`
- Priority: `priority`
- Status: `status`
- Sentiment: `sentiment`
- Created: `createdAt` (formatted)
- Tags: `tags` (show 2 + “+N”)

## AI chat data seam (mock mode)

Mock mode should expose a stable seam:

```ts
chatService.ask({ filters, selectedId })
```

The implementation can read from current filters + selected item and return summaries.

## See also

- `cloudflare_design.md`
- `BINDINGS_REFERENCE.md`
- `src/data/mockFeedback.js`
- `src/server/db/queries.ts`
- `db/schema.sql`
