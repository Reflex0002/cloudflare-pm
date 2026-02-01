import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { useTagCountsQuery } from "../../queries/feedbackQueries";

export const TopThemesCard = ({ className }) => {
  const { data } = useTagCountsQuery();
  const navigate = useNavigate();

  const topTags = useMemo(() => {
    if (!data) return [];
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [data]);

  return (
    <Card className={`analytics-card ${className || ""}`.trim()}>
      <strong>Top Themes</strong>
      <div style={{ display: "grid", gap: 8 }}>
        {topTags.map(([tag, count]) => (
          <button
            key={tag}
            type="button"
            onClick={() => navigate(`/inbox?tag=${tag}`)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--color-tertiary-dark)",
              border: "none",
              borderRadius: 8,
              padding: "6px 10px",
              color: "var(--color-white)",
              cursor: "pointer",
            }}
          >
            <span>{tag}</span>
            <span style={{ color: "var(--color-white-muted)" }}>{count}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};
