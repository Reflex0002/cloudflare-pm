import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Pill } from "../../components/ui/Pill";
import { Skeleton } from "../../components/ui/Skeleton";
import { useFeedbackItemByIdQuery, useUpdateFeedbackMutation } from "../../queries/feedbackQueries";
import { useAttachmentsQuery, useUploadAttachment } from "../../queries/attachmentQueries";
import { useGenerateSummaryQuery } from "../../queries/aiQueries";
import { mockTags } from "../../data/mockTags";

const statusOptions = [
  { value: "NEW", color: "rgba(59, 130, 246, 0.2)", textColor: "#3b82f6" },
  { value: "TRIAGED", color: "rgba(168, 85, 247, 0.2)", textColor: "#a855f7" },
  { value: "IN_PROGRESS", color: "rgba(234, 179, 8, 0.2)", textColor: "#eab308" },
  { value: "CLOSED", color: "rgba(34, 197, 94, 0.2)", textColor: "#22c55e" },
];

const priorityOptions = [
  { value: "P0", color: "rgba(239, 68, 68, 0.2)", textColor: "#ef4444" },
  { value: "P1", color: "rgba(249, 115, 22, 0.2)", textColor: "#f97316" },
  { value: "P2", color: "rgba(234, 179, 8, 0.2)", textColor: "#eab308" },
  { value: "P3", color: "rgba(34, 197, 94, 0.2)", textColor: "#22c55e" },
];

export const FeedbackDetailPanel = ({ selectedId }) => {
  // State declarations must come before they're used in hooks
  const [showSnippet, setShowSnippet] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [status, setStatus] = useState("NEW");
  const [priority, setPriority] = useState("P0");
  const [tags, setTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  
  // Now we can use showSnippet in the query
  const { data, isLoading } = useFeedbackItemByIdQuery(selectedId);
  const { data: attachmentsData, isLoading: isLoadingAttachments } = useAttachmentsQuery(selectedId);
  const { data: summaryData, isLoading: isLoadingSummary } = useGenerateSummaryQuery(selectedId, showSnippet);
  const uploadMutation = useUploadAttachment(selectedId);
  const updateMutation = useUpdateFeedbackMutation(selectedId);
  const fileInputRef = useRef(null);
  const tagDropdownRef = useRef(null);

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      setStatus(data.status);
      setPriority(data.priority);
      setTags(data.tags || []);
      setShowSnippet(false);
    }
  }, [data]);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    };

    if (showTagDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTagDropdown]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedId) return;
    
    try {
      await uploadMutation.mutateAsync(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
  };

  const handleUpdateWorkItem = async () => {
    try {
      await updateMutation.mutateAsync({ status, priority, tags });
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update work item. Please try again.");
    }
  };

  const handleAddTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setShowTagDropdown(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const availableTags = mockTags.filter(tag => !tags.includes(tag));

  const attachments = attachmentsData?.attachments || [];
  const API_BASE = import.meta.env.VITE_API_URL || "";

  if (!selectedId) {
    return (
      <aside className="inbox-panel detail-panel detail-drawer">
        <div style={{ color: "var(--color-white-muted)" }}>
          Select a feedback item to see details.
        </div>
      </aside>
    );
  }

  if (isLoading || !data) {
    return (
      <aside className="inbox-panel detail-panel detail-drawer open">
        <Skeleton style={{ height: 24, marginBottom: 12 }} />
        <Skeleton style={{ height: 16, marginBottom: 8 }} />
        <Skeleton style={{ height: 120, marginBottom: 12 }} />
        <Skeleton style={{ height: 80 }} />
      </aside>
    );
  }

  const showThread = data.sourceType === "DISCORD" || data.sourceType === "EMAIL";
  const threadMessages = [
    { author: data.authorName, text: data.snippet },
    { author: "Support Agent", text: "Thanks for the detail. We are investigating." },
    { author: data.authorName, text: data.body.slice(0, 80) + "..." },
  ];

  return (
    <aside className="inbox-panel detail-panel detail-drawer open">
      <div className="detail-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: "var(--color-blue)",
              display: "inline-block",
            }}
          />
          <span style={{ color: "var(--color-white-muted)" }}>{data.sourceLabel}</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{data.title}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 4, padding: "4px", background: "var(--color-gray-900)", borderRadius: 8, border: "1px solid var(--color-gray-800)" }}>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: status === option.value ? option.color : "transparent",
                  color: status === option.value ? option.textColor : "var(--color-white-muted)",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {option.value.replace("_", " ")}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, padding: "4px", background: "var(--color-gray-900)", borderRadius: 8, border: "1px solid var(--color-gray-800)" }}>
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handlePriorityChange(option.value)}
                style={{
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 500,
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  background: priority === option.value ? option.color : "transparent",
                  color: priority === option.value ? option.textColor : "var(--color-white-muted)",
                  transition: "all 0.2s",
                }}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button 
          variant="ghost" 
          onClick={() => setShowSnippet(!showSnippet)}
          style={{ padding: "6px 12px", fontSize: 14, width: "100%" }}
        >
          {showSnippet ? "Hide AI Summary" : "AI Summary"}
        </Button>
        {showSnippet && (
          <div style={{ marginTop: 8, padding: "16px", background: "var(--color-tertiary-dark)", borderRadius: 8, lineHeight: 1.6 }}>
            {isLoadingSummary ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Skeleton style={{ height: 16, width: "100%" }} />
              </div>
            ) : summaryData?.summary ? (
              <>
                <div style={{ fontSize: 13, color: "var(--color-blue)", marginBottom: 8, fontWeight: 500 }}>
                  AI-Generated Summary
                </div>
                <div>{summaryData.summary}</div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--color-gray-800)" }}>
                  <div style={{ fontSize: 11, color: "var(--color-white-muted)", marginBottom: 4 }}>
                    Original Snippet:
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-white-muted)" }}>
                    {data.snippet}
                  </div>
                </div>
              </>
            ) : (
              <div>{data.snippet}</div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ color: "var(--color-white-muted)", marginBottom: 6 }}>Body</div>
        <div>{data.body}</div>
      </div>

      {showThread && (
        <div style={{ marginTop: 16 }}>
          <div style={{ color: "var(--color-white-muted)", marginBottom: 6 }}>Thread</div>
          <div style={{ display: "grid", gap: 8 }}>
            {threadMessages.map((message, index) => (
              <div key={index} className="detail-meta__card">
                <div style={{ fontSize: 12, color: "var(--color-white-muted)" }}>
                  {message.author}
                </div>
                <div>{message.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="detail-meta">
        <div className="detail-meta__card">
          <div style={{ color: "var(--color-white-muted)", marginBottom: 6 }}>Tags</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  background: "var(--color-gray-900)",
                  borderRadius: 6,
                  fontSize: 12,
                  border: "1px solid var(--color-gray-800)",
                }}
              >
                <span style={{ textTransform: "none" }}>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-white-muted)",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                  title="Remove tag"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div style={{ position: "relative" }} ref={tagDropdownRef}>
            <Button
              variant="ghost"
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              style={{ fontSize: 12, padding: "6px 12px" }}
            >
              + Add Tag
            </Button>
            {showTagDropdown && availableTags.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 4,
                  background: "#1a1a1a",
                  border: "1px solid var(--color-gray-800)",
                  borderRadius: 8,
                  padding: 8,
                  maxHeight: 200,
                  overflowY: "auto",
                  zIndex: 9999,
                  minWidth: 160,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.8)",
                }}
              >
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "6px 8px",
                      background: "transparent",
                      border: "none",
                      color: "var(--color-white)",
                      cursor: "pointer",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-gray-800)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="detail-meta__card">
          <div style={{ color: "var(--color-white-muted)", marginBottom: 6 }}>
            Linked Work Items
          </div>
          {isLoadingAttachments ? (
            <Skeleton style={{ height: 60, marginBottom: 8 }} />
          ) : attachments.length > 0 ? (
            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: 8,
                    background: "var(--color-gray-900)",
                    borderRadius: 6,
                    border: "1px solid var(--color-gray-800)",
                  }}
                >
                  <img
                    src={`${API_BASE}/api/attachments/${attachment.id}`}
                    alt={attachment.filename}
                    onClick={() => setEnlargedImage(`${API_BASE}/api/attachments/${attachment.id}`)}
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {attachment.filename}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-white-muted)" }}>
                      {(attachment.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button
                    onClick={() => setEnlargedImage(`${API_BASE}/api/attachments/${attachment.id}`)}
                    style={{
                      fontSize: 11,
                      color: "var(--color-blue)",
                      textDecoration: "none",
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: "var(--color-gray-800)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 12, marginBottom: 12 }}>No attachments yet.</div>
          )}
          <div style={{ display: "grid", gap: 8 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                padding: "6px 8px",
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid var(--color-gray-800)",
                background: "var(--color-gray-900)",
                color: "var(--color-white)",
              }}
            />
            {selectedFile && (
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                style={{ fontSize: 12, padding: "6px 12px" }}
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="detail-actions">
        <Button 
          variant="primary" 
          onClick={handleUpdateWorkItem}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Updating..." : "Edit Work Item"}
        </Button>
      </div>

      {enlargedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
          onClick={() => setEnlargedImage(null)}
        >
          <img
            src={enlargedImage}
            alt="Enlarged view"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setEnlargedImage(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              fontSize: 24,
              width: 40,
              height: 40,
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      )}
    </aside>
  );
};
