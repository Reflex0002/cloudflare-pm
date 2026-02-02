import type { Context } from "hono";
import type { Env } from "../types/bindings";

export const uploadAttachmentHandler = async (c: Context<{ Bindings: Env }>) => {
  const feedbackId = c.req.param("id");
  const formData = await c.req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return c.json({ error: "No file provided" }, 400);
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return c.json({ error: "Only image files are allowed" }, 400);
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return c.json({ error: "File size must be less than 5MB" }, 400);
  }

  // Generate unique ID and R2 key
  const attachmentId = crypto.randomUUID();
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "jpg";
  const r2Key = `attachments/${feedbackId}/${timestamp}-${attachmentId}.${extension}`;

  try {
    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await c.env.ATTACHMENTS.put(r2Key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Save metadata to D1
    const uploadedAt = new Date().toISOString();
    await c.env.DB.prepare(
      `INSERT INTO attachments (id, feedback_id, filename, content_type, size, r2_key, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(attachmentId, feedbackId, file.name, file.type, file.size, r2Key, uploadedAt)
      .run();

    return c.json({
      id: attachmentId,
      filename: file.name,
      contentType: file.type,
      size: file.size,
      uploadedAt,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      500
    );
  }
};

export const listAttachmentsHandler = async (c: Context<{ Bindings: Env }>) => {
  const feedbackId = c.req.param("id");

  try {
    const { results } = await c.env.DB.prepare(
      `SELECT id, filename, content_type as contentType, size, uploaded_at as uploadedAt
       FROM attachments 
       WHERE feedback_id = ? 
       ORDER BY uploaded_at DESC`
    )
      .bind(feedbackId)
      .all();

    return c.json({ attachments: results || [] });
  } catch (error) {
    console.error("List attachments error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to list attachments" },
      500
    );
  }
};

export const getAttachmentHandler = async (c: Context<{ Bindings: Env }>) => {
  const attachmentId = c.req.param("attachmentId");

  try {
    // Get attachment metadata from D1
    const attachment = await c.env.DB.prepare(
      `SELECT r2_key, content_type, filename 
       FROM attachments 
       WHERE id = ?`
    )
      .bind(attachmentId)
      .first();

    if (!attachment) {
      return c.json({ error: "Attachment not found" }, 404);
    }

    // Get file from R2
    const object = await c.env.ATTACHMENTS.get(attachment.r2_key as string);

    if (!object) {
      return c.json({ error: "File not found in storage" }, 404);
    }

    // Return the file
    return new Response(object.body, {
      headers: {
        "Content-Type": attachment.content_type as string,
        "Content-Disposition": `inline; filename="${attachment.filename}"`,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Get attachment error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to get attachment" },
      500
    );
  }
};

export const deleteAttachmentHandler = async (c: Context<{ Bindings: Env }>) => {
  const attachmentId = c.req.param("attachmentId");

  try {
    // Get attachment metadata
    const attachment = await c.env.DB.prepare(
      `SELECT r2_key FROM attachments WHERE id = ?`
    )
      .bind(attachmentId)
      .first();

    if (!attachment) {
      return c.json({ error: "Attachment not found" }, 404);
    }

    // Delete from R2
    await c.env.ATTACHMENTS.delete(attachment.r2_key as string);

    // Delete from D1
    await c.env.DB.prepare(`DELETE FROM attachments WHERE id = ?`)
      .bind(attachmentId)
      .run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete attachment error:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to delete attachment" },
      500
    );
  }
};
