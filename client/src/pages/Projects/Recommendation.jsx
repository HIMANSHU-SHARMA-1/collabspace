import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Nav from "../../components/Navbar/Nav";
import { useNavigate } from "react-router-dom";

const Recommendation = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const recommendProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const recomProjects = await api.get("/api/openAi/recommend-projects");
      setProjects(recomProjects.data.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Projects Recommendation fetching failed");
      setLoading(false);
    }
  };

  const viewHandle = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    recommendProjects();
  }, []);

  return (
    <Nav>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
              AI Recommendations
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              Project suggestions custom matched to your skills
            </p>
          </div>
          <button onClick={recommendProjects} className="ceramic-btn" disabled={loading}>
            <span className="material-symbols-outlined">refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <span className="indicator-light" style={{ width: "20px", height: "20px" }}></span>
          </div>
        ) : error ? (
          <div className="ceramic-card" style={{ textAlign: "center", color: "var(--danger)" }}>
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="ceramic-card" style={{ textAlign: "center", padding: "60px 0" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--text-secondary)" }}>
              psychology
            </span>
            <p style={{ marginTop: "16px", color: "var(--text-secondary)" }}>
              No custom recommendations available right now. Make sure your profile has skills.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {projects.map((proj, index) => (
              <div key={index} className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>
                    {proj.projectName}
                  </h3>
                  <div
                    style={{
                      background: "var(--tag-bg)",
                      padding: "8px 16px",
                      borderRadius: "16px",
                      fontWeight: 700,
                      color: "var(--accent-primary)",
                      boxShadow: "var(--shadow-inset)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Match: {proj.score}%
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "24px",
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: "20px",
                  }}
                >
                  {/* Left Column: Team stats */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Team Size:</span>
                      <span style={{ fontWeight: 600 }}>{proj["Team Size"]}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Current Members:</span>
                      <span style={{ fontWeight: 600 }}>{proj["Current Members"]}</span>
                    </div>
                  </div>

                  {/* Right Column: AI Reason */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Why this project matches:
                    </h4>
                    <p style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "var(--text-primary)" }}>
                      {proj.reason}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justify: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "8px" }}>
                  <button onClick={viewHandle} className="ceramic-btn primary">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>explore</span>
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Nav>
  );
};

export default Recommendation;