import { Link } from "react-router-dom";

function Navbar() {

  return (
    <nav>

      <Link to="/">
        Rooms
      </Link>

      {" | "}

      <Link to="/login">
        Login
      </Link>

      {" | "}

      <Link to="/register">
        Register
      </Link>

      {" | "}
      
      <Link to="/recommendations">
        Recommendations
      </Link>


    </nav>
  );
}

export default Navbar;