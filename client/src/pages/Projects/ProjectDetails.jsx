import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../../components/Navbar/Nav";
import WorkspaceCanvas from "../../components/Workspace/WorkspaceCanvas";

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState({});
  const [error, setError] = useState("");
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [formData, setFormData] = useState({
    projectname: "",
    description: "",
    requiredSkill: [],
    teamsize: "",
    githubLink: "",
    status: "open",
  });

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectDetails = await api.get(`/api/project/By/${projectId}`);
      setProject(projectDetails.data.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Project Details Fetching failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const startEditing = () => {
    setFormData({
      projectname: project.projectname || "",
      description: project.description || "",
      requiredSkill: project.requiredSkill || [],
      teamsize: project.teamsize || "",
      githubLink: project.githubLink || "",
      status: project.status || "open",
    });
    setIsEditing(true);
  };

  const addData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    if (!skillName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      requiredSkill: [...prev.requiredSkill, skillName.trim()],
    }));
    setSkillName("");
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkill: prev.requiredSkill.filter((skill, i) => i !== indexToRemove),
    }));
  };

  const editDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/project/update/${projectId}`, formData);
      setProject(response.data.data);
      fetchProjectDetails();
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.response || "Project update failed");
    }
  };

  const removeMember = async (memberId) => {
    try {
      const response = await api.delete(`/api/project/removeMember/${projectId}/${memberId}`);
      setProject(response.data.data);
      alert(`Member removed successfully`);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to remove member");
    }
  };

  const deleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      setLoading(true);
      await api.delete(`/api/project/delete/${projectId}`);
      alert("Project Deleted Successfully");
      navigate("/my-project");
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.response || "Project deletion failed");
      setLoading(false);
    }
  };

  const isLeader = project.leader?._id === user.id;

  return (
    <Nav>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
              {isEditing ? "Edit Project" : project.projectname}
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              {isEditing ? "Update your project configurations" : `Project ID: ${projectId}`}
            </p>
          </div>
          {!isEditing && isLeader && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setIsWorkspaceOpen(true)} className="ceramic-btn" style={{ borderColor: "var(--accent-secondary)", color: "var(--accent-secondary)" }}>
                <span className="material-symbols-outlined">account_tree</span>
                Visual Workspace
              </button>
              <button onClick={startEditing} className="ceramic-btn">
                <span className="material-symbols-outlined">edit</span>
                Edit Specs
              </button>
              <button onClick={deleteProject} className="ceramic-btn" style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                <span className="material-symbols-outlined">delete</span>
                Delete
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <span className="indicator-light"></span>
          </div>
        ) : error ? (
          <div className="ceramic-card" style={{ textAlign: "center", color: "var(--danger)" }}>
            <p>{error}</p>
          </div>
        ) : isEditing ? (
          <div className="ceramic-card" style={{ padding: "40px" }}>
            <form onSubmit={editDetails} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="ceramic-input-group">
                <label htmlFor="projectname">Project Name</label>
                <input
                  id="projectname"
                  type="text"
                  name="projectname"
                  value={formData.projectname}
                  onChange={addData}
                  required
                  className="ceramic-input"
                />
              </div>

              <div className="ceramic-input-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={addData}
                  required
                  className="ceramic-input"
                  style={{ minHeight: "100px", resize: "vertical" }}
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
                      onChange={(e) => setSkillName(e.target.value)}
                      placeholder="e.g. React"
                      className="ceramic-input"
                      style={{ flexGrow: 1 }}
                    />
                    <button type="button" onClick={handleAddSkill} className="ceramic-btn">
                      Add
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {formData.requiredSkill.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(index)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="responsive-grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="ceramic-input-group">
                  <label htmlFor="teamsize">Target Team Size</label>
                  <input
                    id="teamsize"
                    type="number"
                    name="teamsize"
                    value={formData.teamsize}
                    onChange={addData}
                    required
                    className="ceramic-input"
                  />
                </div>

                <div className="ceramic-input-group">
                  <label htmlFor="status">Project Status</label>
                  <select id="status" name="status" value={formData.status} onChange={addData} className="ceramic-input" style={{ appearance: "none" }}>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="ceramic-input-group">
                <label htmlFor="githubLink">Github Repository Link</label>
                <input
                  id="githubLink"
                  type="text"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={addData}
                  className="ceramic-input"
                />
              </div>

              <div style={{ display: "flex", justify: "flex-end", gap: "16px", marginTop: "12px" }}>
                <button type="button" onClick={() => setIsEditing(false)} className="ceramic-btn">
                  Cancel
                </button>
                <button type="submit" className="ceramic-btn primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="skill-tag" style={{ background: "var(--accent-glow)", color: "var(--accent-primary)", fontWeight: 700 }}>
                  STATUS: {project.status?.toUpperCase()}
                </span>
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="ceramic-btn" style={{ textDecoration: "none" }}>
                    <span className="material-symbols-outlined">code</span>
                    GitHub Repo
                  </a>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
                  Project Description
                </h3>
                <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
                  {project.description}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "12px" }}>
                  Required Stack
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {project.requiredSkill?.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="responsive-grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Leader info */}
              <div className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.15rem", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                  Project Leader
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--tag-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--accent-primary)" }}>
                    {project.leader?.username[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600 }}>{project.leader?.username}</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{project.leader?.email}</p>
                  </div>
                </div>
              </div>

              {/* Members management */}
              <div className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.15rem", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                  Team Members ({project.members?.length} / {project.teamsize})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {project.members?.length === 0 ? (
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                      No members have joined yet.
                    </p>
                  ) : (
                    project.members?.map((m) => (
                      <div key={m._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--tag-bg)", borderRadius: "12px" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{m.username}</span>
                        {isLeader && (
                          <button onClick={() => removeMember(m._id)} className="ceramic-btn" style={{ padding: "4px 8px", borderRadius: "8px", fontSize: "0.75rem", color: "var(--danger)", borderColor: "var(--danger)" }}>
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isWorkspaceOpen && <WorkspaceCanvas project={project} onClose={() => setIsWorkspaceOpen(false)} />}
    </Nav>
  );
};

export default ProjectDetails;