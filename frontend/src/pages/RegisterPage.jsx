import { useState } from "react";
import { registerUser } from "../services/authService";

function RegisterPage() {

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("learner");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await registerUser(
        username,
        email,
        password,
        role
      );

      alert("Registration successful");

    } catch (error) {

      console.error(error);

      alert("Registration failed");
    }
  };

  return (
    <div>

      <h1>Register</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >

          <option value="learner">
            Learner
          </option>

          <option value="expert">
            Expert
          </option>

        </select>

        <br />

        <button type="submit">
          Register
        </button>

      </form>

      <Login/>

    </div>
  );

}

function Login ()
{
  return (
    <div> Hello login </div>
  )
}

export default RegisterPage;