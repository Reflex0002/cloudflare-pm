import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { mockFeedback } from "../../src/data/mockFeedback.js";
import { mockUsers } from "../../src/data/mockUsers.js";
import { mockTags } from "../../src/data/mockTags.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, "seed.sql");

const escapeValue = (value) =>
  String(value).replace(/'/g, "''").replace(/\n/g, "\\n");

const toJson = (value) => escapeValue(JSON.stringify(value));

const tagSet = new Set(mockTags);
const tagList = Array.from(tagSet);
const userByName = new Map(mockUsers.map((user) => [user.name, user]));

const sql = [];
sql.push("PRAGMA foreign_keys = ON;");
sql.push("DELETE FROM feedback_tags;");
sql.push("DELETE FROM feedback_items;");
sql.push("DELETE FROM tags;");
sql.push("DELETE FROM users;");

for (const user of mockUsers) {
  sql.push(
    `INSERT INTO users (id, name, handle, company) VALUES ('${escapeValue(
      user.id
    )}', '${escapeValue(user.name)}', '${escapeValue(
      user.handle ?? ""
    )}', '${escapeValue(user.company ?? "")}');`
  );
}

for (const tag of tagList) {
  sql.push(`INSERT INTO tags (name) VALUES ('${escapeValue(tag)}');`);
}

for (const item of mockFeedback) {
  const author = userByName.get(item.authorName);
  const authorId = author?.id ?? null;
  const authorHandle = item.authorHandle ?? null;
  const company = item.company ?? null;
  sql.push(
    `INSERT INTO feedback_items (id, source_type, source_label, title, snippet, body, author_name, author_handle, company, created_at, status, type, priority, sentiment, product_area, source_metadata, author_id)` +
      ` VALUES ('${escapeValue(item.id)}', '${escapeValue(
        item.sourceType
      )}', '${escapeValue(item.sourceLabel)}', '${escapeValue(
        item.title
      )}', '${escapeValue(item.snippet)}', '${escapeValue(
        item.body
      )}', '${escapeValue(item.authorName)}', ${
        authorHandle ? `'${escapeValue(authorHandle)}'` : "NULL"
      }, ${company ? `'${escapeValue(company)}'` : "NULL"}, '${escapeValue(
        item.createdAt
      )}', '${escapeValue(item.status)}', '${escapeValue(
        item.type
      )}', '${escapeValue(item.priority)}', '${escapeValue(
        item.sentiment
      )}', ${
        item.productArea ? `'${escapeValue(item.productArea)}'` : "NULL"
      }, '${toJson(item.sourceMetadata ?? {})}', ${
        authorId ? `'${escapeValue(authorId)}'` : "NULL"
      });`
  );

  for (const tag of item.tags ?? []) {
    sql.push(
      `INSERT INTO feedback_tags (feedback_id, tag_id) VALUES ('${escapeValue(
        item.id
      )}', (SELECT id FROM tags WHERE name = '${escapeValue(tag)}'));`
    );
  }
}

fs.writeFileSync(outputPath, sql.join("\n"), "utf8");

if (process.env.RUN_WRANGLER === "true") {
  try {
    execSync(`wrangler d1 execute feedback-tracker-db --file ${outputPath}`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("Failed to run wrangler d1 execute. Seed file created at:", outputPath);
    process.exitCode = 1;
  }
} else {
  console.log("Seed file created at:", outputPath);
}
