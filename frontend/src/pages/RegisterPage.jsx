import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";

const CYAN = "#00C8FF";          // neon — for backgrounds only (white text on top)
const CYAN_TEXT = "var(--cyber-text)"; // accessible — for text on white/light surfaces
const GRID_BG = {
  background:
    "radial-gradient(ellipse at 50% 0%, rgba(0,200,255,0.08) 0%, transparent 70%), #F4F4FF",
};

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("learner");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(username, email, password, role);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16" style={GRID_BG}>
        <div
          className="w-full max-w-md text-center bg-white rounded-xl p-10 relative"
          style={{ border: `1px solid rgba(0,200,255,0.25)`, boxShadow: `0 0 30px rgba(0,200,255,0.15)` }}
        >
          <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: `2px solid ${CYAN}`, borderLeft: `2px solid ${CYAN}` }} />
          <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: `2px solid ${CYAN}`, borderRight: `2px solid ${CYAN}` }} />

          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: "rgba(0,200,255,0.12)", border: `2px solid ${CYAN}` }}
          >
            ✓
          </div>
          <h2
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em", color: CYAN_TEXT }}
          >
            ACCESS GRANTED
          </h2>
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.72rem" }}>
            // account initialized. sign in to begin.
          </p>
          <Link
            to="/login"
            className="cyber-btn inline-block text-white font-bold px-6 py-3 rounded tracking-widest transition-all"
            style={{
              background: CYAN,
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.1em",
              boxShadow: `0 0 14px rgba(0,200,255,0.4)`,
            }}
          >
            GO TO TERMINAL
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={GRID_BG}>
      <div className="w-full max-w-md">
        {/* header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded text-white text-lg font-bold mb-4"
            style={{
              background: CYAN,
              boxShadow: `0 0 20px rgba(0,200,255,0.5), 0 0 40px rgba(0,200,255,0.2)`,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            LR
          </div>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.06em" }}
          >
            REQUEST ACCESS
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "#606090", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem" }}
          >
            // create your user profile
          </p>
        </div>

        {/* form panel */}
        <div
          className="bg-white rounded-xl border shadow-sm p-8 relative"
          style={{ borderColor: "rgba(0,200,255,0.22)" }}
        >
          {/* corner brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 pointer-events-none" style={{ borderTop: `2px solid ${CYAN}`, borderLeft: `2px solid ${CYAN}` }} />
          <div className="absolute top-0 right-0 w-5 h-5 pointer-events-none" style={{ borderTop: `2px solid ${CYAN}`, borderRight: `2px solid ${CYAN}` }} />
          <div className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none" style={{ borderBottom: `2px solid ${CYAN}`, borderLeft: `2px solid ${CYAN}` }} />
          <div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none" style={{ borderBottom: `2px solid ${CYAN}`, borderRight: `2px solid ${CYAN}` }} />

          {error && (
            <div
              className="mb-5 p-3 rounded text-sm"
              style={{
                background: "rgba(255,0,144,0.08)",
                border: "1px solid rgba(255,0,144,0.30)",
                color: "#FF0090",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.72rem",
              }}
            >
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "USERNAME", type: "text", value: username, setter: setUsername, placeholder: "choose a username" },
              { label: "EMAIL", type: "email", value: email, setter: setEmail, placeholder: "you@example.com" },
              { label: "PASSWORD", type: "password", value: password, setter: setPassword, placeholder: "••••••••" },
            ].map(({ label, type, value, setter, placeholder }) => (
              <div key={label}>
                <label
                  className="block text-xs font-bold mb-1.5 tracking-widest"
                  style={{ color: CYAN_TEXT, fontFamily: "'Space Mono', monospace" }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full border border-gray-200 rounded px-4 py-3 text-gray-900 text-sm focus:outline-none transition"
                  required
                />
              </div>
            ))}

            {/* role selector */}
            <div>
              <label
                className="block text-xs font-bold mb-2 tracking-widest"
                style={{ color: CYAN, fontFamily: "'Space Mono', monospace" }}
              >
                ROLE
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "learner", imgSrc: "/icon-learner.svg", label: "LEARNER", sub: "explore & learn" },
                  { value: "expert", imgSrc: "/icon-expert.svg", label: "EXPERT", sub: "teach & create" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className="flex flex-col items-center p-4 rounded transition-all"
                    style={
                      role === opt.value
                        ? {
                            border: `2px solid ${CYAN}`,
                            background: "rgba(0,200,255,0.08)",
                            boxShadow: `0 0 12px rgba(0,200,255,0.2)`,
                          }
                        : {
                            border: "2px solid rgba(0,0,0,0.08)",
                            background: "transparent",
                          }
                    }
                  >
                    <img src={opt.imgSrc} alt={opt.label} className="w-8 h-8 mb-1 object-contain" />
                    <span
                      className="text-xs font-bold tracking-widest"
                      style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        color: role === opt.value ? CYAN_TEXT : "#606090",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      className="text-xs mt-0.5"
                      style={{ color: "#8888B8", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem" }}
                    >
                      {opt.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn w-full text-white font-bold py-3 rounded tracking-widest transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? "rgba(0,200,255,0.6)" : CYAN,
                fontFamily: "'Rajdhani', sans-serif",
                letterSpacing: "0.12em",
                boxShadow: `0 0 14px rgba(0,200,255,0.35)`,
              }}
            >
              {loading ? "INITIALIZING..." : "CREATE PROFILE"}
            </button>
          </form>

          <p
            className="text-center text-xs mt-6 tracking-wide"
            style={{ color: "#8888B8", fontFamily: "'Space Mono', monospace" }}
          >
            ALREADY REGISTERED?{" "}
            <Link
              to="/login"
              className="font-bold hover:opacity-80 transition-opacity"
              style={{ color: CYAN_TEXT }}
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
