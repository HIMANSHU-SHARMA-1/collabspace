import { useEffect, useState } from "react";
import api from "../../api/axios";
import Chat from "../chat/Chat";
import { Rnd } from "react-rnd";
import WorkspaceCanvas from "../../components/Workspace/WorkspaceCanvas";

const JoinedProjects = () => {
  const [openChat, setopenChat] = useState(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getJoinedProjects = async () => {
    try {
      setLoading(true);
      const getProjects = await api.get("/api/project/joinedProjects");
      setProjects(getProjects.data.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Projects fetching failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    getJoinedProjects();
  }, []);

  return (
    <>
      <div>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
            Joined Projects
          </h1>
          <p style={{ color: "#888", marginTop: "4px" }}>
            View teams you are currently collaborating with
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "80px 0" }}>
            <span className="indicator-light" style={{ width: "20px", height: "20px", background: "#bd93f9", boxShadow: "0 0 10px #bd93f9" }}></span>
            <div style={{ color: "#bd93f9", fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>Fetching data...</div>
          </div>
        ) : error ? (
          <div className="terminal-card" style={{ textAlign: "center", color: "#ff5f56" }}>
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="terminal-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="chat-header-handle" style={{ background: "#0B0B0F", padding: "12px 20px", display: "flex", gap: "16px", borderBottom: "1px solid #2a2a35", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <div className="mac-dot red"></div>
                <div className="mac-dot yellow"></div>
                <div className="mac-dot green"></div>
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Fira Code', monospace", display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#38bdf8" }}>terminal</span>
                <span>workspace_status.exe</span>
              </div>
            </div>
            <div style={{ padding: "40px", fontFamily: "'Fira Code', monospace", background: "#0a0a0c" }}>
              <div style={{ color: "#f87171", fontWeight: 700, fontSize: "0.95rem", marginBottom: "12px" }}>
                &gt; ERROR 404: NO_JOINED_PROJECTS_FOUND
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.6 }}>
                You are currently not collaborating on any active projects.<br />
                Run <span style={{ color: "#38bdf8" }}>Discover Projects</span> in the Dashboard to find active teams, or execute <span style={{ color: "#34d399" }}>Create Project</span> to initiate your own workspace.
              </div>
              <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
                <span style={{ color: "#38bdf8", fontWeight: 700 }}>$</span>
                <span className="cursor-blink" style={{ width: "8px", height: "16px", background: "#c9d1d9", display: "inline-block" }}></span>
              </div>
            </div>
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
                  <div className="terminal-members">
                    Led by: {project.leader.username}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setIsWorkspaceOpen(project)} className="terminal-btn" style={{ borderColor: "#a855f7", color: "#a855f7" }}>
                      Workspace
                    </button>
                    <button onClick={() => setopenChat(project._id)} className="terminal-btn">
                      Open Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat modal overlay */}
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
            bounds="window"
            dragHandleClassName="chat-header-handle"
            style={{ zIndex: 2000 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: "#0B0B0F",
                borderRadius: "8px",
                border: "1px solid #2a2a35",
                boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                overflow: "hidden"
              }}
            >
              <div
                className="chat-header-handle"
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #2a2a35",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#0B0B0F",
                  cursor: "grab",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <h4 style={{ fontFamily: "'Fira Code', monospace", color: "#38bdf8", fontWeight: 700, margin: 0 }}>&gt; Team Chat</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setopenChat(null);
                  }}
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

export default JoinedProjects;