import type { Context } from "hono";
import type { Env } from "../types/bindings";
import { cacheKeys, getCache, setCache } from "../cache/kv";
import { getFeedbackById, listFeedback, updateFeedback } from "../db/queries";

const hashFilters = (filters: Record<string, string | undefined>) =>
  btoa(JSON.stringify(filters)).replace(/=+$/g, "");

export const listFeedbackHandler = async (c: Context<{ Bindings: Env }>) => {
  const filters = c.req.query();
  const key = cacheKeys.query(hashFilters(filters));
  const cached = await getCache<{ items: unknown[]; total: number }>(
    c.env.CACHE,
    key
  );
  if (cached) {
    return c.json(cached);
  }

  const result = await listFeedback(c.env, filters);
  await setCache(c.env.CACHE, key, result, 300);
  return c.json(result);
};

export const getFeedbackHandler = async (c: Context<{ Bindings: Env }>) => {
  const id = c.req.param("id");
  const key = cacheKeys.item(id);
  const cached = await getCache<unknown>(c.env.CACHE, key);
  if (cached) return c.json(cached);

  const item = await getFeedbackById(c.env, id);
  if (!item) {
    return c.json({ error: "Not found" }, 404);
  }
  await setCache(c.env.CACHE, key, item, 3600);
  return c.json(item);
};

export const patchFeedbackHandler = async (c: Context<{ Bindings: Env }>) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null);
  if (!body) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  await updateFeedback(c.env, id, {
    status: body.status,
    priority: body.priority,
    tags: body.tags,
  });

  // Clear both item cache and all query caches
  await c.env.CACHE.delete(cacheKeys.item(id));
  
  // Clear all query caches by listing and deleting keys that start with "query:"
  const cacheList = await c.env.CACHE.list({ prefix: "query:" });
  const deletePromises = cacheList.keys.map(key => c.env.CACHE.delete(key.name));
  await Promise.all(deletePromises);
  
  return c.json({ ok: true });
};
