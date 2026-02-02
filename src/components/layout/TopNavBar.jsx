import { NavLink } from "react-router-dom";
import { clsx } from "../../utils/clsx";
import logo from "../../assets/logo.svg";
import { Button } from "../ui/Button";
import { useIndexAllFeedbackMutation } from "../../queries/aiQueries";

export const TopNavBar = ({ onAISearchClick }) => {
  const indexAllMutation = useIndexAllFeedbackMutation();

  const handleIndexAll = async () => {
    if (confirm("Index all feedback for AI search? This may take a moment.")) {
      try {
        await indexAllMutation.mutateAsync();
        alert("Successfully indexed all feedback!");
      } catch (error) {
        alert("Already Indexed on current database");
      }
    }
  };

  return (
    <header className="top-nav">
      <div className="top-nav__brand">
        <img src={logo} alt="Feedback Tracker logo" />
        <span>Feedback Tracker</span>
      </div>

      <nav className="top-nav__tabs">
        <NavLink
          className={({ isActive }) => clsx("top-nav__link", isActive && "active")}
          to="/inbox"
        >
          <span>Inbox</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx("top-nav__link", isActive && "active")}
          to="/sources/support"
        >
          <span>Sources</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx("top-nav__link", isActive && "active")}
          to="/analytics"
        >
          <span>Analytics</span>
        </NavLink>
        <NavLink
          className={({ isActive }) => clsx("top-nav__link", isActive && "active")}
          to="/settings"
        >
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="top-nav__actions">
        <div className="top-nav__search">
          <Button
            variant="primary"
            onClick={onAISearchClick}
            style={{ fontSize: 13, padding: "6px 12px", width: "100%" }}
          >
            AI Search
          </Button>
        </div>
        <Button
          variant="ghost"
          onClick={handleIndexAll}
          disabled={indexAllMutation.isPending}
          style={{ fontSize: 13, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          {indexAllMutation.isPending ? "Indexing..." : "Index All"}
        </Button>
        <div className="top-nav__avatar" aria-label="User menu" />
      </div>
    </header>
  );
};
