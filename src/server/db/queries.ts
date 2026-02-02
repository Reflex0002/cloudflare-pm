import type { Env } from "../types/bindings";

const sortMap: Record<string, string> = {
  createdAt: "fi.created_at",
  priority: "fi.priority",
  status: "fi.status",
  sourceType: "fi.source_type",
};

const buildFilters = (filters: Record<string, string | undefined>) => {
  const clauses: string[] = [];
  const params: string[] = [];

  const {
    sourceType,
    status,
    priority,
    type,
    search,
    tag,
    view,
  } = filters;

  if (sourceType) {
    clauses.push("fi.source_type = ?");
    params.push(sourceType);
  }
  if (status) {
    clauses.push("fi.status = ?");
    params.push(status);
  }
  if (priority) {
    clauses.push("fi.priority = ?");
    params.push(priority);
  }
  if (type) {
    clauses.push("fi.type = ?");
    params.push(type);
  }
  if (search) {
    clauses.push(
      "(fi.title LIKE ? OR fi.snippet LIKE ? OR fi.body LIKE ? OR fi.author_name LIKE ? OR fi.company LIKE ?)"
    );
    const like = `%${search}%`;
    params.push(like, like, like, like, like);
  }
  if (tag) {
    clauses.push(
      "EXISTS (SELECT 1 FROM feedback_tags ft JOIN tags t ON t.id = ft.tag_id WHERE ft.feedback_id = fi.id AND t.name = ?)"
    );
    params.push(tag);
  }

  if (view === "NEEDS_TRIAGE") {
    clauses.push("fi.status = 'NEW'");
  }
  if (view === "HIGH_IMPACT") {
    clauses.push("(fi.priority = 'P0' OR fi.priority = 'P1')");
  }
  if (view === "BUGS") {
    clauses.push("fi.type = 'BUG'");
  }
  if (view === "FEATURES") {
    clauses.push("fi.type = 'FEATURE'");
  }
  if (view === "UX_PAIN") {
    clauses.push(
      "EXISTS (SELECT 1 FROM feedback_tags ft JOIN tags t ON t.id = ft.tag_id WHERE ft.feedback_id = fi.id AND (t.name = 'ux' OR t.name = 'usability'))"
    );
  }

  return { clauses, params };
};

const parseTags = (tags: string | null) =>
  tags ? tags.split("|").filter(Boolean) : [];

const parseMetadata = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

export const listFeedback = async (
  env: Env,
  filters: Record<string, string | undefined>
) => {
  const { clauses, params } = buildFilters(filters);
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const sortColumn = sortMap[filters.sortBy ?? "createdAt"] ?? sortMap.createdAt;
  const sortDir = filters.sortDir === "asc" ? "ASC" : "DESC";
  const limit = Math.min(Number(filters.limit ?? 50) || 50, 200);
  const offset = Number(filters.offset ?? 0) || 0;

  const sql = `
    SELECT fi.*,
      GROUP_CONCAT(t.name, '|') AS tags
    FROM feedback_items fi
    LEFT JOIN feedback_tags ft ON ft.feedback_id = fi.id
    LEFT JOIN tags t ON t.id = ft.tag_id
    ${where}
    GROUP BY fi.id
    ORDER BY ${sortColumn} ${sortDir}
    LIMIT ? OFFSET ?
  `;

  const countSql = `
    SELECT COUNT(*) as total
    FROM feedback_items fi
    ${where}
  `;

  const itemsResult = await env.DB.prepare(sql)
    .bind(...params, String(limit), String(offset))
    .all();
  const countResult = await env.DB.prepare(countSql).bind(...params).first();

  const items = (itemsResult.results || []).map((row) => ({
    id: row.id,
    sourceType: row.source_type,
    sourceLabel: row.source_label,
    title: row.title,
    snippet: row.snippet,
    body: row.body,
    authorName: row.author_name,
    authorHandle: row.author_handle ?? undefined,
    company: row.company ?? undefined,
    createdAt: row.created_at,
    status: row.status,
    type: row.type,
    priority: row.priority,
    sentiment: row.sentiment,
    productArea: row.product_area ?? undefined,
    sourceMetadata: parseMetadata(row.source_metadata),
    tags: parseTags(row.tags ?? null),
  }));

  return {
    items,
    total: Number(countResult?.total ?? 0),
  };
};

export const getFeedbackById = async (env: Env, id: string) => {
  const sql = `
    SELECT fi.*,
      GROUP_CONCAT(t.name, '|') AS tags
    FROM feedback_items fi
    LEFT JOIN feedback_tags ft ON ft.feedback_id = fi.id
    LEFT JOIN tags t ON t.id = ft.tag_id
    WHERE fi.id = ?
    GROUP BY fi.id
    LIMIT 1
  `;

  const row = await env.DB.prepare(sql).bind(id).first();
  if (!row) return null;

  return {
    id: row.id,
    sourceType: row.source_type,
    sourceLabel: row.source_label,
    title: row.title,
    snippet: row.snippet,
    body: row.body,
    authorName: row.author_name,
    authorHandle: row.author_handle ?? undefined,
    company: row.company ?? undefined,
    createdAt: row.created_at,
    status: row.status,
    type: row.type,
    priority: row.priority,
    sentiment: row.sentiment,
    productArea: row.product_area ?? undefined,
    sourceMetadata: parseMetadata(row.source_metadata),
    tags: parseTags(row.tags ?? null),
  };
};

export const updateFeedback = async (
  env: Env,
  id: string,
  updates: { status?: string; priority?: string; tags?: string[] }
) => {
  const setClauses: string[] = [];
  const params: string[] = [];

  if (updates.status) {
    setClauses.push("status = ?");
    params.push(updates.status);
  }
  if (updates.priority) {
    setClauses.push("priority = ?");
    params.push(updates.priority);
  }

  if (setClauses.length) {
    await env.DB.prepare(
      `UPDATE feedback_items SET ${setClauses.join(", ")} WHERE id = ?`
    )
      .bind(...params, id)
      .run();
  }

  if (updates.tags) {
    await env.DB.prepare("DELETE FROM feedback_tags WHERE feedback_id = ?")
      .bind(id)
      .run();
    for (const tag of updates.tags) {
      const existing = await env.DB.prepare(
        "SELECT id FROM tags WHERE name = ? LIMIT 1"
      )
        .bind(tag)
        .first();
      let tagId = existing?.id;
      if (!tagId) {
        const insert = await env.DB.prepare(
          "INSERT INTO tags (name) VALUES (?)"
        )
          .bind(tag)
          .run();
        tagId = insert.meta?.last_row_id;
      }
      if (tagId) {
        await env.DB.prepare(
          "INSERT OR IGNORE INTO feedback_tags (feedback_id, tag_id) VALUES (?, ?)"
        )
          .bind(id, String(tagId))
          .run();
      }
    }
  }
};

export const getSourceCounts = async (env: Env) => {
  const result = await env.DB.prepare(
    "SELECT source_type as sourceType, COUNT(*) as count FROM feedback_items GROUP BY source_type"
  ).all();
  return result.results || [];
};

export const getTagCounts = async (env: Env) => {
  const result = await env.DB.prepare(
    "SELECT t.name as tag, COUNT(*) as count FROM feedback_tags ft JOIN tags t ON t.id = ft.tag_id GROUP BY t.name"
  ).all();
  return result.results || [];
};

export const getViewCounts = async (env: Env) => {
  const total = await env.DB.prepare("SELECT COUNT(*) as count FROM feedback_items").first();
  const needsTriage = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM feedback_items WHERE status = 'NEW'"
  ).first();
  const highImpact = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM feedback_items WHERE priority IN ('P0', 'P1')"
  ).first();
  const bugs = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM feedback_items WHERE type = 'BUG'"
  ).first();
  const features = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM feedback_items WHERE type = 'FEATURE'"
  ).first();
  const uxPain = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM feedback_items fi WHERE EXISTS (SELECT 1 FROM feedback_tags ft JOIN tags t ON t.id = ft.tag_id WHERE ft.feedback_id = fi.id AND (t.name = 'ux' OR t.name = 'usability'))"
  ).first();

  return {
    ALL: Number(total?.count ?? 0),
    NEEDS_TRIAGE: Number(needsTriage?.count ?? 0),
    HIGH_IMPACT: Number(highImpact?.count ?? 0),
    BUGS: Number(bugs?.count ?? 0),
    FEATURES: Number(features?.count ?? 0),
    UX_PAIN: Number(uxPain?.count ?? 0),
  };
};

export const getTriageSpeed = async () => ({
  avgHours: null,
  under24Percent: 0,
});
