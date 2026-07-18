import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const navigate = useNavigate();
  const [skillName, setSkillName] = useState("");
  const [formData, setformData] = useState({
    projectname: "",
    description: "",
    requiredSkill: [],
    teamsize: "",
    githubLink: "",
    status: "open",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSkill = (e) => {
    setSkillName(e.target.value);
  };

  const handleAddSkill = () => {
    if (!skillName.trim()) return alert("Skill can't be empty");
    setformData((prev) => ({
      ...prev,
      requiredSkill: [...prev.requiredSkill, skillName.trim()],
    }));
    setSkillName("");
  };

  const addData = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const projectData = await api.post("/api/project/create", formData);
      if (projectData) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Project Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
            Create New Project
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Design your project and recruit teammates
          </p>
        </div>

        <div className="terminal-card" style={{ padding: "40px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="terminal-input-group">
              <label htmlFor="projectname" className="terminal-label">"project_name":</label>
              <input
                id="projectname"
                type="text"
                name="projectname"
                onChange={addData}
                placeholder="e.g. EcoTrack AI"
                required
                className="terminal-input"
              />
            </div>

            <div className="terminal-input-group">
              <label htmlFor="description" className="terminal-label">"description":</label>
              <textarea
                id="description"
                name="description"
                onChange={addData}
                placeholder="Describe your project, milestones, and what you are building..."
                className="terminal-input"
                style={{ minHeight: "100px", resize: "vertical" }}
                required
              />
            </div>

            <div className="terminal-card" style={{ padding: "20px", border: "1px solid #2a2a35", background: "#0B0B0F" }}>
              <div className="terminal-input-group" style={{ marginBottom: "12px" }}>
                <label htmlFor="skillName" className="terminal-label">"required_skills":</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <input
                    id="skillName"
                    type="text"
                    value={skillName}
                    onChange={handleSkill}
                    placeholder="e.g. React, Python"
                    className="terminal-input"
                    style={{ flexGrow: 1 }}
                  />
                  <button type="button" onClick={handleAddSkill} className="terminal-btn">
                    + Add Skill
                  </button>
                </div>
              </div>

              {formData.requiredSkill.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {formData.requiredSkill.map((skill, index) => (
                    <span key={index} className="terminal-skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          setformData((prev) => {
                            const nextSkills = [...prev.requiredSkill];
                            nextSkills.splice(index, 1);
                            return { ...prev, requiredSkill: nextSkills };
                          });
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ff5f56",
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "6px",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="responsive-grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="terminal-input-group">
                <label htmlFor="teamsize" className="terminal-label">"target_team_size":</label>
                <input
                  id="teamsize"
                  type="number"
                  name="teamsize"
                  onChange={addData}
                  placeholder="e.g. 5"
                  required
                  className="terminal-input"
                />
              </div>

              <div className="terminal-input-group">
                <label htmlFor="status" className="terminal-label">"project_status":</label>
                <select id="status" name="status" onChange={addData} className="terminal-input" style={{ appearance: "none" }}>
                  <option value="open">Open (Recruiting)</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="terminal-input-group">
              <label htmlFor="githubLink" className="terminal-label">"github_link":</label>
              <input
                id="githubLink"
                type="text"
                name="githubLink"
                onChange={addData}
                placeholder="https://github.com/your-org/your-repo"
                className="terminal-input"
              />
            </div>

            {error && (
              <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center", fontWeight: 500 }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", justify: "flex-end", gap: "16px", marginTop: "12px" }}>
              <button type="button" onClick={() => navigate("/dashboard")} className="terminal-btn" style={{ color: "#888", borderColor: "#333" }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="terminal-btn" style={{ color: "#34d399", borderColor: "#34d399" }}>
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
