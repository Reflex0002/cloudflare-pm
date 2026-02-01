import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./components/ui/ui.css";
import "./components/layout/layout.css";
import { AppShell } from "./components/layout/AppShell";
import { InboxPage } from "./features/inbox/InboxPage";
import { SourcesPage } from "./features/sources/SourcesPage";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage";
import { SettingsPage } from "./features/settings/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/sources/:source" element={<SourcesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
