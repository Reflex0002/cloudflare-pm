import { ConnectorCard } from "./ConnectorCard";
import "./settings.css";

const connectors = [
  "Support Tickets",
  "Discord",
  "GitHub Issues",
  "Email",
  "X/Twitter",
  "Community Forums",
];

export const SettingsPage = () => (
  <div className="settings-grid">
    {connectors.map((name) => (
      <ConnectorCard key={name} name={name} />
    ))}
  </div>
);
