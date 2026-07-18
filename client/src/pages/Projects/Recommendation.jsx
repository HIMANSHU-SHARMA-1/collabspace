import React, { useEffect, useState } from "react";
import api from "../../api/axios";
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
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
              AI Recommendations
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              Project suggestions custom matched to your skills
            </p>
          </div>
          <button onClick={recommendProjects} className="terminal-btn" style={{ color: "#38bdf8", borderColor: "#38bdf8" }} disabled={loading}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", marginRight: "4px" }}>refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <span className="indicator-light" style={{ width: "20px", height: "20px" }}></span>
          </div>
        ) : error ? (
          <div className="terminal-card" style={{ textAlign: "center", color: "#ff5f56" }}>
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="terminal-card" style={{ textAlign: "center", padding: "60px 0" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#888" }}>
              psychology
            </span>
            <p style={{ marginTop: "16px", color: "#888" }}>
              No custom recommendations available right now. Make sure your profile has skills.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {projects.map((proj, index) => (
              <div key={index} className="terminal-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>
                    {proj.projectName}
                  </h3>
                  <div
                    className="terminal-skill-tag"
                    style={{
                      fontWeight: 700,
                      color: "#34d399",
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
                    borderTop: "1px solid #2a2a35",
                    paddingTop: "20px",
                  }}
                >
                  {/* Left Column: Team stats */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "#888" }}>Team Size:</span>
                      <span style={{ fontWeight: 600 }}>{proj["Team Size"]}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                      <span style={{ color: "#888" }}>Current Members:</span>
                      <span style={{ fontWeight: 600 }}>{proj["Current Members"]}</span>
                    </div>
                  </div>

                  {/* Right Column: AI Reason */}
                  <div>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#888", marginBottom: "6px" }}>
                      Why this project matches:
                    </h4>
                    <p style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "#c9d1d9" }}>
                      {proj.reason || proj.Reason || "No specific reason provided."}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", justify: "flex-end", borderTop: "1px solid #2a2a35", paddingTop: "16px", marginTop: "8px" }}>
                  <button onClick={viewHandle} className="terminal-btn" style={{ color: "#34d399", borderColor: "#34d399" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", marginRight: "4px" }}>explore</span>
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Recommendation;