import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../shared/ui/button/Button.jsx";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      
      const data = await res.json();

      
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit">Register</Button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
