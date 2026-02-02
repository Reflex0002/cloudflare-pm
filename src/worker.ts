import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./server/types/bindings";
import { createRouter } from "./server/router";

type WorkerEnv = Env & {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: WorkerEnv }>();

// CORS middleware - allow frontend to access API
app.use(
  "/api/*",
  cors({
    origin: "*",
    credentials: true,
  })
);

// Logging middleware
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

// Serve static assets and handle SPA routing
app.get("*", async (c) => {
  // API routes should have been handled by the router
  if (c.req.path.startsWith("/api")) {
    return c.json({ error: "Not found" }, 404);
  }

  // In local dev, ASSETS might not be available
  if (!c.env.ASSETS) {
    console.log("ASSETS binding missing. Available bindings:", Object.keys(c.env));
    return c.text("Asset not found. Make sure to run the frontend dev server (npm run dev) separately. (Env: " + Object.keys(c.env).join(", ") + ")", 404);
  }

  // Try to fetch the exact asset first
  const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
  
  // If the asset exists, return it
  if (assetResponse.status === 200) {
    return assetResponse;
  }

  // For all other routes (404s), serve index.html to support SPA routing
  // This allows React Router to handle client-side routing
  const indexRequest = new Request(new URL("/index.html", c.req.url), c.req.raw);
  return c.env.ASSETS.fetch(indexRequest);
});

export default app;
