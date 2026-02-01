import { TopNavBar } from "./TopNavBar";

export const AppShell = ({ children }) => (
  <div className="app-shell">
    <TopNavBar />
    <main className="app-shell__main">{children}</main>
  </div>
);
