import type { Context } from "hono";
import type { Env } from "../types/bindings";
import { listFeedback } from "../db/queries";

const metadataKeys = [
  "queue",
  "slaHoursRemaining",
  "server",
  "channel",
  "repo",
  "labels",
  "mailbox",
  "fromDomain",
  "followerCount",
  "category",
  "upvotes",
];

export const sourcesHandler = async (c: Context<{ Bindings: Env }>) => {
  const sourceType = c.req.param("sourceType").toUpperCase();
  const filters = c.req.query();
  const result = await listFeedback(c.env, { ...filters, sourceType });

  const filtered = result.items.filter((item) => {
    const metadata = item.sourceMetadata ?? {};
    return metadataKeys.every((key) => {
      const filterValue = filters[key];
      if (!filterValue || filterValue === "All") return true;
      if (Array.isArray(metadata[key])) {
        return metadata[key].includes(filterValue);
      }
      return String(metadata[key]) === String(filterValue);
    });
  });

  return c.json({ items: filtered, total: filtered.length });
};
