import { useState } from "react";
import { login, register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTheme, setTheme } from "../../utils/theme";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    githubProfile: "",
    skills: [],
  });

  const [success, setSuccess] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [skillRating, setSkillRating] = useState("");
  const [theme, setLocalTheme] = useState(getTheme());
  const { setToken, setUser } = useAuth();

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setLocalTheme(nextTheme);
  };

  const handleSkill = (e) => {
    setSkillName(e.target.value);
  };

  const handleRating = (e) => {
    setSkillRating(Number(e.target.value));
  };

  const handleAddSkill = () => {
    if (!skillName.trim()) {
      return alert("Skill Name can't be empty");
    }
    if (isNaN(skillRating) || skillRating < 1 || skillRating > 5) {
      return alert("Rating must be a number between 1 to 5");
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: skillName.trim(), rating: skillRating }],
    }));
    setSkillName("");
    setSkillRating("");
  };

  const validateForm = () => {
    setError("");

    if (formData.username.trim() === "") {
      setError("Username is required");
      return false;
    }

    if (formData.email.trim() === "") {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.trim() === "") {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.skills.length === 0) {
      setError("Please add at least one skill");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      await register(formData);
      const loginData = await login(formData.email, formData.password);
      if (loginData.success === true) {
        localStorage.setItem("token", loginData.token);
        setToken(loginData.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: loginData.data.id,
            name: loginData.data.username,
            email: loginData.data.email,
          })
        );
        setUser({
          id: loginData.data.id,
          name: loginData.data.username,
          email: loginData.data.email,
        });
        setSuccess(true);
        navigate("/dashboard");
      } else {
        throw new Error("Login Failed after registration");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const addData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "95vh",
        padding: "40px 20px",
      }}
    >
      <button
        onClick={toggleTheme}
        className="ceramic-theme-toggle"
        style={{ position: "fixed", top: "30px", right: "30px" }}
        title="Toggle theme"
      >
        <span className="material-symbols-outlined">
          {theme === "light" ? "dark_mode" : "light_mode"}
        </span>
      </button>

      <div className="ceramic-card" style={{ width: "100%", maxWidth: "800px", padding: "40px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: "8px" }}>
            Create Account
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Join the collab.space student community
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            className="register-responsive-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
            }}
          >
            {/* Left Column: Account details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="ceramic-input-group">
                <label htmlFor="username">User Name</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={addData}
                  placeholder="e.g. janesmith"
                  required
                  className="ceramic-input"
                />
              </div>

              <div className="ceramic-input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={addData}
                  placeholder="jane.smith@college.edu"
                  required
                  className="ceramic-input"
                />
              </div>

              <div className="ceramic-input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={addData}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="ceramic-input"
                />
              </div>

              <div className="ceramic-input-group">
                <label htmlFor="bio">Brief Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={addData}
                  placeholder="Tell us about yourself..."
                  className="ceramic-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                />
              </div>

              <div className="ceramic-input-group">
                <label htmlFor="githubProfile">Github Profile URL</label>
                <input
                  id="githubProfile"
                  type="text"
                  name="githubProfile"
                  value={formData.githubProfile}
                  onChange={addData}
                  placeholder="https://github.com/username"
                  className="ceramic-input"
                />
              </div>
            </div>

            {/* Right Column: Skills management */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="ceramic-card" style={{ boxShadow: "var(--shadow-inset)", padding: "24px" }}>
                <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", color: "var(--accent-primary)" }}>
                  Skills & Ratings
                </h3>

                <div className="ceramic-input-group">
                  <label htmlFor="skillName">Skill Name</label>
                  <input
                    id="skillName"
                    type="text"
                    value={skillName}
                    onChange={handleSkill}
                    placeholder="e.g. React, Node, AI"
                    className="ceramic-input"
                  />
                </div>

                <div className="ceramic-input-group">
                  <label htmlFor="skillRating">Rating (1-5)</label>
                  <input
                    id="skillRating"
                    type="number"
                    min={1}
                    max={5}
                    value={skillRating}
                    onChange={handleRating}
                    placeholder="Rate your skill level"
                    className="ceramic-input"
                  />
                </div>

                <button type="button" onClick={handleAddSkill} className="ceramic-btn" style={{ width: "100%", marginTop: "8px" }}>
                  <span className="material-symbols-outlined">add</span>
                  Add Skill
                </button>
              </div>

              {formData.skills.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", paddingLeft: "8px" }}>
                    Your Added Skills:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag" style={{ padding: "6px 12px", borderRadius: "12px" }}>
                        {skill.name} ({skill.rating}/5)
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const newSkills = [...prev.skills];
                              newSkills.splice(index, 1);
                              return { ...prev, skills: newSkills };
                            });
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--danger)",
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "4px",
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit block moved inside the right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
                <button type="submit" disabled={loading} className="ceramic-btn primary" style={{ width: "100%" }}>
                  {loading ? "Registering..." : "Submit Registration"}
                </button>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", marginBottom: "8px" }}>
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/")}
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent-primary)",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Sign In
                  </button>
                </p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", textAlign: "center", opacity: 0.6 }}>
                  © 2026 CollabSpace. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <p style={{ color: "var(--danger)", fontSize: "0.85rem", textAlign: "center", fontWeight: 500, marginTop: "16px" }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
