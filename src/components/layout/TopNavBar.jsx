import { NavLink } from "react-router-dom";
import { clsx } from "../../utils/clsx";
import logo from "../../assets/logo.svg";
import { SearchInput } from "../ui/SearchInput";

export const TopNavBar = () => (
  <header className="top-nav">
    <div className="top-nav__brand">
      <img src={logo} alt="Feedback Tracker logo" />
      <span>Feedback Tracker</span>
    </div>

    <nav className="top-nav__tabs">
      <NavLink className={({ isActive }) => clsx("top-nav__link", isActive && "active")} to="/inbox">
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
      <SearchInput placeholder="Search feedback" />
      <div className="top-nav__avatar" aria-label="User menu" />
    </div>
  </header>
);
