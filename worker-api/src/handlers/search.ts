import type { Context } from "hono";
import type { Env } from "../types/bindings";
import { getFeedbackById, listFeedback } from "../db/queries";

const embedQuery = async (env: Env, query: string) => {
  try {
    const response = (await env.AI.run("@cf/baai/bge-base-en-v1.5", {
      text: query,
    })) as { data?: number[][] };
    return response?.data?.[0] ?? null;
  } catch {
    return null;
  }
};

export const searchHandler = async (c: Context<{ Bindings: Env }>) => {
  const query = c.req.query("q")?.trim();
  if (!query) {
    return c.json({ items: [] });
  }

  const vector = await embedQuery(c.env, query);
  if (vector && c.env.VECTORIZE) {
    try {
      const results = (await (c.env.VECTORIZE as unknown as {
        query: (input: { vector: number[]; topK: number }) => Promise<{
          matches: { id: string }[];
        }>;
      }).query({ vector, topK: 10 })) as { matches?: { id: string }[] };
      const ids = results.matches?.map((match) => match.id).filter(Boolean) ?? [];
      if (ids.length) {
        const items: unknown[] = [];
        for (const id of ids) {
          const detail = await getFeedbackById(c.env, id);
          if (detail) items.push(detail);
        }
        return c.json({ items });
      }
    } catch {
      // Fall back to lexical search below.
    }
  }

  const fallback = await listFeedback(c.env, { search: query, limit: "25" });
  return c.json({ items: fallback.items });
};
