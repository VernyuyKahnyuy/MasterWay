import { Link } from "react-router-dom";

const CYAN = "#00C8FF";

export default function LoginWall({
  icon = "🔒",
  title = "Sign in to continue",
  message = "Create a free account or log in to access this feature.",
}) {
  return (
    <div className="flex items-center justify-center min-h-[72vh] px-6 py-16">
      <div
        className="w-full max-w-md text-center rounded-2xl p-10 relative"
        style={{
          background: "rgba(0,200,255,0.04)",
          border: "1px solid rgba(0,200,255,0.22)",
          boxShadow: "0 0 40px rgba(0,200,255,0.06)",
        }}
      >
        {/* corner brackets */}
        <div className="absolute top-0 left-0 w-6 h-6" style={{ borderTop: `2px solid ${CYAN}`, borderLeft: `2px solid ${CYAN}` }} />
        <div className="absolute top-0 right-0 w-6 h-6" style={{ borderTop: `2px solid ${CYAN}`, borderRight: `2px solid ${CYAN}` }} />
        <div className="absolute bottom-0 left-0 w-6 h-6" style={{ borderBottom: `2px solid ${CYAN}`, borderLeft: `2px solid ${CYAN}` }} />
        <div className="absolute bottom-0 right-0 w-6 h-6" style={{ borderBottom: `2px solid ${CYAN}`, borderRight: `2px solid ${CYAN}` }} />

        <div className="text-6xl mb-5">{icon}</div>

        <h2
          className="text-2xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.05em" }}
        >
          {title}
        </h2>

        <p className="text-gray-500 text-sm mb-8 leading-relaxed">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="flex-1 font-bold py-3 px-6 rounded-lg text-sm text-center transition-all hover:opacity-90"
            style={{
              background: CYAN,
              color: "white",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.08em",
              boxShadow: "0 0 14px rgba(0,200,255,0.35)",
            }}
          >
            LOG IN
          </Link>
          <Link
            to="/register"
            className="flex-1 font-bold py-3 px-6 rounded-lg text-sm text-center transition-colors border"
            style={{
              background: "transparent",
              color: "var(--cyber-text)",
              borderColor: "rgba(0,200,255,0.35)",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            CREATE ACCOUNT
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Free forever · No credit card required
        </p>
      </div>
    </div>
  );
}
