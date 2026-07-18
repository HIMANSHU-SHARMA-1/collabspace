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

        <div className="ceramic-card" style={{ padding: "40px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="ceramic-input-group">
              <label htmlFor="projectname">Project Name</label>
              <input
                id="projectname"
                type="text"
                name="projectname"
                onChange={addData}
                placeholder="e.g. EcoTrack AI"
                required
                className="ceramic-input"
              />
            </div>

            <div className="ceramic-input-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                onChange={addData}
                placeholder="Describe your project, milestones, and what you are building..."
                className="ceramic-input"
                style={{ minHeight: "100px", resize: "vertical" }}
                required
              />
            </div>

            <div className="ceramic-card" style={{ boxShadow: "var(--shadow-inset)", padding: "20px" }}>
              <div className="ceramic-input-group" style={{ marginBottom: "12px" }}>
                <label htmlFor="skillName">Required Skill / Tech Stack</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <input
                    id="skillName"
                    type="text"
                    value={skillName}
                    onChange={handleSkill}
                    placeholder="e.g. React, Python"
                    className="ceramic-input"
                    style={{ flexGrow: 1 }}
                  />
                  <button type="button" onClick={handleAddSkill} className="ceramic-btn">
                    <span className="material-symbols-outlined">add</span>
                    Add
                  </button>
                </div>
              </div>

              {formData.requiredSkill.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {formData.requiredSkill.map((skill, index) => (
                    <span key={index} className="skill-tag">
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
                          color: "var(--danger)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="responsive-grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="ceramic-input-group">
                <label htmlFor="teamsize">Target Team Size</label>
                <input
                  id="teamsize"
                  type="number"
                  name="teamsize"
                  onChange={addData}
                  placeholder="e.g. 5"
                  required
                  className="ceramic-input"
                />
              </div>

              <div className="ceramic-input-group">
                <label htmlFor="status">Project Status</label>
                <select id="status" name="status" onChange={addData} className="ceramic-input" style={{ appearance: "none" }}>
                  <option value="open">Open (Recruiting)</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div className="ceramic-input-group">
              <label htmlFor="githubLink">Github Repository Link (Optional)</label>
              <input
                id="githubLink"
                type="text"
                name="githubLink"
                onChange={addData}
                placeholder="https://github.com/your-org/your-repo"
                className="ceramic-input"
              />
            </div>

            {error && (
              <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center", fontWeight: 500 }}>
                {error}
              </p>
            )}

            <div style={{ display: "flex", justify: "flex-end", gap: "16px", marginTop: "12px" }}>
              <button type="button" onClick={() => navigate("/dashboard")} className="ceramic-btn">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="ceramic-btn primary">
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
