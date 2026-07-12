import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Chat from "../chat/Chat";
import Nav from "../../components/Navbar/Nav";
import { Rnd } from "react-rnd";

const JoinedProjects = () => {
  const [openChat, setopenChat] = useState(null);
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
    <Nav>
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
          <div className="ceramic-card" style={{ textAlign: "center", color: "var(--danger)" }}>
            <p>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="ceramic-card" style={{ textAlign: "center", padding: "60px 0" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--text-secondary)" }}>
              folder_open
            </span>
            <p style={{ marginTop: "16px", color: "var(--text-secondary)" }}>You have not joined any projects yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {projects.map((project, index) => (
              <div key={index} className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justify: "space-between", align: "flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>
                      {project.projectname}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
                      Led by: <span style={{ fontWeight: 600 }}>{project.leader.username}</span> • Status: <span style={{ fontWeight: 600, color: "var(--accent-primary)" }}>{project.status.toUpperCase()}</span>
                    </p>
                  </div>
                  <button onClick={() => setopenChat(project._id)} className="ceramic-btn primary">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>forum</span>
                    Open Chat
                  </button>
                </div>

                <p style={{ color: "var(--text-primary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  {project.description}
                </p>

                {/* Skills tags */}
                <div>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                    Stack
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {project.requiredSkill.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    background: "var(--tag-bg)",
                    padding: "16px 24px",
                    borderRadius: "16px",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", justify: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                      <span>Team Size</span>
                      <span>
                        {project.members.length} / {project.teamsize} Joined
                      </span>
                    </div>
                    <div className="ceramic-progress-track">
                      <div
                        className="ceramic-progress-bar"
                        style={{ width: `${(project.members.length / project.teamsize) * 100}%` }}
                      ></div>
                    </div>
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
              x: window.innerWidth > 900 ? window.innerWidth - 420 : 16,
              y: window.innerHeight > 900 ? window.innerHeight - 520 : window.innerHeight - 520 - 90,
              width: window.innerWidth > 900 ? 400 : window.innerWidth - 32,
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
    </Nav>
  );
};

export default JoinedProjects;