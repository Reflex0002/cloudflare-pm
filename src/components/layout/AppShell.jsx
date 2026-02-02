import { TopNavBar } from "./TopNavBar";

export const AppShell = ({ children, onAISearchClick }) => (
  <div className="app-shell">
    <TopNavBar onAISearchClick={onAISearchClick} />
    <main className="app-shell__main">{children}</main>
  </div>
);
