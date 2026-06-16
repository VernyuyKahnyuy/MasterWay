import { logout } from "../utils/auth";

function LogoutButton() {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
