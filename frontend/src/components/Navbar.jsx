import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Rooms</Link>

      {" | "}

      <Link to="/login">Login</Link>

      {" | "}

      <Link to="/register">Register</Link>

      {" | "}

      <Link to="/recommendations">Recommendations</Link>

      {" | "}

      <Link to="/interests">Interests</Link>

      {" | "}

      <Link to="/dashboard">Dashboard</Link>

      {" | "}

      <Link to="/profile">Profile</Link>

      {" | "}

      <Link to="/inbox">Inbox</Link>

      {" | "}

      <Link to="/messages/send">Send Message</Link>
    </nav>
  );
}

export default Navbar;
