import { Pill } from "../../components/ui/Pill";
import { formatRelativeTime } from "../../utils/formatDate";

export const SourceCell = ({ item }) => (
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
    <span>{item.sourceLabel}</span>
  </div>
);

export const TitleCell = ({ item }) => (
  <div>
    <div style={{ fontWeight: 600 }}>{item.title}</div>
    <div style={{ color: "var(--color-white-muted)", fontSize: 12 }}>{item.snippet}</div>
  </div>
);

export const PillCell = ({ value }) => <Pill value={value} />;

export const SentimentCell = ({ value }) => {
  const color =
    value === "POSITIVE" ? "#6fcf97" : value === "NEGATIVE" ? "#ff6b6b" : "#b6b6b6";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 12 }}>{value.toLowerCase()}</span>
    </div>
  );
};

export const CreatedCell = ({ value }) => (
  <span style={{ color: "var(--color-white-muted)" }}>{formatRelativeTime(value)}</span>
);

export const TagsCell = ({ value }) => {
  if (!value?.length) return <span style={{ color: "var(--color-white-muted)" }}>—</span>;
  const visible = value.slice(0, 2);
  const extra = value.length - visible.length;
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {visible.map((tag) => (
        <span
          key={tag}
          style={{
            padding: "2px 6px",
            borderRadius: 999,
            background: "var(--color-tertiary-dark)",
            fontSize: 11,
          }}
        >
          {tag}
        </span>
      ))}
      {extra > 0 && (
        <span style={{ fontSize: 11, color: "var(--color-white-muted)" }}>+{extra}</span>
      )}
    </div>
  );
};
