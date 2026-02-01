import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Dropdown } from "../../components/ui/Dropdown";

const frequencies = ["15 min", "30 min", "1 hour", "6 hours"];

export const ConnectorCard = ({ name }) => {
  const [connected, setConnected] = useState(true);

  return (
    <Card className="settings-card">
      <div className="settings-row">
        <strong>{name}</strong>
        <Button variant={connected ? "primary" : "ghost"} onClick={() => setConnected(!connected)}>
          {connected ? "Connected" : "Disconnected"}
        </Button>
      </div>
      <Button variant="secondary">Test connection</Button>
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ color: "var(--color-white-muted)", fontSize: 12 }}>
          Sync frequency
        </span>
        <Dropdown>
          {frequencies.map((freq) => (
            <option key={freq} value={freq}>
              {freq}
            </option>
          ))}
        </Dropdown>
      </label>
    </Card>
  );
};
