# Product Feedback Tracker — Vite + React Spec (TanStack-Optimized, Dark Mode)

## Goal
Build a **Product Feedback Tracker web app** (mocked data only) that aggregates feedback from:
- Customer Support Tickets
- Discord
- GitHub Issues
- Email
- X/Twitter
- Community Forums

The app must be **cleanly navigable**, **well-structured**, and **optimized for TanStack** where appropriate (tables + data flow).

The AI building this app **CANNOT see any reference image**. Use this doc as the full spec.

---

## Design Theme (Dark Mode Only)

### Color Palette (MUST USE)
- Primary Dark: `#181818`
- Secondary Dark: `#1d1d1d`
- Tertiary Dark: `#272727`
- Orange Primary: `#f68220`
- White Primary: `#f2f2f2`
- Secondary White: `#b6b6b6`
- Blue: `#82b6ff`

### Palette Application Rules
- App background: `Primary Dark (#181818)`
- Cards/panels: `Secondary Dark (#1d1d1d)`
- Inputs / pills / hover: `Tertiary Dark (#272727)`
- Primary text: `White Primary (#f2f2f2)`
- Secondary text: `Secondary White (#b6b6b6)`
- Active selection / focus ring / links: `Blue (#82b6ff)`
- Primary CTA / emphasis: `Orange Primary (#f68220)`

---

## Assets
- `src/assets/logo.svg` (provided by user) — use in TopNavBar as app mark.

---

## Tech Stack (TanStack-Optimized)

### Build + Routing
- Vite + React
- `react-router-dom` for routing

### TanStack (preferred)
- **TanStack Table** for tables: `@tanstack/react-table`
- **TanStack Query** for mocked “fetch” + caching patterns: `@tanstack/react-query`
- (Optional) TanStack Virtual for large lists: `@tanstack/react-virtual`

### Charting (lightweight, minimal charts)
Use **ONE** chart library, minimal charts total (1–2 max):
- Preferred: **Recharts**
- Alternative: Nivo

---

## App Pages / Routes
1. `/inbox` — aggregated feedback inbox (primary)
2. `/sources/:source` — same experience filtered by source
3. `/analytics` — minimal analytics (1 chart + lists)
4. `/settings` — mock connector status / taxonomy

---

## App Shell Layout

### Top Navigation Bar (persistent)
Component: `TopNavBar`
- Left: `Logo (logo.svg)` + App name “Feedback Tracker”
- Center: tabs:
  - Inbox
  - Sources
  - Analytics
  - Settings
- Right:
  - Global Search input
  - Notification icon (mock)
  - User avatar menu (mock)

---

## Core UX: Inbox (3-Panel Triage Layout)
Route: `/inbox`

### Panel 1 — Left Sidebar
Component: `InboxSidebar`
Sections:
- Views
  - All Feedback
  - Needs Triage
  - High Impact
  - Bugs
  - Feature Requests
  - UX Pain
- Sources
  - Support Tickets
  - Discord
  - GitHub Issues
  - Email
  - X/Twitter
  - Community Forums
- Tags (optional)
Each item shows: icon + label + count badge.

### Panel 2 — Main List (Table-like, TanStack)
Component: `FeedbackTablePanel`
This is the main list of feedback items. It should be implemented with **TanStack Table**.

Top toolbar:
- Search within view
- Filters button (opens Filter Drawer)
- Sort dropdown
- Bulk actions (mock)

Main content:
- `FeedbackTable` (TanStack Table)
- Row click selects item and opens details panel

### Panel 3 — Details Panel
Component: `FeedbackDetailPanel`
Header:
- Source icon + label
- Title
- Status dropdown
- Priority selector
- Assign owner (mock)
Body:
- Unified display:
  - snippet
  - body
  - optional thread-like message list (Discord/email style)
Side metadata:
- Tags editor
- Related items list (mock)
- Linked work items list (mock)
Actions:
- Primary CTA: “Create Work Item” (Orange)
- “Mark Duplicate”
- “Request More Info”

---

## TanStack Table Requirements (Feedback Table)

### Why Table
Even if visually styled like a list, implement as a table for:
- Sorting
- Column visibility
- Row selection
- Filtering
- Consistent keyboard navigation patterns (optional)

### Required Columns (high signal, compact)
- Source (icon + label)
- Title (title + snippet on second line)
- Type (BUG/FEATURE/QUESTION/PRAISE) as pill
- Priority (P0–P3) as pill
- Status (NEW/TRIAGED/IN_PROGRESS/CLOSED) as pill
- Sentiment (dot or small text)
- Created (relative time)
- Tags (optional: show up to 2 + “+N”)

### Table Behaviors
- Clicking row selects it (highlights row)
- Selected row updates `FeedbackDetailPanel`
- Sorting supported on:
  - Created
  - Priority
  - Status
  - Source
- Filtering supported by:
  - SourceType
  - Status
  - Priority
  - Type
  - Tag
  - Free-text search (title/body/author)

### Optional TanStack Enhancements
- Column visibility toggle menu (nice-to-have)
- Virtualized rows using `@tanstack/react-virtual` if dataset is large

---

## Data Flow (TanStack Query + Local State)

### Mock “API”
Use TanStack Query to fetch mocked data:
- `useFeedbackItemsQuery(viewParams)`
- `useFeedbackItemByIdQuery(id)`
- `useSourceCountsQuery()`
- `useTagCountsQuery()`

### Why Query for Mocked Data
It creates clean boundaries and future-proofs for real APIs:
- caching
- query keys based on filters
- loading skeleton states

### Selection State
- Keep selected row ID in URL query param or local state:
  - Recommended: `?selected=<id>` so selection persists on refresh.

---

## Normalized Data Model (CRITICAL)
All sources map into a single type: `FeedbackItem`

Fields:
- `id: string`
- `sourceType: "SUPPORT" | "DISCORD" | "GITHUB" | "EMAIL" | "X" | "FORUM"`
- `sourceLabel: string`
- `title: string`
- `snippet: string`
- `body: string`
- `authorName: string`
- `authorHandle?: string`
- `company?: string`
- `createdAt: string` (ISO)
- `status: "NEW" | "TRIAGED" | "IN_PROGRESS" | "CLOSED"`
- `type: "BUG" | "FEATURE" | "QUESTION" | "PRAISE"`
- `priority: "P0" | "P1" | "P2" | "P3"`
- `sentiment: "NEGATIVE" | "NEUTRAL" | "POSITIVE"`
- `tags: string[]`
- `productArea?: string`
- `sourceMetadata: object`

sourceMetadata examples:
- SUPPORT: `{ ticketId, queue, slaHoursRemaining }`
- DISCORD: `{ server, channel, messageId }`
- GITHUB: `{ repo, issueNumber, labels }`
- EMAIL: `{ mailbox, threadId, fromDomain }`
- X: `{ tweetId, followerCount }`
- FORUM: `{ forumName, category, upvotes }`

---

## Sources Page
Route: `/sources/:source`

Reuses the Inbox 3-panel layout but with source pre-filter applied.
Source-specific filter UI (small):
- Support: queue, SLA risk
- Discord: server/channel
- GitHub: repo/label
- Email: mailbox/domain
- X: mentions/high follower
- Forums: category/upvotes

---

## Analytics Page (Minimal, Actionable)
Route: `/analytics`

Keep charts minimal (1 chart max recommended).

Cards:
1) Top Themes (no chart)
- ranked list of tags/themes
- clicking a theme navigates to inbox filtered by theme

2) Source Mix (ONE chart)
- Recharts donut or bar chart: distribution of items by source

3) Triage Speed (no chart)
- KPI: avg time to triage
- % triaged < 24h

---

## Settings Page (Mock Connectors)
Route: `/settings`

Connector cards for each source:
- Connected/Disconnected toggle (mock)
- “Test connection” button (mock)
- “Sync frequency” dropdown (mock)

---

## Component Inventory (Expected)

### App Shell
- `AppShell`
- `TopNavBar`

### Shared UI
- `Card`
- `Button`
- `IconButton`
- `Badge`
- `Pill`
- `CountBadge`
- `Dropdown`
- `SearchInput`
- `FilterDrawer`
- `SkeletonLoader`

### Inbox Feature
- `InboxPage`
- `InboxSidebar`
- `FeedbackTablePanel`
- `FeedbackTable` (TanStack Table)
- `FeedbackRowCells` (cell renderers: SourceCell, TitleCell, PillCell, TagsCell)
- `FeedbackDetailPanel`

### Analytics
- `AnalyticsPage`
- `SourceMixChart` (Recharts)
- `TopThemesCard`

### Settings
- `SettingsPage`
- `ConnectorCard`

---

## Required Project Structure (Vite-Ready)

src/
  assets/
    logo.svg
  components/
    ui/
      Button.jsx
      Card.jsx
      Badge.jsx
      Pill.jsx
      Dropdown.jsx
      SearchInput.jsx
      FilterDrawer.jsx
      Skeleton.jsx
    layout/
      AppShell.jsx
      TopNavBar.jsx
  features/
    inbox/
      InboxPage.jsx
      InboxSidebar.jsx
      FeedbackTablePanel.jsx
      FeedbackTable.jsx
      columns.jsx
      cellRenderers.jsx
      FeedbackDetailPanel.jsx
      inboxFilters.js
    sources/
      SourcesPage.jsx
    analytics/
      AnalyticsPage.jsx
      SourceMixChart.jsx
      TopThemesCard.jsx
    settings/
      SettingsPage.jsx
      ConnectorCard.jsx
  data/
    mockFeedback.js
    mockUsers.js
    mockTags.js
  queries/
    feedbackQueries.js
  theme/
    tokens.js
    global.css
  utils/
    formatDate.js
    clsx.js
  App.jsx
  main.jsx

---

## UX Requirements Checklist
- Dark mode only, strictly using palette
- TanStack Table for the main inbox list
- Row selection opens details panel
- Clean filters + sorting + search
- Counts per view/source displayed in sidebar
- Minimal charts; chart library: Recharts (preferred)
- Mocked data only; TanStack Query used to simulate fetching/caching
- Responsive:
  - Desktop: 3 panels
  - Tablet: collapsible sidebar
  - Mobile: details panel becomes a drawer or dedicated route