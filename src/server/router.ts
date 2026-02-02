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
import {
  uploadAttachmentHandler,
  listAttachmentsHandler,
  getAttachmentHandler,
  deleteAttachmentHandler,
} from "./handlers/attachments";
import {
  indexFeedbackHandler,
  searchFeedbackHandler,
  generateSummaryHandler,
  indexAllFeedbackHandler,
  analyticsChatHandler,
} from "./handlers/vectorize";

export const createRouter = () => {
  const app = new Hono<{ Bindings: Env }>();

  app.get("/api/health", async (c) => {
    try {
      await c.env.DB.prepare("SELECT 1").first();
      return c.json({ ok: true });
    } catch (error) {
      return c.json(
        { ok: false, error: error instanceof Error ? error.message : "DB error" },
        500
      );
    }
  });

  app.get("/api/feedback", listFeedbackHandler);
  app.get("/api/feedback/:id", getFeedbackHandler);
  app.patch("/api/feedback/:id", patchFeedbackHandler);

  app.post("/api/feedback/:id/attachments", uploadAttachmentHandler);
  app.get("/api/feedback/:id/attachments", listAttachmentsHandler);
  app.get("/api/attachments/:attachmentId", getAttachmentHandler);
  app.delete("/api/attachments/:attachmentId", deleteAttachmentHandler);

  app.get("/api/analytics/sources", sourceCountsHandler);
  app.get("/api/analytics/tags", tagCountsHandler);
  app.get("/api/analytics/views", viewCountsHandler);
  app.get("/api/analytics/triage-speed", triageSpeedHandler);

  app.get("/api/search", searchHandler);
  app.get("/api/sources/:sourceType", sourcesHandler);

  app.post("/api/vectorize/index/:id", indexFeedbackHandler);
  app.post("/api/vectorize/index-all", indexAllFeedbackHandler);
  app.get("/api/vectorize/search", searchFeedbackHandler);
  app.get("/api/feedback/:id/summary", generateSummaryHandler);
  app.post("/api/analytics/chat", analyticsChatHandler);

  return app;
};
