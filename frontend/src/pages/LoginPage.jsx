import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import api from "../services/api";

const CYAN = "#00C8FF";          // neon — for backgrounds only (white text on top)
const CYAN_TEXT = "var(--cyber-text)"; // accessible — for text on white/light surfaces
const GRID_BG = {
  background:
    "radial-gradient(ellipse at 50% 0%, rgba(0,200,255,0.08) 0%, transparent 70%), #F4F4FF",
};

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);
      // Fetch admin status so the navbar can show Admin Mode if applicable
      try {
        const me = await api.get("/users/me/");
        localStorage.setItem("is_staff", me.data.is_staff ? "true" : "false");
      } catch {
        localStorage.setItem("is_staff", "false");
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Access denied.");
    } finally {
      setLoading(false);
    }
  };

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
            ACCESS TERMINAL
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "#606090", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem" }}
          >
            // authenticate to continue
          </p>
        </div>

        {/* form panel */}
        <div
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 relative"
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
            <div>
              <label
                className="block text-xs font-bold mb-1.5 tracking-widest"
                style={{ color: CYAN_TEXT, fontFamily: "'Space Mono', monospace" }}
              >
                USERNAME
              </label>
              <input
                type="text"
                placeholder="enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-gray-900 text-sm focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label
                className="block text-xs font-bold mb-1.5 tracking-widest"
                style={{ color: CYAN_TEXT, fontFamily: "'Space Mono', monospace" }}
              >
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded px-4 py-3 text-gray-900 text-sm focus:outline-none transition"
                required
              />
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
              {loading ? "AUTHENTICATING..." : "AUTHENTICATE"}
            </button>
          </form>

          <p
            className="text-center text-xs mt-6 tracking-wide"
            style={{ color: "#8888B8", fontFamily: "'Space Mono', monospace" }}
          >
            NO ACCOUNT?{" "}
            <Link
              to="/register"
              className="font-bold hover:opacity-80 transition-opacity"
              style={{ color: CYAN_TEXT }}
            >
              REQUEST ACCESS
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
