import { useState } from "react";
import { NavLink } from "react-router-dom";
import { clsx } from "../../utils/clsx";
import logo from "../../assets/logo.svg";
import { SearchInput } from "../ui/SearchInput";
import { useSearchQuery } from "../../queries/feedbackQueries";

export const TopNavBar = () => {
  const [query, setQuery] = useState("");
  const { data } = useSearchQuery(query.trim());
  const results = data?.items ?? [];

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
          <SearchInput
            placeholder="Search feedback"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query.trim().length > 1 && (
            <div className="top-nav__search-results" role="listbox">
              {results.length ? (
                results.slice(0, 6).map((item) => (
                  <div key={item.id} className="top-nav__search-item" role="option">
                    <div className="top-nav__search-title">{item.title}</div>
                    <div className="top-nav__search-meta">
                      {item.sourceLabel} • {item.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="top-nav__search-empty">No results yet</div>
              )}
            </div>
          )}
        </div>
        <div className="top-nav__avatar" aria-label="User menu" />
      </div>
    </header>
  );
};
