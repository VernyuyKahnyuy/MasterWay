import { logout } from "../utils/auth";

function LogoutButton() {

  const handleLogout = () => {

    logout();

    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;