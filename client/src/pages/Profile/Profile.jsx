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
            <p style={{ color: "#888", marginTop: "4px" }}>
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "80px 0" }}>
            <span className="indicator-light"></span>
            <div style={{ color: "#bd93f9", fontWeight: 700, fontFamily: "'Fira Code', monospace" }}>Fetching data...</div>
          </div>
        ) : error ? (
          <div className="ide-card" style={{ textAlign: "center", color: "#f87171" }}>
            <p>{error}</p>
          </div>
        ) : isEditing ? (
          <div className="terminal-card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="chat-header-handle" style={{ background: "#0B0B0F", padding: "12px 20px", display: "flex", gap: "16px", borderBottom: "1px solid #2a2a35", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <div className="mac-dot red"></div>
                <div className="mac-dot yellow"></div>
                <div className="mac-dot green"></div>
              </div>
              <div style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'Fira Code', monospace", display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#f1fa8c" }}>edit_square</span>
                <span>configure_profile.sh (interactive)</span>
              </div>
            </div>

            <div style={{ padding: "32px", fontFamily: "'Fira Code', monospace", background: "#0a0a0c", overflowX: "hidden" }}>
              <div style={{ color: "#ff5f56", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", flexWrap: "wrap", wordBreak: "break-word" }}>
                <span>root@collabspace:~#</span>
                <span style={{ color: "#c9d1d9", fontWeight: 400, marginLeft: "8px" }}>./configure_profile.sh --interactive</span>
              </div>
              
              <div style={{ borderLeft: "2px solid #38bdf8", paddingLeft: "16px", marginBottom: "40px" }}>
                <div style={{ color: "#38bdf8", fontWeight: 700, marginBottom: "8px" }}>&gt;&gt; INITIALIZING PROFILE CONFIGURATION WIZARD...</div>
                <div style={{ color: "#888", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  Please input your updated developer details below.<br/>
                  Press Save to compile and write changes to disk.
                </div>
              </div>

              <form onSubmit={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
                <div className="terminal-input-group">
                  <label htmlFor="username" className="terminal-label" style={{ color: "#bd93f9", marginBottom: "4px", display: "block" }}>? Enter [USERNAME]:</label>
                  <div style={{ display: "flex", alignItems: "center", background: "#111116", border: "1px solid #2a2a35", borderRadius: "4px", padding: "0 14px", transition: "border-color 0.2s ease" }} onFocus={(e) => e.currentTarget.style.borderColor = "#34d399"} onBlur={(e) => e.currentTarget.style.borderColor = "#2a2a35"}>
                     <span style={{ color: "#34d399", marginRight: "8px", fontWeight: 700 }}>&gt;</span>
                     <input
                       id="username"
                       type="text"
                       name="username"
                       value={formData.username}
                       onChange={addData}
                       required
                       style={{ border: "none", background: "transparent", padding: "12px 0", flex: 1, width: "100%", outline: "none", color: "#c9d1d9", fontFamily: "'Fira Code', monospace", fontSize: "0.9rem" }}
                     />
                  </div>
                </div>

                <div className="terminal-input-group">
                  <label htmlFor="bio" className="terminal-label" style={{ color: "#bd93f9", marginBottom: "4px", display: "block" }}>? Enter [BIO_SUMMARY]:</label>
                  <div style={{ display: "flex", alignItems: "flex-start", background: "#111116", border: "1px solid #2a2a35", borderRadius: "4px", padding: "12px 14px", transition: "border-color 0.2s ease" }} onFocus={(e) => e.currentTarget.style.borderColor = "#34d399"} onBlur={(e) => e.currentTarget.style.borderColor = "#2a2a35"}>
                     <span style={{ color: "#34d399", marginRight: "8px", fontWeight: 700, marginTop: "2px" }}>&gt;</span>
                     <textarea
                       id="bio"
                       name="bio"
                       value={formData.bio}
                       onChange={addData}
                       style={{ border: "none", background: "transparent", padding: "0", flex: 1, width: "100%", outline: "none", color: "#c9d1d9", fontFamily: "'Fira Code', monospace", fontSize: "0.9rem", minHeight: "100px", resize: "vertical" }}
                     />
                  </div>
                </div>

                <div className="terminal-input-group">
                  <label htmlFor="githubProfile" className="terminal-label" style={{ color: "#bd93f9", marginBottom: "4px", display: "block" }}>? Enter [GITHUB_URL] (Optional):</label>
                  <div style={{ display: "flex", alignItems: "center", background: "#111116", border: "1px solid #2a2a35", borderRadius: "4px", padding: "0 14px", transition: "border-color 0.2s ease" }} onFocus={(e) => e.currentTarget.style.borderColor = "#34d399"} onBlur={(e) => e.currentTarget.style.borderColor = "#2a2a35"}>
                     <span style={{ color: "#34d399", marginRight: "8px", fontWeight: 700 }}>&gt;</span>
                     <input
                       id="githubProfile"
                       type="text"
                       name="githubProfile"
                       value={formData.githubProfile}
                       onChange={addData}
                       style={{ border: "none", background: "transparent", padding: "12px 0", flex: 1, width: "100%", outline: "none", color: "#c9d1d9", fontFamily: "'Fira Code', monospace", fontSize: "0.9rem" }}
                     />
                  </div>
                </div>

                <div style={{ background: "#111116", border: "1px solid #2a2a35", borderRadius: "8px", padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <span className="material-symbols-outlined" style={{ color: "#f1fa8c", fontSize: "20px" }}>memory</span>
                    <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.1rem", fontWeight: 700, margin: 0, color: "#38bdf8" }}>
                      Configure Skill Modules
                    </h3>
                  </div>
                  
                  <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", background: "#0a0a0c", border: "1px solid #2a2a35", borderRadius: "4px", padding: "0 14px", flexGrow: 2 }}>
                       <span style={{ color: "#888", marginRight: "8px", fontSize: "0.85rem" }}>Name:</span>
                       <input
                         type="text"
                         placeholder="e.g. React"
                         value={skillName}
                         onChange={(e) => setSkillName(e.target.value)}
                         style={{ border: "none", background: "transparent", padding: "10px 0", flexGrow: 1, outline: "none", color: "#c9d1d9", fontFamily: "'Fira Code', monospace", fontSize: "0.9rem" }}
                       />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", background: "#0a0a0c", border: "1px solid #2a2a35", borderRadius: "4px", padding: "0 14px", flexGrow: 1 }}>
                       <span style={{ color: "#888", marginRight: "8px", fontSize: "0.85rem" }}>LVL (1-5):</span>
                       <input
                         type="number"
                         min="1"
                         max="5"
                         value={skillRating}
                         onChange={(e) => setSkillRating(e.target.value)}
                         style={{ border: "none", background: "transparent", padding: "10px 0", flexGrow: 1, outline: "none", color: "#c9d1d9", fontFamily: "'Fira Code', monospace", fontSize: "0.9rem" }}
                       />
                    </div>
                    <button type="button" onClick={handleAddSkill} className="terminal-btn" style={{ color: "#0B0B0F", background: "#34d399", borderColor: "#34d399", fontWeight: 700 }}>
                      [+] Install
                    </button>
                  </div>

                  {formData.skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", background: "#0a0a0c", padding: "16px", borderRadius: "4px", border: "1px dashed #2a2a35" }}>
                      {formData.skills.map((skill, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", background: "#111116", border: "1px solid #38bdf8", padding: "6px 12px", borderRadius: "4px", gap: "8px" }}>
                          <span style={{ color: "#c9d1d9", fontSize: "0.85rem" }}>{skill.name}</span>
                          <span style={{ color: "#34d399", fontSize: "0.85rem", fontWeight: 700 }}>v{skill.rating}.0</span>
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
                              padding: 0,
                              marginLeft: "4px"
                            }}
                            title="Uninstall module"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginTop: "16px", borderTop: "1px solid #2a2a35", paddingTop: "24px" }}>
                  <button type="button" onClick={() => setIsEditing(false)} className="terminal-btn" style={{ color: "#ff5f56", borderColor: "#ff5f56" }}>
                    [x] Abort
                  </button>
                  <button type="submit" className="terminal-btn" style={{ color: "#0B0B0F", background: "#38bdf8", borderColor: "#38bdf8", fontWeight: 700 }}>
                    [&gt;] Write &amp; Compile
                  </button>
                </div>
              </form>
            </div>
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