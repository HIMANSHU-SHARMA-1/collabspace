import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Chat from "../chat/Chat";


const MyProject = () => {
  const [openChat, setopenChat] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState({});

  const myProjects = async () => {
    setLoading(true);
    try {
      const myProjectData = await api.get("/api/project/myProjects");
      setProjects(myProjectData.data.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Project fetching failed");
      setLoading(false);
    }
  };

  const fetchRequests = async (ProjectId) => {
    try {
      const requestData = await api.get(`/api/joinRequest/all/${ProjectId}`);
      if (requestData.data.data.length === 0) {
        return alert("No pending requests found for this project.");
      }
      setRequests((prev) => ({ ...prev, [ProjectId]: requestData.data.data }));
    } catch (err) {
      setError(err?.response?.message || err.message || "Request fetching failed");
    }
  };

  const handleApprove = async (requestee, ProjectId) => {
    try {
      await api.put(`/api/joinRequest/approve/${requestee}`);
      fetchRequests(ProjectId);
      // Refresh project list to reflect member count increase
      myProjects();
    } catch (err) {
      setError(err?.response?.message || err.message || "Request approval failed");
    }
  };

  const handleReject = async (requestee, ProjectId) => {
    try {
      await api.put(`/api/joinRequest/reject/${requestee}`);
      fetchRequests(ProjectId);
    } catch (err) {
      setError(err?.response?.message || err.message || "Request rejection failed");
    }
  };

  useEffect(() => {
    myProjects();
  }, []);

  return (
    <>
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
            My Projects
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Manage projects you created and review applications
          </p>
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
              folder_open
            </span>
            <p style={{ marginTop: "16px", color: "var(--text-secondary)" }}>You have not created any projects yet.</p>
          </div>
        ) : (
          <div className="ceramic-grid">
            {projects.map((project, index) => (
              <div key={index} className="terminal-card">
                <div className="terminal-header">
                  <div className="mac-dot red"></div>
                  <div className="mac-dot yellow"></div>
                  <div className="mac-dot green"></div>
                </div>

                <div className="terminal-title-row">
                  <div className="terminal-title">{project.projectname}</div>
                  <div className="terminal-meta">{project.status === 'open' ? 'Active' : project.status}</div>
                </div>

                <div className="terminal-skills">
                  {project.requiredSkill.map((skill, i) => (
                    <span key={i} className="terminal-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Progress/Storage mock indicator */}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '6px' }}>
                    <span>Team Fill Rate</span>
                    <span>{project.members.length} / {project.teamsize}</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#2a2a35', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${(project.members.length / project.teamsize) * 100}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                  </div>
                </div>

                <div className="terminal-footer">
                  <div className="terminal-members">
                    <button onClick={() => setopenChat(project._id)} className="terminal-btn" style={{ borderColor: '#888', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>forum</span>
                      Chat
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => fetchRequests(project._id)} className="terminal-btn">
                      Applications
                    </button>
                  </div>
                </div>

                {/* Applications list */}
                {requests[project._id] && (
                  <div className="ceramic-card" style={{ boxShadow: "var(--shadow-inset)", padding: "20px", marginTop: "12px" }}>
                    <h4 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>
                      Incoming Join Requests
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {requests[project._id].map((req) => (
                        <div
                          key={req._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px",
                            padding: "12px 16px",
                            borderRadius: "4px",
                            background: "#111116",
                            border: "1px solid #2a2a35",
                            opacity: req.status === "pending" ? 1 : 0.6,
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: "1 1 200px" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#38bdf8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              &gt; {req.requestee.username}
                            </span>
                            <span style={{ fontSize: "0.8rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {req.requestee.email}
                            </span>
                          </div>

                          {req.status === "pending" ? (
                            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                              <button
                                onClick={() => handleApprove(req._id, project._id)}
                                className="terminal-btn"
                                style={{ color: "#34d399", borderColor: "#34d399" }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req._id, project._id)}
                                className="terminal-btn"
                                style={{ color: "#ff5f56", borderColor: "#ff5f56" }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                              {req.status.toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Chat modal overlay */}
        {openChat && (
          <Rnd
            default={{
              x: window.innerWidth / 2 - 200,
              y: window.innerHeight / 2 - 250,
              width: 400,
              height: 500,
            }}
            minWidth={300}
            minHeight={400}
            dragHandleClassName="chat-header-handle"
            cancel="button"
            resizeHandleStyles={{
              bottomRight: { width: "40px", height: "40px", right: "0", bottom: "0" }
            }}
            resizeHandleComponent={{
              bottomRight: (
                <div style={{ position: "absolute", right: "4px", bottom: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--text-secondary)", transform: "rotate(45deg)" }}>
                    unfold_more
                  </span>
                </div>
              )
            }}
            style={{ zIndex: 2000, position: "fixed" }}
          >
            <div className="ceramic-card chat-modal-card">
              <div
                className="chat-header-handle"
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border-color)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--tag-bg)",
                }}
              >
                <h4 style={{ fontWeight: 700, margin: 0 }}>Team Chat</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setopenChat(null);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", zIndex: 10 }}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div style={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
                <Chat projectId={openChat} members={projects.find((p) => p._id === openChat)?.members} />
              </div>
            </div>
          </Rnd>
        )}
      </div>
    </>
  );
};

export default MyProject;