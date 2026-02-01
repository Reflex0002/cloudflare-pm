import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types/bindings";
import { createRouter } from "./router";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: ["https://feedback-tracker.pages.dev", "http://localhost:5173"],
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration_ms: duration,
    })
  );
});

app.route("/", createRouter());

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
