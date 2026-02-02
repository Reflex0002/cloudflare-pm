import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useSearchParams, useNavigate } from "react-router-dom";
import "./components/ui/ui.css";
import "./components/layout/layout.css";
import { AppShell } from "./components/layout/AppShell";
import { InboxPage } from "./features/inbox/InboxPage";
import { SourcesPage } from "./features/sources/SourcesPage";
import { AnalyticsPage } from "./features/analytics/AnalyticsPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { AISearchModal } from "./components/ui/AISearchModal";

function AppContent() {
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelectFeedback = (id) => {
    navigate("/inbox");
    setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams);
      if (id) {
        nextParams.set("selected", id);
      } else {
        nextParams.delete("selected");
      }
      setSearchParams(nextParams);
    }, 0);
  };

  return (
    <>
      <AppShell onAISearchClick={() => setIsAISearchOpen(true)}>
        <Routes>
          <Route path="/" element={<Navigate to="/inbox" replace />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/sources/:source" element={<SourcesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
      
      <AISearchModal
        isOpen={isAISearchOpen}
        onClose={() => setIsAISearchOpen(false)}
        onSelectFeedback={handleSelectFeedback}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
