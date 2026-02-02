import type { Context } from "hono";
import type { Env } from "../types/bindings";
import { cacheKeys, getCache, setCache } from "../cache/kv";
import {
  getSourceCounts,
  getTagCounts,
  getTriageSpeed,
  getViewCounts,
} from "../db/queries";

export const sourceCountsHandler = async (c: Context<{ Bindings: Env }>) => {
  const key = cacheKeys.analytics("sources");
  const cached = await getCache(c.env.CACHE, key);
  if (cached) return c.json(cached);

  const counts = await getSourceCounts(c.env);
  const payload = counts.reduce((acc, row) => {
    acc[row.sourceType] = row.count;
    return acc;
  }, {});
  await setCache(c.env.CACHE, key, payload, 900);
  return c.json(payload);
};

export const tagCountsHandler = async (c: Context<{ Bindings: Env }>) => {
  const key = cacheKeys.analytics("tags");
  const cached = await getCache(c.env.CACHE, key);
  if (cached) return c.json(cached);

  const counts = await getTagCounts(c.env);
  const payload = counts.reduce((acc, row) => {
    acc[row.tag] = row.count;
    return acc;
  }, {});
  await setCache(c.env.CACHE, key, payload, 900);
  return c.json(payload);
};

export const viewCountsHandler = async (c: Context<{ Bindings: Env }>) => {
  const key = cacheKeys.analytics("views");
  const cached = await getCache(c.env.CACHE, key);
  if (cached) return c.json(cached);

  const counts = await getViewCounts(c.env);
  await setCache(c.env.CACHE, key, counts, 900);
  return c.json(counts);
};

export const triageSpeedHandler = async (c: Context<{ Bindings: Env }>) => {
  const key = cacheKeys.analytics("triage_speed");
  const cached = await getCache(c.env.CACHE, key);
  if (cached) return c.json(cached);

  const metrics = await getTriageSpeed();
  await setCache(c.env.CACHE, key, metrics, 900);
  return c.json(metrics);
};
