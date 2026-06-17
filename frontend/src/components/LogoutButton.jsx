import { logout } from "../utils/auth";

function LogoutButton() {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 text-sm font-bold tracking-widest transition-all hover:opacity-80"
      style={{
        color: "#FF0090",
        textShadow: "0 0 8px rgba(255,0,144,0.4)",
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.7rem",
      }}
    >
      [LOGOUT]
    </button>
  );
}

export default LogoutButton;
