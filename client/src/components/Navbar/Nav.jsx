import * as Sentry from '@sentry/react'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Notification from "../Notification/Notification";
import { getTheme, setTheme } from "../../utils/theme";

const Nav = ({ children }) => {
  const { user, setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setLocalTheme] = useState(getTheme());

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setLocalTheme(nextTheme);
  };

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "US";

  return (
    <div className="ceramic-dashboard-shell">
      {/* Top Header exactly matching the reference image */}
      <header className="ceramic-shell-header">
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "inherit" }}>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "24px",
              color: "var(--accent-primary)",
              transform: "rotate(-15deg)",
            }}
          >
            bubble_chart
          </span>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            collab<span style={{ color: "var(--accent-primary)" }}>.space</span>
          </h2>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={toggleTheme}
            className="ceramic-theme-toggle"
            title="Toggle theme mode"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>

          <Notification />

          {/* User Initials Avatar matching reference image */}
          <Link
            to="/profile"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-primary)",
              color: "var(--panel-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
              boxShadow: "var(--shadow-outset)",
            }}
            title="View profile settings"
          >
            {initials}
          </Link>
        </div>
      </header>

      {/* Main split layout layout */}
      <div className="ceramic-shell-layout">
        {/* Left-Aligned Sidebar */}
        <aside className="ceramic-sidebar">
          <Link
            to="/dashboard"
            className={`ceramic-sidebar-link ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </Link>

          <Link
            to="/create-project"
            className={`ceramic-sidebar-link ${location.pathname === "/create-project" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create Project
          </Link>

          <Link
            to="/my-project"
            className={`ceramic-sidebar-link ${location.pathname === "/my-project" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">folder</span>
            My Projects
          </Link>

          <Link
            to="/recommend-projects"
            className={`ceramic-sidebar-link ${location.pathname === "/recommend-projects" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">psychology</span>
            Recommendations
          </Link>

          <Link
            to="/joined-projects"
            className={`ceramic-sidebar-link ${location.pathname === "/joined-projects" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">group_work</span>
            Joined Projects
          </Link>

          <Link
            to="/profile"
            className={`ceramic-sidebar-link ${location.pathname === "/profile" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <Link>
          <button onClick={() => { throw new Error('My first Sentry React error!') }}>
  Break the world
</button>
          </Link>

          <button
            onClick={handleLogout}
            className="ceramic-sidebar-link logout-btn"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>

          {/* Copyright system notice */}
          <div
            style={{
              marginTop: "20px",
              padding: "16px 12px 0 12px",
              borderTop: "1px solid var(--border-color)",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              opacity: 0.6,
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            © 2026 CollabSpace.
            <br />
            All rights reserved.
          </div>
        </aside>

        {/* Right main content pane */}
        <main style={{ width: "100%" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Nav;