import React from "react";
import { Link } from "react-router-dom";
import Button from "../button/Button";


export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "#0e1320",
        color: "white",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
        }}
      >
        Auto articles 🚗
      </Link>

      <Link to="/create" style={{ textDecoration: "none" }}>
        <Button>➕ Create Article</Button>
      </Link>
    </header>
  );
}
