import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Nav from "../../components/Navbar/Nav";
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
    <Nav>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {projects.map((project, index) => (
              <div key={index} className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>
                      {project.projectname}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "2px" }}>
                      Created by you • Status: <span style={{ fontWeight: 600, color: "var(--accent-primary)" }}>{project.status.toUpperCase()}</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={() => setopenChat(project._id)} className="ceramic-btn">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>forum</span>
                      Chat Room
                    </button>
                    <button onClick={() => fetchRequests(project._id)} className="ceramic-btn primary">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>group_work</span>
                      Applications
                    </button>
                  </div>
                </div>

                <p style={{ color: "var(--text-primary)", fontSize: "0.92rem", lineHeight: 1.6 }}>
                  {project.description}
                </p>

                {/* Team metrics row */}
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
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "8px" }}>
                      <span>Team Fill Rate</span>
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
                            padding: "12px 18px",
                            borderRadius: "12px",
                            background: "var(--panel-bg)",
                            border: "1px solid var(--border-color)",
                            opacity: req.status === "pending" ? 1 : 0.6,
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: 600 }}>{req.requestee.username}</span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginLeft: "12px" }}>
                              {req.requestee.email}
                            </span>
                          </div>

                          {req.status === "pending" ? (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => handleApprove(req._id, project._id)}
                                className="ceramic-btn"
                                style={{ padding: "6px 12px", borderRadius: "12px", fontSize: "0.8rem", color: "var(--accent-secondary)" }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req._id, project._id)}
                                className="ceramic-btn"
                                style={{ padding: "6px 12px", borderRadius: "12px", fontSize: "0.8rem", color: "var(--danger)" }}
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
          <div className="chat-modal-overlay">
            <div className="ceramic-card chat-modal-card">
              <div
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
                  onClick={() => setopenChat(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div style={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
                <Chat projectId={openChat} members={projects.find((p) => p._id === openChat)?.members} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Nav>
  );
};

export default MyProject;