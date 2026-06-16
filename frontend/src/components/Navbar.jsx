import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const isLoggedIn = !!localStorage.getItem("access");
  const location = useLocation();

  const navLink = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          active
            ? "bg-violet-50 text-violet-700"
            : "text-gray-600 hover:text-violet-700 hover:bg-violet-50"
        }`}
      >
        {label}
      </Link>
    );
  };

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

        <div className="flex items-center gap-1">
          {navLink("/", "Rooms")}
          {navLink("/recommendations", "Discover")}
          {navLink("/interests", "Interests")}

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
                className="ml-2 px-4 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
