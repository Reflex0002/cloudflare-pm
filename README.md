# Feedback Tracker

A full-stack feedback management application built with React, Vite, and Cloudflare Workers.

## Development Setup

This application requires **two servers** to run:

### 1. Frontend Development Server (Vite)
```bash
npm run dev
```
This starts the React frontend on `http://localhost:5173` (or next available port).

### 2. Worker API Server (Wrangler)
In a separate terminal:
```bash
npm run dev:worker
```
This starts the Cloudflare Worker API on `http://localhost:8787`.

### Initial Database Setup
On first run, you need to initialize the local D1 database with schema and seed data:
```bash
npm run dev:db
```

This command:
- Generates seed data from mock files
- Creates database tables
- Populates with sample feedback items

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/feedback` - List feedback items with filters
- `GET /api/feedback/:id` - Get single feedback item
- `PATCH /api/feedback/:id` - Update feedback item
- `GET /api/analytics/sources` - Source counts
- `GET /api/analytics/tags` - Tag counts
- `GET /api/analytics/views` - View counts
- `GET /api/analytics/triage-speed` - Triage metrics
- `GET /api/search?q=query` - Search feedback
- `GET /api/sources/:sourceType` - Get items by source

## Architecture

- **Frontend**: React + Vite + TanStack Query
- **API**: Cloudflare Workers + Hono
- **Database**: Cloudflare D1 (SQLite)
- **Cache**: Cloudflare KV
- **Storage**: Cloudflare R2 (for attachments)
- **AI**: Cloudflare Workers AI

## Deployment

### First Time Deployment

1. **Deploy the schema to production database**:
```bash
npm run db:schema
```

2. **Seed the production database**:
```bash
npm run db:seed
```

3. **Build and deploy the worker**:
```bash
npm run deploy
```

### Subsequent Deployments

After the initial setup, you only need to run:
```bash
npm run deploy
```

This builds the frontend and deploys the worker to Cloudflare.

### Troubleshooting Production Issues

- **"Asset not found" errors on routes like `/inbox`**: The worker now handles SPA routing properly by serving `index.html` for all non-API routes
- **No data loading**: Make sure you've run `npm run db:seed` to populate your production database
- **Need to reset data**: Run `npm run db:seed` again (it will clear and re-seed)

## AI Development Resources

For AI agents working on this project:

- Design patterns: `.cursor/cloudflare/DESIGN_PATTERNS.md`
- MCP tools guide: `.cursor/cloudflare/MCP_TOOLS_GUIDE.md`
- Cloudflare bindings: `.cursor/cloudflare/BINDINGS_REFERENCE.md`
- Worker patterns: `.cursor/cloudflare/WORKER_DEVELOPMENT.md`
