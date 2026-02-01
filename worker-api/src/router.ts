import { Hono } from "hono";
import type { Env } from "./types/bindings";
import {
  getFeedbackHandler,
  listFeedbackHandler,
  patchFeedbackHandler,
} from "./handlers/feedback";
import {
  sourceCountsHandler,
  tagCountsHandler,
  triageSpeedHandler,
  viewCountsHandler,
} from "./handlers/analytics";
import { sourcesHandler } from "./handlers/sources";
import { searchHandler } from "./handlers/search";

export const createRouter = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get("/api/feedback", listFeedbackHandler);
  app.get("/api/feedback/:id", getFeedbackHandler);
  app.patch("/api/feedback/:id", patchFeedbackHandler);

  app.get("/api/analytics/sources", sourceCountsHandler);
  app.get("/api/analytics/tags", tagCountsHandler);
  app.get("/api/analytics/views", viewCountsHandler);
  app.get("/api/analytics/triage-speed", triageSpeedHandler);

  app.get("/api/search", searchHandler);
  app.get("/api/sources/:sourceType", sourcesHandler);

  return app;
};
