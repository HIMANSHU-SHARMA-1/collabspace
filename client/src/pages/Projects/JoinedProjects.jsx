import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Chat from "../chat/Chat";
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
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            View teams you are currently collaborating with
          </p>
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
              folder_open
            </span>
            <p style={{ marginTop: "16px", color: "#888" }}>You have not joined any projects yet.</p>
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
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              height: "500px",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
              background: "#0B0B0F",
              borderRadius: "8px",
              border: "1px solid #2a2a35",
              boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
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
          </div>
        )}

        {isWorkspaceOpen && <WorkspaceCanvas project={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(null)} />}
      </div>
    </>
  );
};

export default JoinedProjects;