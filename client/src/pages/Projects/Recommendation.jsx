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
          <div className="terminal-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="chat-header-handle" style={{ background: "#0B0B0F", padding: "12px 20px", display: "flex", gap: "16px", borderBottom: "1px solid #2a2a35", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <div className="mac-dot red"></div>
                <div className="mac-dot yellow"></div>
                <div className="mac-dot green"></div>
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Fira Code', monospace", display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#bd93f9" }}>psychology</span>
                <span>ai_matchmaker.exe --scan</span>
              </div>
            </div>

            <div style={{ padding: "24px", fontFamily: "'Fira Code', monospace", background: "#0a0a0c", minHeight: "500px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#bd93f9", fontWeight: 700, fontSize: "1.2rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>
                    radar
                  </span>
                  <span>&gt;&gt; ACTIVE_SCAN: MATCHING ALGORITHM</span>
                </div>
                <button onClick={recommendProjects} className="terminal-btn" style={{ color: "#bd93f9", borderColor: "#bd93f9", fontWeight: 700 }} disabled={loading}>
                  [ RERUN SCAN ]
                </button>
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "80px 0" }}>
                  <span className="indicator-light" style={{ width: "20px", height: "20px", background: "#bd93f9", boxShadow: "0 0 10px #bd93f9" }}></span>
                  <div style={{ color: "#bd93f9", fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>Running heuristic engine...</div>
                </div>
              ) : error ? (
                <div style={{ padding: "24px", background: "#111116", border: "1px solid #ff5f56", color: "#ff5f56", fontWeight: 700 }}>
                  [CRITICAL ERROR]: {error}
                </div>
              ) : projects.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", border: "1px dashed #2a2a35" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#888" }}>
                    block
                  </span>
                  <p style={{ marginTop: "16px", color: "#888", fontWeight: 600 }}>
                    0 MATCHES FOUND. Verify profile skill metrics.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  {projects.map((proj, index) => {
                    const score = parseInt(proj.score) || 0;
                    const scoreColor = score >= 80 ? "#34d399" : score >= 50 ? "#f1fa8c" : "#ff5f56";
                    return (
                      <div key={index} style={{ background: "#111116", border: `1px solid ${scoreColor}40`, borderRadius: "4px", padding: "20px", position: "relative", overflow: "hidden", boxShadow: `0 4px 20px ${scoreColor}10` }}>
                        {/* Match bar background effect */}
                        <div style={{ position: "absolute", top: 0, left: 0, height: "4px", width: `${score}%`, background: scoreColor, opacity: 0.8 }}></div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "16px" }}>
                          <div>
                            <div style={{ color: "#888", fontSize: "0.8rem", marginBottom: "4px" }}>[ TARGET_PROJECT_{index + 1} ]</div>
                            <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.4rem", fontWeight: 700, margin: 0, color: "#c9d1d9" }}>
                              {proj.projectName}
                            </h3>
                          </div>
                          <div style={{ background: "#0a0a0c", border: `1px solid ${scoreColor}`, color: scoreColor, padding: "8px 16px", borderRadius: "4px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>target</span>
                            MATCH: {score}%
                          </div>
                        </div>

                        <div className="responsive-grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", background: "#0a0a0c", padding: "16px", border: "1px dashed #2a2a35", borderRadius: "4px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderRight: "1px dashed #2a2a35", paddingRight: "16px" }}>
                            <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.85rem", marginBottom: "4px" }}>&gt; METRICS</div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                              <span style={{ color: "#888" }}>TEAM_CAPACITY:</span>
                              <span style={{ color: "#c9d1d9", fontWeight: 700 }}>{proj["Team Size"]}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                              <span style={{ color: "#888" }}>ACTIVE_NODES:</span>
                              <span style={{ color: "#c9d1d9", fontWeight: 700 }}>{proj["Current Members"]}</span>
                            </div>
                          </div>

                          <div>
                            <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.85rem", marginBottom: "8px" }}>&gt; AI_ANALYSIS_LOG:</div>
                            <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "#c9d1d9", margin: 0, fontFamily: "sans-serif" }}>
                              {proj.reason || proj.Reason || "No heuristic provided."}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                          <button onClick={viewHandle} className="terminal-btn" style={{ color: scoreColor, borderColor: scoreColor, fontWeight: 700 }}>
                            [&gt;] INITIATE HANDSHAKE (DASHBOARD)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
    </>
  );
};

export default Recommendation;