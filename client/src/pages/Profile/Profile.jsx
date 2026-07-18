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
            <div className="ceramic-card" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "var(--tag-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--accent-primary)",
                  boxShadow: "var(--shadow-outset)",
                }}
              >
                {profile.username ? profile.username[0].toUpperCase() : "U"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}>{profile.username}</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{profile.email}</p>
                {profile.githubProfile && (
                  <a
                    href={profile.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--accent-primary)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>code</span>
                    GitHub Portfolio
                  </a>
                )}
              </div>
            </div>

            <div className="responsive-grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Bio card */}
              <div className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.1rem", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                  Developer Bio
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "var(--text-primary)" }}>
                  {profile.bio || "No biography provided yet. Edit your profile to share details about your development interests!"}
                </p>
              </div>

              {/* Skills rating card */}
              <div className="ceramic-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.1rem", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                  Technical Expertise
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {profile.skills?.length === 0 ? (
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                      No skills added yet.
                    </p>
                  ) : (
                    profile.skills?.map((skill, index) => (
                      <div key={index}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px" }}>
                          <span>{skill.name}</span>
                          <span>{skill.rating} / 5</span>
                        </div>
                        <div className="ceramic-progress-track">
                          <div className="ceramic-progress-bar" style={{ width: `${(skill.rating / 5) * 100}%` }}></div>
                        </div>
                      </div>
                    ))
                  )}
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