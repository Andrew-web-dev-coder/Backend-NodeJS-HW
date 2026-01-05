import React, { useEffect, useState } from "react";
import { fetchUsers, updateUserRole } from "../../src/api/users";
import { getToken } from "../../src/auth";

/* ===== helpers ===== */

function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const currentUser = getUserFromToken();

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
   
    if (id === currentUser?.id) return;

    try {
      setUpdatingId(id);
      await updateUserRole(id, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, color: "white" }}>
        Loading users…
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 1000,
        margin: "0 auto",
        color: "white",
      }}
    >
      <h1 style={{ marginBottom: 24 }}>User Management</h1>

      <div
        style={{
          background: "#0e1320",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#111827",
                textAlign: "left",
              }}
            >
              <th style={th}>Email</th>
              <th style={th}>Current role</th>
              <th style={th}>Change role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, idx) => {
              const isSelf = u.id === currentUser?.id;

              return (
                <tr
                  key={u.id}
                  style={{
                    background:
                      idx % 2 === 0 ? "#0f172a" : "#020617",
                  }}
                >
                  <td style={td}>{u.email}</td>

                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        background:
                          u.role === "admin"
                            ? "#7c3aed"
                            : "#334155",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td style={td}>
                    <select
                      value={u.role}
                      disabled={updatingId === u.id || isSelf}
                      onChange={(e) =>
                        changeRole(u.id, e.target.value)
                      }
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "none",
                        outline: "none",
                        background: isSelf
                          ? "#334155"
                          : "#1e293b",
                        color: "white",
                        cursor: isSelf
                          ? "not-allowed"
                          : "pointer",
                        opacity: isSelf ? 0.6 : 1,
                      }}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>

                    {isSelf && (
                      <div
                        style={{
                          fontSize: 12,
                          opacity: 0.6,
                          marginTop: 6,
                        }}
                      >
                        You cannot change your own role
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= styles ================= */

const th = {
  padding: "14px 18px",
  fontWeight: 600,
  fontSize: 14,
  color: "#be8afefe",
};

const td = {
  padding: "14px 18px",
  fontSize: 14,
};
