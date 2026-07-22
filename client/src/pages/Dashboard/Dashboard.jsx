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
            <div key={p._id} className="ide-card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
                  {p.projectname}
                </h3>
                <span className="indicator-light"></span>
              </div>

              <p style={{ color: "#ccc", fontSize: "0.92rem", lineHeight: 1.6, flexGrow: 1 }}>
                {p.description}
              </p>

              <div>
                <h4 style={{ fontSize: "0.8rem", fontWeight: 600, color: "#888", marginBottom: "10px" }}>
                  Required Stack
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {p.requiredSkill.map((skill, index) => (
                    <span key={index} className="skill-tag" style={{ background: '#1a1a24', color: '#ccc', border: '1px solid #2a2a35' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px", borderTop: "1px solid #1a1a24", paddingTop: "16px" }}>
                <button onClick={() => joinRequest(p)} className="ide-btn" style={{ flexGrow: 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>group_add</span>
                  Join Team
                </button>
                <button onClick={() => viewProjectDetails(p._id)} className="ide-btn primary">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>visibility</span>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
