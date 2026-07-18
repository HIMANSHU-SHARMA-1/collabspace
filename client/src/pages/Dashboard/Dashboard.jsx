import * as Sentry from '@sentry/react'

import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const getProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/project/getAll");
      setProjects(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load Projects");
      setLoading(false);
    }
  };

  const joinRequest = async (project) => {
    try {
      if (user.id === project.leader._id) {
        return alert("You are already the leader of the project");
      }
      if (project.members.some((m) => m._id === user.id)) {
        return alert("You are already a member of this project");
      }

      await api.post("/api/joinRequest/send", { projectId: project._id });
      alert("Join request sent successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Already Applied");
    }
  };

  const viewProjectDetails = (projectId) => {
    navigate(`/project-view/${projectId}`);
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
            Discover Projects
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Explore and join active student teams
          </p>
        </div>
        <button onClick={() => navigate("/create-project")} className="ceramic-btn primary">
          <span className="material-symbols-outlined">add_circle</span>
          New Project
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
            folder_open
          </span>
          <p style={{ marginTop: "16px", color: "var(--text-secondary)" }}>No projects available yet.</p>
        </div>
      ) : (
        <div className="ceramic-grid">
          {projects.map((p) => (
            <div key={p._id} className="terminal-card">
              <div className="terminal-header">
                <div className="mac-dot red"></div>
                <div className="mac-dot yellow"></div>
                <div className="mac-dot green"></div>
              </div>

              <div className="terminal-title-row">
                <div className="terminal-title">{p.projectname}</div>
                <div className="terminal-meta">{p.status === 'open' ? 'Active' : p.status}</div>
              </div>

              <div className="terminal-skills">
                {p.requiredSkill.map((skill, index) => (
                  <span key={index} className="terminal-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Progress/Storage mock indicator */}
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '6px' }}>
                  <span>Team Size</span>
                  <span>{p.members.length} / {p.teamsize}</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#2a2a35', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(p.members.length / p.teamsize) * 100}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                </div>
              </div>

              <div className="terminal-footer">
                <div className="terminal-members">
                  Team Members: {p.members.length}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => viewProjectDetails(p._id)} className="terminal-btn" style={{ borderColor: '#888', color: '#888' }}>
                    View
                  </button>
                  <button onClick={() => joinRequest(p)} className="terminal-btn">
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;