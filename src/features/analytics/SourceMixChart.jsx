import { ResponsiveContainer, Pie, PieChart, Cell } from "recharts";
import { Card } from "../../components/ui/Card";
import { useSourceCountsQuery } from "../../queries/feedbackQueries";

const sourceColors = {
  SUPPORT: "#f68220",
  DISCORD: "#82b6ff",
  GITHUB: "#6fcf97",
  EMAIL: "#f2c25e",
  X: "#b6b6b6",
  FORUM: "#ff6b6b",
};

export const SourceMixChart = () => {
  const { data } = useSourceCountsQuery();
  const chartData = data
    ? Object.entries(data).map(([key, value]) => ({ name: key, value }))
    : [];

  return (
    <Card className="analytics-card">
      <strong>Source Mix</strong>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={sourceColors[entry.name]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {chartData.map((entry) => (
          <div
            key={entry.name}
            style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}
          >
            <span>{entry.name}</span>
            <span style={{ color: "var(--color-white-muted)" }}>{entry.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
