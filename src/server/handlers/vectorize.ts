import type { Context } from "hono";
import type { Env } from "../types/bindings";
import { getFeedbackById } from "../db/queries";

const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";

interface EmbeddingResponse {
  shape: number[];
  data: number[][];
}

export const indexFeedbackHandler = async (c: Context<{ Bindings: Env }>) => {
  const id = c.req.param("id");

  try {
    // Get feedback item
    const item = await getFeedbackById(c.env, id);
    if (!item) {
      return c.json({ error: "Feedback not found" }, 404);
    }

    // Create text to embed (title + snippet + body)
    const textToEmbed = `${item.title}. ${item.snippet}. ${item.body}`;

    // Generate embedding using Workers AI
    const embeddings: EmbeddingResponse = await c.env.AI.run(EMBEDDING_MODEL, {
      text: [textToEmbed],
    });

    // Insert into Vectorize
    await c.env.VECTORIZE.upsert([
      {
        id: item.id,
        values: embeddings.data[0],
        metadata: {
          title: item.title,
          snippet: item.snippet,
          sourceType: item.sourceType,
          sourceLabel: item.sourceLabel,
          status: item.status,
          priority: item.priority,
          createdAt: item.createdAt,
        },
      },
    ]);

    return c.json({ ok: true, indexed: id });
  } catch (error) {
    console.error("Index feedback error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to index feedback" },
      500
    );
  }
};

export const searchFeedbackHandler = async (c: Context<{ Bindings: Env }>) => {
  const query = c.req.query("q");
  const topK = parseInt(c.req.query("topK") || "10", 10);

  if (!query) {
    return c.json({ error: "Query parameter 'q' is required" }, 400);
  }

  try {
    // Generate embedding for the search query
    const queryEmbeddings: EmbeddingResponse = await c.env.AI.run(EMBEDDING_MODEL, {
      text: [query],
    });

    // Search Vectorize
    const matches = await c.env.VECTORIZE.query(queryEmbeddings.data[0], {
      topK,
      returnMetadata: "all",
    });

    // Format results
    const results = matches.matches.map((match) => ({
      id: match.id,
      score: match.score,
      ...match.metadata,
    }));

    return c.json({ results, count: results.length });
  } catch (error) {
    console.error("Search feedback error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      500
    );
  }
};

export const generateSummaryHandler = async (c: Context<{ Bindings: Env }>) => {
  const id = c.req.param("id");

  try {
    // Get feedback item
    const item = await getFeedbackById(c.env, id);
    if (!item) {
      return c.json({ error: "Feedback not found" }, 404);
    }

    // Generate summary using Workers AI
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes customer feedback. Provide a concise, actionable summary in 2-3 sentences.",
        },
        {
          role: "user",
          content: `Summarize this feedback:\n\nTitle: ${item.title}\n\nBody: ${item.body}`,
        },
      ],
      max_tokens: 150,
    });

    return c.json({ summary: response.response || "Unable to generate summary" });
  } catch (error) {
    console.error("Generate summary error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to generate summary" },
      500
    );
  }
};

export const indexAllFeedbackHandler = async (c: Context<{ Bindings: Env }>) => {
  try {
    // Get all feedback items
    const { results } = await c.env.DB.prepare(
      `SELECT id, title, snippet, body, source_type as sourceType, 
              source_label as sourceLabel, status, priority, created_at as createdAt
       FROM feedback_items 
       LIMIT 100`
    ).all();

    if (!results || results.length === 0) {
      return c.json({ ok: true, indexed: 0, message: "No feedback items to index" });
    }

    const vectors = [];
    
    // Process in batches to avoid timeout
    for (const item of results) {
      const textToEmbed = `${item.title}. ${item.snippet}. ${item.body}`;
      
      const embeddings: EmbeddingResponse = await c.env.AI.run(EMBEDDING_MODEL, {
        text: [textToEmbed],
      });

      vectors.push({
        id: item.id as string,
        values: embeddings.data[0],
        metadata: {
          title: item.title as string,
          snippet: item.snippet as string,
          sourceType: item.sourceType as string,
          sourceLabel: item.sourceLabel as string,
          status: item.status as string,
          priority: item.priority as string,
          createdAt: item.createdAt as string,
        },
      });
    }

    // Bulk insert into Vectorize
    await c.env.VECTORIZE.upsert(vectors);

    return c.json({ ok: true, indexed: vectors.length });
  } catch (error) {
    console.error("Index all feedback error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to index feedback" },
      500
    );
  }
};

export const analyticsChatHandler = async (c: Context<{ Bindings: Env }>) => {
  try {
    const { message } = await c.req.json();

    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    // Get analytics context from database
    const { results: sourceCounts } = await c.env.DB.prepare(
      `SELECT source_type, COUNT(*) as count FROM feedback_items GROUP BY source_type`
    ).all();

    const { results: statusCounts } = await c.env.DB.prepare(
      `SELECT status, COUNT(*) as count FROM feedback_items GROUP BY status`
    ).all();

    const { results: recentFeedback } = await c.env.DB.prepare(
      `SELECT title, source_type, created_at FROM feedback_items ORDER BY created_at DESC LIMIT 10`
    ).all();

    const context = `
Analytics Data:
- Source Counts: ${JSON.stringify(sourceCounts)}
- Status Counts: ${JSON.stringify(statusCounts)}
- Recent Feedback: ${JSON.stringify(recentFeedback)}
`;

    // Generate response using Workers AI
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: `You are an analytics assistant for a feedback tracking system. Provide helpful insights based on the data. Keep responses concise and actionable. Current analytics data: ${context}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 200,
    });

    return c.json({ response: response.response || "I couldn't process that request." });
  } catch (error) {
    console.error("Analytics chat error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Chat failed" },
      500
    );
  }
};
