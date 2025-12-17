const API_URL = "http://localhost:4000/articles";

export async function get(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch article");
  return await res.json();
}

export async function list() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch list");
  return await res.json();
}

export async function createWithFiles(data) {
  const form = new FormData();
  form.append("title", data.title);
  form.append("content", data.content);

  if (data.workspaceId) {
    form.append("workspaceId", data.workspaceId);
  }

  (data.files || []).forEach((f) => form.append("files", f));

  const res = await fetch(API_URL, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Create failed");
  return await res.json();
}

export async function updateWithFiles(id, data) {
  const form = new FormData();
  form.append("title", data.title);
  form.append("content", data.content);

  if (data.workspaceId) {
    form.append("workspaceId", data.workspaceId);
  }

  (data.files || []).forEach((f) => form.append("files", f));

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: form,
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

// COMMENTS
export async function listComments(articleId) {
  const res = await fetch(`${API_URL}/${articleId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return await res.json();
}

export async function createComment(articleId, text) {
  const res = await fetch(`${API_URL}/${articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to create comment");
  return await res.json();
}
