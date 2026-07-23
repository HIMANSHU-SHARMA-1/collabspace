import { useEffect, useState } from "react";
import api from "../../api/axios";
import Chat from "../chat/Chat";
import { Rnd } from "react-rnd";
import WorkspaceCanvas from "../../components/Workspace/WorkspaceCanvas";

const MyProject = () => {
  const [openChat, setopenChat] = useState(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(null);
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
          <p style={{ color: "#888", marginTop: "4px" }}>
            Manage projects you created and review applications
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "80px 0" }}>
            <span className="indicator-light" style={{ width: "20px", height: "20px", background: "#bd93f9", boxShadow: "0 0 10px #bd93f9" }}></span>
            <div style={{ color: "#bd93f9", fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>Fetching data...</div>
          </div>
        ) : error ? (
          <div className="ide-card" style={{ textAlign: "center", color: "#f87171" }}>
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="ide-card" style={{ textAlign: "center", padding: "60px 0" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#888" }}>
              folder_open
            </span>
            <p style={{ marginTop: "16px", color: "#888" }}>You have not created any projects yet.</p>
          </div>
        ) : (
          <div className="ide-grid">
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
                  <div className="terminal-members" style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setopenChat(project._id)} className="terminal-btn" style={{ borderColor: '#888', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>forum</span>
                      Chat
                    </button>
                    <button onClick={() => setIsWorkspaceOpen(project)} className="terminal-btn" style={{ borderColor: "#38bdf8", color: "#38bdf8", display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>account_tree</span>
                      Workspace
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
                  <div className="ide-card" style={{ boxShadow: "var(--shadow-inset)", padding: "20px", marginTop: "12px" }}>
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
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#888" }}>
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

        {openChat && (
          <Rnd
            default={{
              x: (window.innerWidth - Math.min(400, window.innerWidth - 20)) / 2,
              y: (window.innerHeight - Math.min(500, window.innerHeight - 20)) / 2,
              width: Math.min(400, window.innerWidth - 20),
              height: Math.min(500, window.innerHeight - 20)
            }}
            minWidth={280}
            minHeight={300}
            cancel=".cancel-drag"
            dragHandleClassName="chat-header-handle"
            enableResizing={{ top: true, right: true, bottom: true, left: true, topRight: true, bottomRight: true, bottomLeft: true, topLeft: true }}
            style={{ zIndex: 2000, position: "fixed" }}
          >
            <div className="ide-card chat-modal-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
              <div
                className="chat-header-handle"
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #1a1a24",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--tag-bg)",
                  cursor: "grab"
                }}
              >
                <h4 style={{ fontWeight: 700, margin: 0 }}>Team Chat</h4>
                <button
                  className="cancel-drag"
                  onClick={(e) => {
                    e.stopPropagation();
                    setopenChat(null);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "#888", zIndex: 10 }}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div style={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
                <Chat projectId={openChat} members={projects.find((p) => p._id === openChat)?.members} />
              </div>
              {/* Resize Handle Indicator */}
              <div style={{ position: "absolute", bottom: "2px", right: "2px", pointerEvents: "none", color: "#888", zIndex: 100 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0L0 12H12V0Z" fill="currentColor" opacity="0.2"/>
                  <path d="M12 4L4 12H12V4Z" fill="currentColor" opacity="0.4"/>
                  <path d="M12 8L8 12H12V8Z" fill="currentColor" opacity="0.6"/>
                </svg>
              </div>
            </div>
          </Rnd>
        )}
        {isWorkspaceOpen && <WorkspaceCanvas project={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(null)} />}
      </div>
    </>
  );
};

export default MyProject;