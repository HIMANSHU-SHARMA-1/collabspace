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
            <button onClick={startEditing} className="terminal-btn" style={{ color: "#38bdf8", borderColor: "#38bdf8" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", marginRight: "6px" }}>edit</span>
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
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#38bdf8" }}>terminal</span>
                  <span>profile_view.sh</span>
                </div>
              </div>

              <div style={{ padding: "24px", fontFamily: "'Fira Code', monospace", fontSize: "0.95rem", lineHeight: 1.6, color: "#c9d1d9" }}>
                
                {/* Command 1: Fetch Profile */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", gap: "8px", color: "#34d399", fontWeight: 700 }}>
                    <span>guest@collabspace:~$</span>
                    <span style={{ color: "#c9d1d9", fontWeight: 400 }}>fetch-profile --user {profile.username || "unknown"}</span>
                  </div>
                  
                  {/* Neofetch style grid */}
                  <div style={{ display: "flex", gap: "40px", marginTop: "20px", flexWrap: "wrap" }}>
                    
                    {/* Left: Avatar */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", minWidth: "120px" }}>
                      <div style={{ width: "120px", height: "120px", borderRadius: "8px", background: "#0B0B0F", border: "1px solid #38bdf8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.5rem", fontWeight: 800, color: "#38bdf8", boxShadow: "0 0 20px rgba(56, 189, 248, 0.15)" }}>
                        {profile.username ? profile.username[0].toUpperCase() : "U"}
                      </div>
                      <div style={{ color: "#888", fontSize: "0.85rem", textAlign: "center", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "#34d399", fontSize: "12px" }}>●</span> SYSTEM ONLINE
                      </div>
                    </div>

                    {/* Right: Info */}
                    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                       <div>
                          <span style={{ color: "#38bdf8", fontWeight: 700, width: "100px", display: "inline-block" }}>OS:</span> 
                          CollabSpace v2.0
                       </div>
                       <div>
                          <span style={{ color: "#38bdf8", fontWeight: 700, width: "100px", display: "inline-block" }}>USER:</span> 
                          {profile.username}
                       </div>
                       <div>
                          <span style={{ color: "#38bdf8", fontWeight: 700, width: "100px", display: "inline-block" }}>EMAIL:</span> 
                          {profile.email}
                       </div>
                       <div>
                          <span style={{ color: "#38bdf8", fontWeight: 700, width: "100px", display: "inline-block" }}>GITHUB:</span> 
                          {profile.githubProfile ? (
                             <a href={profile.githubProfile} target="_blank" rel="noopener noreferrer" style={{ color: "#f1fa8c", textDecoration: "underline" }}>
                                {profile.githubProfile}
                             </a>
                          ) : (
                             <span style={{ color: "#888" }}>Not linked</span>
                          )}
                       </div>
                       
                       <div style={{ width: "100%", height: "1px", background: "#2a2a35", margin: "10px 0" }}></div>
                       
                       <div>
                          <span style={{ color: "#38bdf8", fontWeight: 700, display: "block", marginBottom: "8px" }}>BIO:</span> 
                          <div style={{ color: "#888", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                             {profile.bio || "No biography provided."}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Command 2: System Specs (Skills) */}
                <div>
                  <div style={{ display: "flex", gap: "8px", color: "#34d399", fontWeight: 700 }}>
                    <span>guest@collabspace:~$</span>
                    <span style={{ color: "#c9d1d9", fontWeight: 400 }}>sys-specs --module skills</span>
                  </div>
                  
                  <div style={{ marginTop: "20px", padding: "24px", background: "#0B0B0F", border: "1px solid #2a2a35", borderRadius: "8px" }}>
                    {profile.skills?.length === 0 ? (
                      <div style={{ color: "#888" }}>No skill modules loaded.</div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "24px" }}>
                        {profile.skills?.map((skill, index) => (
                          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                              <span style={{ color: "#c9d1d9", fontWeight: 600 }}>{skill.name}</span>
                              <span style={{ color: "#38bdf8" }}>LVL {skill.rating}</span>
                            </div>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div 
                                  key={level} 
                                  style={{ 
                                    height: "8px", 
                                    flexGrow: 1, 
                                    background: level <= skill.rating ? "#34d399" : "#111116",
                                    border: "1px solid",
                                    borderColor: level <= skill.rating ? "#34d399" : "#2a2a35",
                                    borderRadius: "2px"
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Command Prompt Idle */}
                <div style={{ marginTop: "32px", display: "flex", gap: "8px", color: "#34d399", fontWeight: 700, alignItems: "center" }}>
                   <span>guest@collabspace:~$</span>
                   <span style={{ width: "8px", height: "18px", background: "#c9d1d9", display: "inline-block" }}></span>
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