import { clsx } from "../../utils/clsx";

const toneStyles = {
  BUG: { background: "rgba(255, 107, 107, 0.18)", borderColor: "#ff6b6b" },
  FEATURE: { background: "rgba(130, 182, 255, 0.18)", borderColor: "#82b6ff" },
  QUESTION: { background: "rgba(242, 194, 94, 0.18)", borderColor: "#f2c25e" },
  PRAISE: { background: "rgba(111, 207, 151, 0.18)", borderColor: "#6fcf97" },
  NEW: { background: "rgba(130, 182, 255, 0.18)", borderColor: "#82b6ff" },
  TRIAGED: { background: "rgba(242, 194, 94, 0.18)", borderColor: "#f2c25e" },
  IN_PROGRESS: { background: "rgba(246, 130, 32, 0.18)", borderColor: "#f68220" },
  CLOSED: { background: "rgba(182, 182, 182, 0.18)", borderColor: "#b6b6b6" },
  P0: { background: "rgba(255, 107, 107, 0.18)", borderColor: "#ff6b6b" },
  P1: { background: "rgba(246, 130, 32, 0.18)", borderColor: "#f68220" },
  P2: { background: "rgba(242, 194, 94, 0.18)", borderColor: "#f2c25e" },
  P3: { background: "rgba(182, 182, 182, 0.18)", borderColor: "#b6b6b6" },
};

export const Pill = ({ value, className, style }) => (
  <span
    className={clsx("ui-pill", className)}
    style={{ ...toneStyles[value], ...style }}
  >
    {value}
  </span>
);
