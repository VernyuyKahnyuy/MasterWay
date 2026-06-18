import { Link, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import LogoutButton from "./LogoutButton";

/* Neon bright — used ONLY for backgrounds and decorative glows.
   White text sits on these so contrast is fine. */
const CYBER_NEON = "#00C8FF";

/* CSS variable — dark teal (#006699) in light mode, full neon in dark mode.
   Use this anywhere text must be readable on a white/light surface. */
const CYBER_TEXT = "var(--cyber-text)";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("access");
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const navLink = (to, label) => {
    const active = isActive(to);
    return (
      <Link
        key={to}
        to={to}
        onClick={() => setMenuOpen(false)}
        className="relative px-3 py-2 text-sm font-medium tracking-widest transition-colors duration-200"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          /* text: use the accessible shade; inactive handled by className */
          color: active ? CYBER_TEXT : undefined,
          textShadow: active ? "0 0 8px rgba(0,200,255,0.45)" : undefined,
        }}
      >
        {!active && (
          /* inactive — hover to cyber-text color via Tailwind */
          <span
            className="text-gray-500 transition-colors"
            style={{ "--tw-text-opacity": 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyber-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            {label}
          </span>
        )}
        {active && label}
        {active && (
          /* underline bar stays neon — decorative, not text */
          <span
            className="absolute bottom-0 left-2 right-2 h-[2px]"
            style={{
              background: CYBER_NEON,
              boxShadow: `0 0 6px ${CYBER_NEON}, 0 0 14px rgba(0,200,255,0.45)`,
            }}
          />
        )}
      </Link>
    );
  };

  const ThemeToggle = ({ mobile = false }) => (
    <button
      onClick={toggleTheme}
      className={`${mobile ? "p-2" : "ml-2 p-2"} rounded transition-colors hover:bg-gray-100`}
      style={{ color: CYBER_TEXT }}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to night mode"}
    >
      {theme === "dark" ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );

  return (
    <nav
      className="sticky top-0 z-50 bg-white border-b shadow-sm"
      style={{ borderColor: "rgba(0,200,255,0.2)" }}
    >
      <div className="flex items-center justify-between px-6 h-16">
        {/* ── Logo ── */}
        <Link to="/about" className="flex items-center gap-2.5 group shrink-0">
          {/* badge bg stays neon — white text on it */}
          <span
            className="flex items-center justify-center w-8 h-8 rounded text-white text-xs font-bold"
            style={{
              background: CYBER_NEON,
              boxShadow: "0 0 12px rgba(0,200,255,0.5)",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            MW
          </span>
          <span
            className="text-lg font-bold tracking-widest text-gray-900 hidden sm:block transition-colors"
            style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.12em" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyber-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            MASTER
            {/* "WAY" uses the accessible text variable, not raw neon */}
            <span style={{ color: CYBER_TEXT }}>WAY</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLink("/", "ROOMS")}
          {navLink("/recommendations", "DISCOVER")}
          {navLink("/interests", "INTERESTS")}
          {navLink("/feed", "FEED")}

          {isLoggedIn && (
            <>
              {navLink("/dashboard", "DASHBOARD")}
              {navLink("/expert", "EXPERT_MODE")}
              {navLink("/inbox", "INBOX")}
              {navLink("/profile", "PROFILE")}
              <LogoutButton />
            </>
          )}

          {!isLoggedIn && (
            <>
              {navLink("/login", "LOGIN")}
              {/* button background is neon — white text on top, contrast OK */}
              <Link
                to="/register"
                className="ml-3 px-4 py-1.5 text-sm font-bold text-white tracking-widest rounded transition-all hover:opacity-90"
                style={{
                  background: CYBER_NEON,
                  boxShadow: "0 0 14px rgba(0,200,255,0.4)",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                ACCESS
              </Link>
            </>
          )}

          <ThemeToggle />
        </div>

        {/* ── Mobile controls ── */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle mobile />
          <button
            className="p-2 rounded text-gray-500 transition-colors"
            style={{}}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyber-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1 bg-white shadow-md"
          style={{ borderColor: "rgba(0,200,255,0.2)" }}
        >
          {navLink("/", "ROOMS")}
          {navLink("/recommendations", "DISCOVER")}
          {navLink("/interests", "INTERESTS")}
          {navLink("/feed", "FEED")}

          {isLoggedIn && (
            <>
              {navLink("/dashboard", "DASHBOARD")}
              {navLink("/expert", "EXPERT_MODE")}
              {navLink("/inbox", "INBOX")}
              {navLink("/profile", "PROFILE")}
              <LogoutButton />
            </>
          )}

          {!isLoggedIn && (
            <>
              {navLink("/login", "LOGIN")}
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm font-bold text-white text-center tracking-widest rounded"
                style={{ background: CYBER_NEON, fontFamily: "'Rajdhani', sans-serif" }}
              >
                ACCESS
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
