const toKey = (prefix: string, value: string) =>
  `${prefix}:${value.replace(/\s+/g, "_").toLowerCase()}`;

export const getCache = async <T>(kv: KVNamespace, key: string) => {
  const cached = await kv.get(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
};

export const setCache = async (
  kv: KVNamespace,
  key: string,
  value: unknown,
  ttlSeconds: number
) => {
  await kv.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds });
};

export const cacheKeys = {
  query: (hash: string) => toKey("query", hash),
  analytics: (metric: string) => toKey("analytics", metric),
  item: (id: string) => toKey("item", id),
};
