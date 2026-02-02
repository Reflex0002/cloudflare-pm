import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { SourceMixChart } from "./SourceMixChart";
import { TopThemesCard } from "./TopThemesCard";
import { useTriageSpeedQuery } from "../../queries/feedbackQueries";
import { useAnalyticsChatMutation } from "../../queries/aiQueries";
import "./analytics.css";

export const AnalyticsPage = () => {
  const { data: triageData } = useTriageSpeedQuery();
  const avgTriage = triageData?.avgHours ?? 0;
  const under24 = triageData?.under24Percent ?? 0;

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me about trends or anomalies." },
    { role: "assistant", text: "Try: \"What are the top sources this week?\"" },
  ]);
  const [input, setInput] = useState("");
  const chatMutation = useAnalyticsChatMutation();

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const response = await chatMutation.mutateAsync(userMessage);
      // Add assistant response
      setMessages((prev) => [...prev, { role: "assistant", text: response.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't process that request." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="analytics-layout">
      <Card className="chatbot-panel">
        <strong>Analytics Assistant</strong>
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className="chatbot-bubble"
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "var(--color-blue)" : "var(--color-gray-800)",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chatbot-input">
          <label style={{ color: "var(--color-white-muted)", fontSize: 12 }}>
            Chat prompt
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chatMutation.isPending}
              style={{ flex: 1 }}
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!input.trim() || chatMutation.isPending}
              style={{ padding: "6px 12px", fontSize: 13 }}
            >
              {chatMutation.isPending ? "..." : "Send"}
            </Button>
          </div>
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
