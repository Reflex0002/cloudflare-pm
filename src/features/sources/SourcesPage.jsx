import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { Card } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";
import { useFeedbackItemsQuery } from "../../queries/feedbackQueries";
import "../inbox/inbox.css";
import "./sources.css";

const sourceMap = {
  support: { key: "SUPPORT", label: "Support Tickets" },
  discord: { key: "DISCORD", label: "Discord" },
  github: { key: "GITHUB", label: "GitHub Issues" },
  email: { key: "EMAIL", label: "Email" },
  x: { key: "X", label: "X/Twitter" },
  forum: { key: "FORUM", label: "Community Forums" },
};

const SourceFilterBar = ({ sourceKey }) => {
  const filters = {
    SUPPORT: [
      { label: "Queue", options: ["All", "Enterprise", "SMB"] },
      { label: "SLA risk", options: ["All", "High", "Medium", "Low"] },
    ],
    DISCORD: [
      { label: "Server", options: ["All", "Cloudflare Devs", "Customer Hub"] },
      { label: "Channel", options: ["All", "#alerts", "#feedback"] },
    ],
    GITHUB: [
      { label: "Repo", options: ["All", "cloudflare/pm", "cloudflare/edge"] },
      { label: "Label", options: ["All", "bug", "feature", "triage"] },
    ],
    EMAIL: [
      { label: "Mailbox", options: ["All", "support@", "feedback@"] },
      { label: "Domain", options: ["All", "example.com", "startup.io"] },
    ],
    X: [
      { label: "Mentions", options: ["All", "Direct", "Indirect"] },
      { label: "Followers", options: ["All", "500+", "1000+"] },
    ],
    FORUM: [
      { label: "Category", options: ["All", "Performance", "UX"] },
      { label: "Upvotes", options: ["All", "10+", "25+"] },
    ],
  };

  const items = filters[sourceKey] || [];

  return (
    <div className="inbox-panel" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <strong>Source filters</strong>
        {items.map((filter) => (
          <label key={filter.label} style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--color-white-muted)" }}>
              {filter.label}
            </span>
            <Dropdown defaultValue={filter.options[0]}>
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Dropdown>
          </label>
        ))}
      </div>
    </div>
  );
};

export const SourcesPage = () => {
  const { source } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sourceInfo = sourceMap[source] || sourceMap.support;

  useEffect(() => {
    if (searchParams.get("source") === sourceInfo.key) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("source", sourceInfo.key);
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams, sourceInfo.key]);

  const { data } = useFeedbackItemsQuery({ sourceType: sourceInfo.key });
  const items = data?.items ?? [];

  const statusData = useMemo(() => {
    const counts = items.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [items]);

  const priorityData = useMemo(() => {
    const counts = items.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [items]);

  const highlights = items.slice(0, 4);

  return (
    <div>
      <SourceFilterBar sourceKey={sourceInfo.key} />
      <div className="sources-grid">
        <Card className="sources-card">
          <strong>{sourceInfo.label} overview</strong>
          <div className="sources-row">
            <span>Total feedback</span>
            <span>{items.length}</span>
          </div>
          <div className="sources-row">
            <span>Needs triage</span>
            <span>{items.filter((item) => item.status === "NEW").length}</span>
          </div>
          <div className="sources-row">
            <span>High impact</span>
            <span>{items.filter((item) => item.priority === "P0" || item.priority === "P1").length}</span>
          </div>
        </Card>

        <Card className="sources-card">
          <strong>Status breakdown</strong>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fill: "#b6b6b6", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#1d1d1d", border: "1px solid #272727" }}
                  labelStyle={{ color: "#f2f2f2" }}
                  itemStyle={{ color: "#f2f2f2" }}
                  cursor={{ fill: "rgba(130, 182, 255, 0.12)" }}
                />
                <Bar dataKey="value" fill="#82b6ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="sources-card">
          <strong>Priority mix</strong>
          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" tick={{ fill: "#b6b6b6", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#1d1d1d", border: "1px solid #272727" }}
                  labelStyle={{ color: "#f2f2f2" }}
                  itemStyle={{ color: "#f2f2f2" }}
                  cursor={{ fill: "rgba(246, 130, 32, 0.12)" }}
                />
                <Bar dataKey="value" fill="#f68220" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="sources-card">
          <strong>Recent highlights</strong>
          <div style={{ display: "grid", gap: 8 }}>
            {highlights.map((item) => (
              <div key={item.id} className="sources-highlight">
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ color: "var(--color-white-muted)", fontSize: 12 }}>
                  {item.snippet}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
