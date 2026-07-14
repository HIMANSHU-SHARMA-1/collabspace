import { useState } from "react";
import { login } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTheme, setTheme } from "../../utils/theme";

const Login = () => {
  const [formData, setformData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setLocalTheme] = useState(getTheme());
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setLocalTheme(nextTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(formData.email, formData.password);
      if (data.success === true) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.data.id,
            name: data.data.username,
            email: data.data.email,
          })
        );
        setUser({
          id: data.data.id,
          name: data.data.username,
          email: data.data.email,
        });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const addData = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="landing-bg-wrapper">
      {/* Floating Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="ceramic-theme-toggle"
        style={{ position: "fixed", top: "30px", right: "30px", zIndex: 10 }}
        title="Toggle theme"
      >
        <span className="material-symbols-outlined">
          {theme === "light" ? "dark_mode" : "light_mode"}
        </span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "48px",
          width: "100%",
          maxWidth: "1150px",
          zIndex: 1,
        }}
        className="login-responsive-grid"
      >
        {/* Left Side: Aim, Objective, Purpose Landing Section */}
        <div
          className="ceramic-card"
          style={{
            padding: "54px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "36px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "40px", color: "var(--accent-primary)" }}
              >
                bubble_chart
              </span>
              <h1
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: "2.4rem",
                  fontWeight: 800,
                  letterSpacing: "-0.8px",
                }}
              >
                collab<span style={{ color: "var(--accent-primary)" }}>.space</span>
              </h1>
            </div>
            <p
              style={{
                fontSize: "1.15rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Connect the brightest minds. Combine the sharpest skills. Launch high-impact projects.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {/* AIM */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-inset)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-primary)",
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>track_changes</span>
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "4px" }}>Our Aim (Ignite)</h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  Turn campus concepts into working code. We empower students to build unstoppable, cross-functional teams in seconds.
                </p>
              </div>
            </div>

            {/* OBJECTIVE */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-inset)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-primary)",
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>insights</span>
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "4px" }}>Our Objective (Align)</h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  Powered by AI, driven by talent. We analyze your stack, gauge your workload, and match you with your missing puzzle pieces.
                </p>
              </div>
            </div>

            {/* PURPOSE */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "16px",
                  boxShadow: "var(--shadow-inset)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-primary)",
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>groups</span>
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "4px" }}>Our Purpose (Execute)</h3>
                <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                  Frictionless team building. Find your leaders, lock in your developers, and jump straight into structured, real-time collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Sign In form card */}
        <div
          className="ceramic-card"
          style={{
            padding: "54px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "1.75rem",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Sign In
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Access your personalized workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="ceramic-input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={addData}
                placeholder="name@college.edu"
                required
                className="ceramic-input"
              />
            </div>

            <div className="ceramic-input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                onChange={addData}
                placeholder="••••••••"
                required
                className="ceramic-input"
              />
            </div>

            {error && (
              <p
                style={{
                  color: "var(--danger)",
                  fontSize: "0.85rem",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ceramic-btn primary"
              style={{ marginTop: "10px" }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              New to CollabSpace?{" "}
              <button
                onClick={() => navigate("/register")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-primary)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create account
              </button>
            </p>

            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", opacity: 0.6 }}>
              © 2026 CollabSpace. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-responsive-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
