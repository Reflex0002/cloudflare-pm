import { Card } from "../../components/ui/Card";
import { mockFeedback } from "../../data/mockFeedback";
import { SourceMixChart } from "./SourceMixChart";
import { TopThemesCard } from "./TopThemesCard";
import "./analytics.css";

const estimateTriageHours = (item) => {
  switch (item.priority) {
    case "P0":
      return 4;
    case "P1":
      return 8;
    case "P2":
      return 16;
    default:
      return 30;
  }
};

export const AnalyticsPage = () => {
  const triagedItems = mockFeedback.filter((item) => item.status !== "NEW");
  const triageHours = triagedItems.map(estimateTriageHours);
  const avgTriage =
    triageHours.length > 0
      ? Math.round(triageHours.reduce((sum, value) => sum + value, 0) / triageHours.length)
      : 0;
  const under24 =
    triageHours.length > 0
      ? Math.round((triageHours.filter((hours) => hours <= 24).length / triageHours.length) * 100)
      : 0;

  return (
    <div className="analytics-layout">
      <Card className="chatbot-panel">
        <strong>Analytics Assistant</strong>
        <div className="chatbot-messages">
          <div className="chatbot-bubble">Ask me about trends or anomalies.</div>
          <div className="chatbot-bubble">Try: "What are the top sources this week?"</div>
        </div>
        <div className="chatbot-input">
          <label style={{ color: "var(--color-white-muted)", fontSize: 12 }}>
            Chat prompt
          </label>
          <input type="text" placeholder="Type your question..." />
        </div>
      </Card>

      <div className="analytics-grid">
        <div className="analytics-stack">
          <TopThemesCard className="analytics-card--compact" />
          <Card className="analytics-card analytics-card--compact">
            <strong>Triage Speed</strong>
            <div className="analytics-kpi">
              <div>
                <div style={{ color: "var(--color-white-muted)" }}>Avg time to triage</div>
                <div className="analytics-kpi__value">{avgTriage}h</div>
              </div>
              <div>
                <div style={{ color: "var(--color-white-muted)" }}>Triaged &lt; 24h</div>
                <div className="analytics-kpi__value">{under24}%</div>
              </div>
            </div>
          </Card>
        </div>
        <SourceMixChart />
      </div>
    </div>
  );
};
