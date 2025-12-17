import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../button/Button";

const API = "http://localhost:4000";

export default function Header() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loadingWs, setLoadingWs] = useState(false);
  const [wsError, setWsError] = useState("");

  const [current, setCurrent] = useState(localStorage.getItem("workspaceId") || "");
  const [newWsName, setNewWsName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentWs = useMemo(
    () => workspaces.find((w) => String(w.id) === String(current)),
    [workspaces, current]
  );

  async function loadWorkspaces() {
    setLoadingWs(true);
    setWsError("");
    try {
      const res = await fetch(`${API}/workspaces`);
      if (!res.ok) throw new Error("Failed to load workspaces");
      const data = await res.json();
      setWorkspaces(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setWsError("Failed to load workspaces");
    } finally {
      setLoadingWs(false);
    }
  }

  useEffect(() => {
    loadWorkspaces();
  }, []);

  function handleChange(e) {
    const id = e.target.value;
    setCurrent(id);
    localStorage.setItem("workspaceId", id);

    
    window.dispatchEvent(new Event("workspaceChanged"));
  }

  async function handleCreateWorkspace() {
    const name = newWsName.trim();
    if (name.length < 2) return;

    setCreating(true);
    setWsError("");
    try {
      const res = await fetch(`${API}/workspaces`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create workspace");

      const created = await res.json();
      await loadWorkspaces();

      
      const newId = String(created.id);
      setCurrent(newId);
      localStorage.setItem("workspaceId", newId);
      window.dispatchEvent(new Event("workspaceChanged"));

      setNewWsName("");
    } catch (e) {
      console.error(e);
      setWsError("Failed to create workspace");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteWorkspace() {
    if (!current) return; 
    if (!currentWs) return;

    const ok = window.confirm(`Delete workspace "${currentWs.name}"?`);
    if (!ok) return;

    setDeleting(true);
    setWsError("");
    try {
      const res = await fetch(`${API}/workspaces/${current}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete workspace");

      
      setCurrent("");
      localStorage.setItem("workspaceId", "");
      window.dispatchEvent(new Event("workspaceChanged"));

      await loadWorkspaces();
    } catch (e) {
      console.error(e);
      setWsError("Failed to delete workspace");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        backgroundColor: "#0e1320",
        color: "white",
        gap: 16,
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          whiteSpace: "nowrap",
        }}
      >
        Auto articles 🚗
      </Link>

      
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <select
          value={current}
          onChange={handleChange}
          disabled={loadingWs}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            minWidth: 200,
          }}
        >
          <option value="">All workspaces</option>
          {workspaces.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        <input
          value={newWsName}
          onChange={(e) => setNewWsName(e.target.value)}
          placeholder="New workspace name..."
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            minWidth: 220,
          }}
        />

        <Button type="button" onClick={handleCreateWorkspace} disabled={creating}>
          {creating ? "Creating..." : "Add"}
        </Button>

        <Button type="button" onClick={handleDeleteWorkspace} disabled={!current || deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>

        {wsError && <span style={{ color: "#ffb4b4" }}>{wsError}</span>}
      </div>

      <Link to="/create" style={{ textDecoration: "none", whiteSpace: "nowrap" }}>
        <Button>➕ Create Article</Button>
      </Link>
    </header>
  );
}
