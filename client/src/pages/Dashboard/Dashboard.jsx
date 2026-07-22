import { useEffect, useState } from "react";
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
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700, color: "#fff" }}>
            Discover Projects
          </h1>
          <p style={{ color: "#888", marginTop: "4px" }}>
            Explore and join active student teams
          </p>
        </div>
        <button onClick={() => navigate("/create-project")} className="ide-btn primary">
          <span className="material-symbols-outlined">add_circle</span>
          New Project
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <span className="indicator-light" style={{ width: "20px", height: "20px" }}></span>
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
          <p style={{ marginTop: "16px", color: "#888" }}>No projects available yet.</p>
        </div>
      ) : (
        <div className="ide-grid">
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

              <p style={{ color: "#ccc", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "16px", flexGrow: 1 }}>
                {p.description}
              </p>

              <div className="terminal-skills">
                {p.requiredSkill.map((skill, index) => (
                  <span key={index} className="terminal-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '6px' }}>
                  <span>Team Fill Rate</span>
                  <span>{p.members.length} / {p.teamsize}</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#2a2a35', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${(p.members.length / p.teamsize) * 100}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }}></div>
                </div>
              </div>

              <div className="terminal-footer" style={{ marginTop: '20px' }}>
                <div className="terminal-members">
                  <button onClick={() => joinRequest(p)} className="terminal-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>group_add</span>
                    Join Team
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => viewProjectDetails(p._id)} className="terminal-btn" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                    View
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
