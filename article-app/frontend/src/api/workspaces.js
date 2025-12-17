const API_URL = "http://localhost:4000/workspaces";

export async function list() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch workspaces");
  return await res.json();
}

export async function get(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch workspace");
  return await res.json();
}

export async function create(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Create failed");
  return await res.json();
}

export async function update(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Update failed");
  return await res.json();
}

export async function remove(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
  return await res.json();
}
