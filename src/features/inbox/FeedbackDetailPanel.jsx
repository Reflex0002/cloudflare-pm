import { Button } from "../../components/ui/Button";
import { Dropdown } from "../../components/ui/Dropdown";
import { Pill } from "../../components/ui/Pill";
import { Skeleton } from "../../components/ui/Skeleton";
import { useFeedbackItemByIdQuery } from "../../queries/feedbackQueries";

const statusOptions = ["NEW", "TRIAGED", "IN_PROGRESS", "CLOSED"];
const priorityOptions = ["P0", "P1", "P2", "P3"];

export const FeedbackDetailPanel = ({ selectedId }) => {
  const { data, isLoading } = useFeedbackItemByIdQuery(selectedId);

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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Dropdown defaultValue={data.status}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Dropdown>
          <Dropdown defaultValue={data.priority}>
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Dropdown>
          <Button variant="ghost">Assign owner</Button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ color: "var(--color-white-muted)", marginBottom: 6 }}>Snippet</div>
        <div>{data.snippet}</div>
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
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {data.tags.map((tag) => (
              <Pill key={tag} value={tag} style={{ textTransform: "none" }} />
            ))}
          </div>
        </div>
        <div className="detail-meta__card">
          <div style={{ color: "var(--color-white-muted)", marginBottom: 6 }}>Related items</div>
          <div style={{ fontSize: 12 }}>None linked yet.</div>
        </div>
        <div className="detail-meta__card">
          <div style={{ color: "var(--color-white-muted)", marginBottom: 6 }}>
            Linked work items
          </div>
          <div style={{ fontSize: 12, marginBottom: 8 }}>No work items created.</div>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ color: "var(--color-white-muted)", fontSize: 12 }}>
              Upload image
            </span>
            <input type="file" accept="image/*" />
          </label>
        </div>
      </div>

      <div className="detail-actions">
        <Button variant="primary">Create Work Item</Button>
        <Button variant="secondary">Mark Duplicate</Button>
        <Button variant="ghost">Request More Info</Button>
      </div>
    </aside>
  );
};
