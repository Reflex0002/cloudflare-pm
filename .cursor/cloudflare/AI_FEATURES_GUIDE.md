# AI Features Guide

This guide explains how to use the AI-powered features in the Feedback Tracker application.

## Overview

The feedback tracker now includes two powerful AI features powered by Cloudflare Workers AI and Vectorize:

1. **AI-Powered Search** - Semantic search across all feedback using natural language
2. **AI Summaries** - Automated summaries of feedback items using LLMs

## Architecture

### Components

- **Vectorize Index**: `feedback-search` - Stores 768-dimension embeddings
- **Embedding Model**: `@cf/baai/bge-base-en-v1.5` - Converts text to vectors
- **LLM Model**: `@cf/meta/llama-3.1-8b-instruct` - Generates summaries

### Data Flow

1. **Indexing**: Feedback (title + snippet + body) → Embedding Model → Vectorize
2. **Search**: User query → Embedding Model → Vectorize Query → Ranked Results
3. **Summary**: Feedback content → LLM → AI-generated summary

## Features

### 1. AI-Powered Search

**Location**: Inbox page, top toolbar

**How it works**:
- Click "🔍 AI Search" button
- Enter a natural language query (e.g., "authentication issues", "slow dashboard")
- Results are ranked by semantic similarity
- Each result shows:
  - Match score (0-100%)
  - Title and snippet
  - Source, status, and priority
- Click any result to open the detail panel

**Example Queries**:
- "Problems with billing"
- "Performance complaints"
- "Users can't log in"
- "Dashboard is slow"
- "API returning errors"

### 2. AI Summaries

**Location**: Feedback detail panel

**How it works**:
- Open any feedback item in the detail panel
- Click "AI Summary" button
- AI generates a concise 2-3 sentence summary
- Shows both AI summary and original snippet for comparison

**Benefits**:
- Quickly understand long feedback
- Get actionable insights
- Save time triaging feedback

## Setup & Usage

### Initial Setup

1. **Index Existing Feedback**:
   ```
   Click "Index All Feedback" button on the Inbox page
   ```
   - This processes all existing feedback items
   - Generates embeddings and stores them in Vectorize
   - May take a minute for large datasets
   - Only needs to be done once

2. **Auto-Indexing**:
   - New feedback can be indexed automatically
   - Call the index endpoint after creating feedback
   - Endpoint: `POST /api/vectorize/index/:id`

### API Endpoints

#### Index Single Feedback
```
POST /api/vectorize/index/:id
```
Indexes a specific feedback item into Vectorize.

#### Index All Feedback
```
POST /api/vectorize/index-all
```
Indexes all feedback items (limited to 100 most recent).

#### AI Search
```
GET /api/vectorize/search?q=<query>&topK=10
```
- `q`: Search query (required)
- `topK`: Number of results to return (default: 10)

Response:
```json
{
  "results": [
    {
      "id": "fb-123",
      "score": 0.87,
      "title": "Dashboard loading slowly",
      "snippet": "The dashboard takes...",
      "sourceType": "SUPPORT",
      "status": "NEW",
      "priority": "P1"
    }
  ],
  "count": 5
}
```

#### Generate Summary
```
GET /api/feedback/:id/summary
```

Response:
```json
{
  "summary": "User reports slow dashboard loading times..."
}
```

## Configuration

### wrangler.toml
```toml
[[vectorize]]
binding = "VECTORIZE"
index_name = "feedback-search"
remote = true

[ai]
binding = "AI"
remote = true
```

### Environment Bindings
```typescript
interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ATTACHMENTS: R2Bucket;
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}
```

## Best Practices

### Indexing
- Index new feedback immediately after creation
- Re-index when feedback content is significantly updated
- Batch index for bulk imports (use index-all endpoint)

### Searching
- Use natural language queries
- Be specific but not overly technical
- Results are ranked by semantic similarity (not keyword matching)
- Higher scores indicate better matches

### Summaries
- Summaries are cached for 5 minutes
- Best for long-form feedback
- Compare with original snippet for accuracy

## Limitations

- **Vectorize Index Size**: Monitor usage in Cloudflare dashboard
- **Embedding Model**: 768 dimensions (cannot be changed)
- **LLM Context**: Summaries limited to 150 tokens
- **Rate Limits**: Workers AI has rate limits per account
- **Local Development**: Vectorize and AI require `remote: true`

## Troubleshooting

### "Failed to index feedback"
- Check Workers AI binding is configured
- Verify Vectorize index exists
- Check network connectivity to Cloudflare

### Search returns no results
- Ensure feedback has been indexed
- Try broader/simpler queries
- Check Vectorize index has data

### Summary generation fails
- Verify AI binding is configured with `remote: true`
- Check feedback content is not empty
- Monitor Workers AI usage limits

## Pricing

- **Vectorize**: $0.040 per million queried dimensions
- **Workers AI**: Included in Workers plan, see pricing for limits
- **Embeddings**: ~$0.004 per million tokens
- **LLM Inference**: ~$0.012 per million tokens

Refer to [Cloudflare pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) for current rates.

## Future Enhancements

Potential improvements:
- Real-time indexing on feedback creation
- Advanced filtering (by source, status, priority)
- Multi-language support
- Sentiment analysis in summaries
- Batch summary generation
- Feedback clustering and themes
