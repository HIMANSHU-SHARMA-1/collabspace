import { useState } from "react";
import { login, register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTheme, setTheme } from "../../utils/theme";
import TextType from "../../components/ReactBits/TextType";
import PixelTransition from "../../components/ReactBits/PixelTransition";
import ScrollFloat from "../../components/ReactBits/ScrollFloat";
import CircularText from "../../components/ReactBits/CircularText";

const Login = () => {
  const [formData, setformData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Registration State
  const [isFlipped, setIsFlipped] = useState(false);
  const [regFormData, setRegFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    githubProfile: "",
    skills: [{ name: "", rating: 5 }]
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const [theme, setLocalTheme] = useState(getTheme());
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setLocalTheme(nextTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(formData.email, formData.password);
      if (data.success === true) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.data.id,
            name: data.data.username,
            email: data.data.email,
          })
        );
        setUser({
          id: data.data.id,
          name: data.data.username,
          email: data.data.email,
        });
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const addData = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const addRegData = (e) => {
    setRegFormData({ ...regFormData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index, field, value) => {
    setRegFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return { ...prev, skills: newSkills };
    });
  };

  const addSkillField = () => {
    setRegFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), { name: "", rating: 5 }]
    }));
  };

  const removeSkill = (index) => {
    setRegFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills.splice(index, 1);
      return { ...prev, skills: newSkills };
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError("");
    try {
      const data = await register(regFormData);
      if (data.success === true) {
        setIsFlipped(false);
      }
    } catch (err) {
      setRegError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  const scrollToLogin = () => {
    document.getElementById('login-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Navbar */}
      <nav className="landing-navbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "var(--accent-primary)" }}>bubble_chart</span>
          <span style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
            collab<span style={{ color: "var(--accent-primary)" }}>.space</span>
          </span>
          <span style={{ fontSize: "0.6rem", background: "rgba(217, 119, 87, 0.1)", color: "var(--accent-primary)", padding: "2px 8px", borderRadius: "10px", marginLeft: "8px", fontWeight: "bold", border: "1px solid rgba(217, 119, 87, 0.3)" }}>PRIVATE BETA</span>
        </div>
        <div className="landing-navbar-links">
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#login-section">Access</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div>
          <ScrollFloat
            animationDuration={1.2}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            scrub={false}
            containerClassName="hero-headline-container"
            textClassName="hero-headline"
          >
            Connect the brightest minds. Combine the sharpest skills. Launch high-impact projects.
          </ScrollFloat>
          <TextType
            as="p"
            className="hero-subheadline"
            text={[
              "CollabSpace matches developers, designers, and project leads...",
              "Into high-signal rooms built around complementary skills...",
              "With real workloads, and ambitious collegiate ideas."
            ]}
            typingSpeed={40}
            deletingSpeed={20}
            pauseDuration={2000}
            showCursor={true}
          />
          <div className="hero-cta-wrapper" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button onClick={scrollToLogin} className="ceramic-btn hero-cta-button" style={{ borderRadius: "30px", padding: "16px 32px" }}>
              Join the Workspace
            </button>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Creator-First Matching</span>
          </div>
        </div>
        <div className="hero-graphic-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', height: '100%', minHeight: '400px' }}>
          {/* Subtle radial gradient behind artwork */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(217, 119, 87, 0.08), transparent 60%)', pointerEvents: 'none', zIndex: 0 }}></div>

          <div style={{ position: 'absolute', transform: 'scale(0.7)', zIndex: 5, color: '#34d399' }}>
            <CircularText
              text="IDEAS • PROJECTS • TEAMS • "
              spinDuration={10}
              onHover="pause"
              spinDirection={1}
            />
          </div>
          <div style={{ position: 'absolute', transform: 'scale(1.3)', zIndex: 4, color: 'var(--accent-primary)' }}>
            <CircularText
              text="INNOVATE • CREATE • BUILD • "
              spinDuration={15}
              onHover="speedUp"
              spinDirection={-1}
            />
          </div>
          <div style={{ position: 'absolute', transform: 'scale(1.9)', zIndex: 3, color: 'var(--accent-secondary)' }}>
            <CircularText
              text="COLLABORATE • CONNECT • MATCH • "
              spinDuration={25}
              onHover="slowDown"
              spinDirection={1}
            />
          </div>
          <div style={{ position: 'absolute', transform: 'scale(2.5)', zIndex: 2, color: '#a855f7' }}>
            <CircularText
              text="DEVELOPERS • DESIGNERS • FOUNDERS • "
              spinDuration={35}
              onHover="goBonkers"
              spinDirection={-1}
            />
          </div>
          <div style={{ position: 'absolute', transform: 'scale(3.1)', zIndex: 1, color: '#e4b638' }}>
            <CircularText
              text="FUTURE • OF • WORKSPACE • "
              spinDuration={45}
              onHover="speedUp"
              spinDirection={1}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-section">
        <div className="section-pill">A sharper way to assemble campus teams</div>
        <h2 className="section-title">Match by momentum, not mutuals.</h2>
        <p className="section-subtitle">
          CollabSpace turns scattered college talent into focused build squads with skill-fit, availability clarity, and project rooms that move ideas forward.
        </p>

        <div className="features-grid">
          <PixelTransition
            gridSize={12}
            pixelColor="var(--accent-primary)"
            aspectRatio="100%"
            firstContent={
              <div className="feature-card" style={{ height: "100%", margin: 0 }}>
                <div className="feature-icon-wrapper" style={{ color: "var(--accent-primary)" }}>
                  <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <h3 className="feature-title">Ignite</h3>
                <p className="feature-desc">Turn campus concepts into working code before momentum evaporates.</p>
              </div>
            }
            secondContent={
              <div className="feature-card" style={{ height: "100%", margin: 0, background: "var(--accent-primary)" }}>
                <div className="feature-icon-wrapper" style={{ color: "#111", background: "rgba(0,0,0,0.1)", borderColor: "rgba(0,0,0,0.2)" }}>
                  <span className="material-symbols-outlined">local_fire_department</span>
                </div>
                <h3 className="feature-title" style={{ color: "#111" }}>Ignite</h3>
                <p className="feature-desc" style={{ color: "#222", fontWeight: 500 }}>Turn campus concepts into working code before momentum evaporates.</p>
              </div>
            }
          />
          
          <PixelTransition
            gridSize={12}
            pixelColor="var(--accent-secondary)"
            aspectRatio="100%"
            firstContent={
              <div className="feature-card" style={{ height: "100%", margin: 0 }}>
                <div className="feature-icon-wrapper" style={{ color: "var(--accent-secondary)" }}>
                  <span className="material-symbols-outlined">insights</span>
                </div>
                <h3 className="feature-title">Align</h3>
                <p className="feature-desc">AI-driven talent matching based on tech stacks, creative range, and real workload capacity.</p>
              </div>
            }
            secondContent={
              <div className="feature-card" style={{ height: "100%", margin: 0, background: "var(--accent-secondary)" }}>
                <div className="feature-icon-wrapper" style={{ color: "#111", background: "rgba(0,0,0,0.1)", borderColor: "rgba(0,0,0,0.2)" }}>
                  <span className="material-symbols-outlined">insights</span>
                </div>
                <h3 className="feature-title" style={{ color: "#111" }}>Align</h3>
                <p className="feature-desc" style={{ color: "#222", fontWeight: 500 }}>AI-driven talent matching based on tech stacks, creative range, and real workload capacity.</p>
              </div>
            }
          />

          <PixelTransition
            gridSize={12}
            pixelColor="#a855f7"
            aspectRatio="100%"
            firstContent={
              <div className="feature-card" style={{ height: "100%", margin: 0 }}>
                <div className="feature-icon-wrapper" style={{ color: "#a855f7" }}>
                  <span className="material-symbols-outlined">token</span>
                </div>
                <h3 className="feature-title">Execute</h3>
                <p className="feature-desc">Frictionless team building with structured real-time room chats and founder-grade rituals.</p>
              </div>
            }
            secondContent={
              <div className="feature-card" style={{ height: "100%", margin: 0, background: "#a855f7" }}>
                <div className="feature-icon-wrapper" style={{ color: "#111", background: "rgba(0,0,0,0.1)", borderColor: "rgba(0,0,0,0.2)" }}>
                  <span className="material-symbols-outlined">token</span>
                </div>
                <h3 className="feature-title" style={{ color: "#111" }}>Execute</h3>
                <p className="feature-desc" style={{ color: "#222", fontWeight: 500 }}>Frictionless team building with structured real-time room chats and founder-grade rituals.</p>
              </div>
            }
          />
        </div>
      </section>

      {/* App Preview Section */}
      <section id="preview" className="landing-section">
        <div className="section-pill">Workspace Intelligence</div>
        <h2 className="section-title">A focused dashboard for<br/>serious student builders.</h2>
        
        <div className="mockup-container">
          <div className="mockup-header">
            <div className="mockup-dots">
              <div className="mockup-dot" style={{ background: "#ef4444" }}></div>
              <div className="mockup-dot" style={{ background: "#f59e0b" }}></div>
              <div className="mockup-dot" style={{ background: "#10b981" }}></div>
            </div>
            <div className="mockup-title">CollabSpace OS / Matching Room</div>
          </div>
          
          <div className="mockup-panel">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h4 style={{ color: "#fff" }}>High-fit projects</h4>
              <span style={{ color: "var(--accent-secondary)", fontSize: "0.8rem", fontWeight: "bold" }}>12 ACTIVE</span>
            </div>
            
            <div style={{ background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h5 style={{ color: "#fff", marginBottom: "8px" }}>Campus carbon ledger</h5>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "12px" }}>Needs data viz designer + backend lead</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <span className="skill-tag" style={{ fontSize: "0.7rem", padding: "4px 8px" }}>REACT</span>
                <span className="skill-tag" style={{ fontSize: "0.7rem", padding: "4px 8px", color: "var(--accent-secondary)", background: "rgba(16,185,129,0.1)" }}>YES MATCH</span>
              </div>
            </div>

            <div style={{ background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", opacity: 0.7 }}>
              <h5 style={{ color: "#fff", marginBottom: "8px" }}>Peer tutoring agent</h5>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "12px" }}>LLM workflow, educator interviews, UX system</p>
            </div>
          </div>

          <div className="mockup-panel">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
              <h4 style={{ color: "#fff" }}>Room chat</h4>
              <span style={{ color: "var(--accent-secondary)", fontSize: "0.8rem", fontWeight: "bold" }}>LIVE</span>
            </div>
            
            <div style={{ background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--accent-primary)", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>Maya - Product</div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>I can scope the MVP and run interviews this week.</p>
            </div>

            <div style={{ background: "rgba(16,185,129,0.05)", padding: "16px", borderRadius: "12px", marginBottom: "24px", border: "1px solid rgba(16,185,129,0.2)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--accent-secondary)", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>Arjun - Engineering</div>
              <p style={{ color: "#fff", fontSize: "0.85rem" }}>I'll wire auth + vector search. Need a designer by Friday.</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", background: "var(--panel-bg)", borderRadius: "20px", padding: "12px 16px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", flexGrow: 1 }}>Drop a build update...</span>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--accent-primary)" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth/CTA Footer Section */}
      <section id="login-section" className="landing-section">
        <div className="section-pill">Invite-only workspace</div>
        <h2 className="section-title">Ready to eliminate recruitment friction?</h2>
        <p className="section-subtitle" style={{ marginBottom: "40px" }}>
          Join the early campus cohort and get matched into rooms where skill, ambition, and availability already line up.
        </p>
        
        <div className="auth-container">
          <div className={`auth-flip-card ${isFlipped ? "flipped" : ""}`}>
            
            {/* FRONT: LOGIN */}
            <div className="auth-card-front">
              <form onSubmit={handleSubmit} className="code-login-wrapper" style={{ marginTop: 0 }}>
                <div className="code-login-header">
                  <div className="mac-dot red"></div>
                  <div className="mac-dot yellow"></div>
                  <div className="mac-dot green"></div>
                </div>

                <div className="code-line"><span className="keyword">function</span>&nbsp;<span className="function">email</span>() {"{"}</div>
                <div className="code-line indent">
                  <span className="keyword">const</span>&nbsp;message =&nbsp;<span className="string">`</span><input
                    id="email"
                    type="email"
                    name="email"
                    onChange={addData}
                    placeholder="enter your email here"
                    required
                    className="code-input"
                  /><span className="string">`</span>
                </div>
                <div className="code-line indent"><span className="keyword">return</span>&nbsp;message;</div>
                <div className="code-line">{"}"}</div>

                <div className="code-line"><span className="keyword">function</span>&nbsp;<span className="function">password</span>() {"{"}</div>
                <div className="code-line indent">
                  <span className="keyword">const</span>&nbsp;password =&nbsp;<span className="string">'</span><input
                    id="password"
                    type="password"
                    name="password"
                    onChange={addData}
                    placeholder="Enter your password here"
                    required
                    className="code-input"
                  /><span className="string">'</span>
                </div>
                <div className="code-line indent"><span className="keyword">return</span>&nbsp;password;</div>
                <div className="code-line">{"}"}</div>

                <br />
                <div className="code-line"><span className="function">email</span>();</div>
                <div className="code-line"><span className="function">password</span>();</div>

                {error && (
                  <div className="code-line comment" style={{ marginTop: "16px", color: "#e06c75" }}>
                    // Error: {error}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => setIsFlipped(true)}
                    style={{ background: "none", border: "none", color: "#5c6370", cursor: "pointer", textDecoration: "underline", fontSize: "0.85rem" }}
                  >
                    // Create account
                  </button>
                  <button type="submit" disabled={loading} className="run-button">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>play_arrow</span>
                    {loading ? "Executing..." : "Run"}
                  </button>
                </div>
              </form>
            </div>

            {/* BACK: REGISTER */}
            <div className="auth-card-back">
              <form onSubmit={handleRegisterSubmit} className="code-login-wrapper" style={{ marginTop: 0, borderColor: "rgba(168, 85, 247, 0.3)" }}>
                <div className="code-login-header">
                  <div className="mac-dot red"></div>
                  <div className="mac-dot yellow"></div>
                  <div className="mac-dot green"></div>
                </div>

                <div className="code-line"><span className="comment">/**</span></div>
                <div className="code-line"><span className="comment"> * Initialize a new creator profile</span></div>
                <div className="code-line"><span className="comment"> */</span></div>
                <div className="code-line"><span className="keyword">class</span>&nbsp;<span className="function">CollabSpaceUser</span>&nbsp;{"{"}</div>
                <div className="code-line indent"><span className="keyword">constructor</span>() {"{"}</div>
                
                <div className="code-line indent" style={{ paddingLeft: "64px" }}>
                  <span className="variable">this</span>.username =&nbsp;<span className="string">"</span><input
                    type="text" name="username" onChange={addRegData} placeholder="your_handle" required className="code-input" style={{ width: "140px" }}
                  /><span className="string">"</span>;
                </div>
                
                <div className="code-line indent" style={{ paddingLeft: "64px" }}>
                  <span className="variable">this</span>.email =&nbsp;<span className="string">"</span><input
                    type="email" name="email" onChange={addRegData} placeholder="name@college.edu" required className="code-input" style={{ width: "160px" }}
                  /><span className="string">"</span>;
                </div>

                <div className="code-line indent" style={{ paddingLeft: "64px" }}>
                  <span className="variable">this</span>.password =&nbsp;<span className="string">"</span><input
                    type="password" name="password" onChange={addRegData} placeholder="••••••••" required className="code-input" style={{ width: "140px" }}
                  /><span className="string">"</span>;
                </div>

                <div className="code-line indent" style={{ paddingLeft: "64px" }}>
                  <span className="variable">this</span>.githubProfile =&nbsp;<span className="string">"</span><input
                    type="text" name="githubProfile" onChange={addRegData} placeholder="https://github.com/..." className="code-input" style={{ width: "180px" }}
                  /><span className="string">"</span>;
                </div>

                <div className="code-line indent" style={{ paddingLeft: "64px", alignItems: "flex-start" }}>
                  <span className="variable">this</span>.bio =&nbsp;<span className="string">`</span>
                  <textarea
                    name="bio"
                    onChange={addRegData}
                    placeholder="Tell us about yourself..."
                    className="code-input"
                    style={{ width: "240px", height: "40px", resize: "none" }}
                  />
                  <span className="string">`</span>;
                </div>

                <div className="code-line indent" style={{ paddingLeft: "64px" }}>
                  <span className="variable">this</span>.skills = [
                </div>
                {regFormData.skills?.map((skill, index) => (
                  <div key={index} className="code-line indent" style={{ paddingLeft: "80px" }}>
                    {"{ name: "}<span className="string">"</span><input
                      type="text" value={skill.name} onChange={(e) => handleSkillChange(index, 'name', e.target.value)} placeholder="React" required className="code-input" style={{ width: "70px" }}
                    /><span className="string">"</span>{", rating: "}<input
                      type="number" min="1" max="5" value={skill.rating} onChange={(e) => handleSkillChange(index, 'rating', Number(e.target.value))} required className="code-input" style={{ width: "30px", color: "#b5cea8" }}
                    />{" },"}
                    {regFormData.skills.length > 1 && (
                      <button type="button" onClick={() => removeSkill(index)} style={{ background:"none", border:"none", color:"#e06c75", cursor:"pointer", marginLeft:"8px" }}>// remove</button>
                    )}
                  </div>
                ))}
                <div className="code-line indent" style={{ paddingLeft: "80px" }}>
                  <button type="button" onClick={addSkillField} style={{ background:"none", border:"none", color:"#5c6370", cursor:"pointer", padding:0 }}>// + add skill object</button>
                </div>
                <div className="code-line indent" style={{ paddingLeft: "64px" }}>];</div>

                <div className="code-line indent">{"}"}</div>
                <div className="code-line">{"}"}</div>
                <br/>
                <div className="code-line"><span className="keyword">const</span>&nbsp;user =&nbsp;<span className="keyword">new</span>&nbsp;<span className="function">CollabSpaceUser</span>();</div>
                <div className="code-line"><span className="keyword">await</span>&nbsp;user.<span className="function">register</span>();</div>

                {regError && (
                  <div className="code-line comment" style={{ marginTop: "16px", color: "#e06c75" }}>
                    // Exception: {regError}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "24px" }}>
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    style={{ background: "none", border: "none", color: "#5c6370", cursor: "pointer", textDecoration: "underline", fontSize: "0.85rem" }}
                  >
                    // Back to login
                  </button>
                  <button type="submit" disabled={regLoading} className="run-button" style={{ background: "#a855f7", color: "#fff" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>terminal</span>
                    {regLoading ? "Compiling..." : "Initialize"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "40px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1300px", margin: "0 auto" }}>
        <span>© 2026 CollabSpace. Built for student creators.</span>
        <div style={{ display: "flex", gap: "24px", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px", fontWeight: "bold" }}>
          <span>Community</span>
          <span>Preview</span>
          <span>Access</span>
        </div>
      </footer>
    </div>
  );
};

export default Login;
