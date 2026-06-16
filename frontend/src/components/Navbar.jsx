import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("access");
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive(to)
          ? "bg-violet-50 text-violet-700"
          : "text-gray-600 hover:text-violet-700 hover:bg-violet-50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-6 h-16">
        <Link
          to="/"
          className="text-xl font-bold text-violet-700 tracking-tight flex items-center gap-2"
        >
          <span className="bg-violet-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
            L
          </span>
          LearnRoom
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLink("/", "Rooms")}
          {navLink("/recommendations", "Discover")}
          {navLink("/interests", "Interests")}
          {navLink("/feed", "Feed")}

          {isLoggedIn && (
            <>
              {navLink("/dashboard", "Dashboard")}
              {navLink("/expert", "Expert_Mode")}
              {navLink("/inbox", "Inbox")}
              {navLink("/profile", "Profile")}
              <LogoutButton />
            </>
          )}

          {!isLoggedIn && (
            <>
              {navLink("/login", "Login")}
              <Link
                to="/register"
                className="ml-2 px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-1 bg-white shadow-md">
          {navLink("/", "Rooms")}
          {navLink("/recommendations", "Discover")}
          {navLink("/interests", "Interests")}
          {navLink("/feed", "Feed")}

          {isLoggedIn && (
            <>
              {navLink("/dashboard", "Dashboard")}
              {navLink("/expert", "Expert")}
              {navLink("/inbox", "Inbox")}
              {navLink("/profile", "Profile")}
              <LogoutButton />
            </>
          )}

          {!isLoggedIn && (
            <>
              {navLink("/login", "Login")}
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors text-center"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
