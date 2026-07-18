import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillRating, setSkillRating] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    githubProfile: "",
    skills: [],
  });

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/auth/me");
      setProfile(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Profile fetching failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const startEditing = () => {
    setFormData({
      username: profile.username || "",
      bio: profile.bio || "",
      githubProfile: profile.githubProfile || "",
      skills: profile.skills || [],
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
      skills: [...prev.skills, { name: skillName.trim(), rating: Number(skillRating) || 0 }],
    }));
    setSkillName("");
    setSkillRating("");
  };

  const handleRemoveSkill = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== indexToRemove),
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/api/auth/update-profile", formData);
      setProfile(response.data.data);
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Profile update failed");
    }
  };

  return (
    <>
      <div style={{ maxWidth: "750px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>
              My Profile
            </h1>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
              Configure your developer details and portfolio links
            </p>
          </div>
          {!isEditing && (
            <button onClick={startEditing} className="ceramic-btn">
              <span className="material-symbols-outlined">edit</span>
              Edit Profile
            </button>
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
          <div className="terminal-card" style={{ padding: "40px" }}>
            <form onSubmit={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="terminal-input-group">
                <label htmlFor="username" className="terminal-label">"full_name":</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={addData}
                  required
                  className="terminal-input"
                />
              </div>

              <div className="terminal-input-group">
                <label htmlFor="bio" className="terminal-label">"professional_bio":</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={addData}
                  className="terminal-input"
                  style={{ minHeight: "100px", resize: "vertical" }}
                />
              </div>

              <div className="terminal-input-group">
                <label htmlFor="githubProfile" className="terminal-label">"github_profile":</label>
                <input
                  id="githubProfile"
                  type="text"
                  name="githubProfile"
                  value={formData.githubProfile}
                  onChange={addData}
                  className="terminal-input"
                />
              </div>

              <div className="terminal-card" style={{ padding: "20px", border: "1px solid #2a2a35", background: "#0B0B0F" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: "16px", color: "#38bdf8" }}>
                  "manage_developer_skills"
                </h3>
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                  <input
                    type="text"
                    placeholder="Skill e.g. React"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="terminal-input"
                    style={{ flexGrow: 2 }}
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rate 1-5"
                    value={skillRating}
                    onChange={(e) => setSkillRating(e.target.value)}
                    className="terminal-input"
                    style={{ flexGrow: 1 }}
                  />
                  <button type="button" onClick={handleAddSkill} className="terminal-btn" style={{ color: "#34d399", borderColor: "#34d399" }}>
                    + Add
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="terminal-skill-tag" style={{ padding: "6px 12px", borderRadius: "4px" }}>
                      {skill.name} ({skill.rating}/5)
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
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
              </div>

              <div style={{ display: "flex", justify: "flex-end", gap: "16px" }}>
                <button type="button" onClick={() => setIsEditing(false)} className="terminal-btn" style={{ color: "#888", borderColor: "#333" }}>
                  Cancel
                </button>
                <button type="submit" className="terminal-btn" style={{ color: "#34d399", borderColor: "#34d399" }}>
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div className="terminal-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="chat-header-handle" style={{ background: "#0B0B0F", padding: "12px 20px", display: "flex", gap: "16px", borderBottom: "1px solid #2a2a35", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <div className="mac-dot red"></div>
                  <div className="mac-dot yellow"></div>
                  <div className="mac-dot green"></div>
                </div>
                <div style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Fira Code', monospace", display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#f1fa8c" }}>data_object</span>
                  <span>developer_profile.json</span>
                </div>
              </div>

              <div style={{ display: "flex", padding: "24px", fontFamily: "'Fira Code', monospace", fontSize: "0.95rem", lineHeight: 1.7, overflowX: "auto" }}>
                {/* Fake Line Numbers */}
                <div style={{ display: "flex", flexDirection: "column", color: "#444", paddingRight: "24px", userSelect: "none", textAlign: "right" }}>
                  {Array.from({ length: 22 + (profile.skills?.length || 1) }).map((_, i) => <span key={i}>{i + 1}</span>)}
                </div>

                {/* JSON Content */}
                <div style={{ color: "#c9d1d9", width: "100%", minWidth: "500px" }}>
                  <span style={{ color: "#ff5f56" }}>{"{"}</span>
                  <div style={{ paddingLeft: "24px", display: "flex", flexDirection: "column" }}>
                    
                    {/* Avatar Block */}
                    <div>
                      <span style={{ color: "#38bdf8" }}>"avatar"</span>: <span style={{ color: "#ff5f56" }}>{"{"}</span>
                      <div style={{ paddingLeft: "24px", display: "flex", alignItems: "center", gap: "16px", margin: "8px 0" }}>
                         <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#111116", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 800, color: "#38bdf8", border: "2px solid #2a2a35" }}>
                            {profile.username ? profile.username[0].toUpperCase() : "U"}
                         </div>
                         <span style={{ color: "#6272a4" }}>// Auto-generated</span>
                      </div>
                      <span style={{ color: "#ff5f56" }}>{"}"}</span>,
                    </div>
                    
                    <div>
                      <span style={{ color: "#38bdf8" }}>"username"</span>: <span style={{ color: "#34d399" }}>"{profile.username}"</span>,
                    </div>
                    
                    <div>
                      <span style={{ color: "#38bdf8" }}>"email"</span>: <span style={{ color: "#34d399" }}>"{profile.email}"</span>,
                    </div>

                    <div>
                      <span style={{ color: "#38bdf8" }}>"github"</span>: {profile.githubProfile ? (
                        <a href={profile.githubProfile} target="_blank" rel="noopener noreferrer" style={{ color: "#f1fa8c", textDecoration: "underline" }}>
                          "{profile.githubProfile}"
                        </a>
                      ) : (
                        <span style={{ color: "#ff79c6" }}>null</span>
                      )},
                    </div>

                    <div style={{ marginTop: "8px", maxWidth: "600px", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      <span style={{ color: "#38bdf8" }}>"bio"</span>: <span style={{ color: "#f1fa8c" }}>"{profile.bio || '404 - Biography not found'}"</span>,
                    </div>

                    <div style={{ marginTop: "8px" }}>
                      <span style={{ color: "#38bdf8" }}>"skills"</span>: <span style={{ color: "#bd93f9" }}>[</span>
                      <div style={{ paddingLeft: "24px" }}>
                        {profile.skills?.length === 0 ? (
                          <span style={{ color: "#6272a4" }}>// No skills added yet</span>
                        ) : (
                          profile.skills?.map((skill, index) => (
                            <div key={index} style={{ margin: "4px 0", display: "flex", alignItems: "center" }}>
                              <span style={{ color: "#ff5f56" }}>{"{"}</span>
                              <span style={{ color: "#38bdf8", marginLeft: "12px" }}>"{skill.name}"</span>: 
                              <span style={{ color: "#bd93f9", marginLeft: "12px", width: "16px", display: "inline-block", textAlign: "right" }}>{skill.rating}</span>
                              <span style={{ color: "#6272a4", marginLeft: "24px", display: "flex", alignItems: "center" }}>
                                 // 
                                 <div style={{ display: "inline-block", width: "80px", height: "6px", background: "#111116", borderRadius: "3px", border: "1px solid #2a2a35", marginLeft: "12px", overflow: "hidden" }}>
                                    <div style={{ width: `${(skill.rating / 5) * 100}%`, height: "100%", background: "#34d399" }}></div>
                                 </div>
                              </span>
                              <span style={{ color: "#ff5f56", marginLeft: "24px" }}>{"}"}</span>{index < profile.skills.length - 1 ? "," : ""}
                            </div>
                          ))
                        )}
                      </div>
                      <span style={{ color: "#bd93f9" }}>]</span>
                    </div>

                  </div>
                  <span style={{ color: "#ff5f56" }}>{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;