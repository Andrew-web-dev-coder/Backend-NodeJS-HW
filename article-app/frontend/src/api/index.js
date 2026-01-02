import { setToken, getToken } from "../auth";

const API_URL = "http://localhost:4000/articles";
const AUTH_URL = "http://localhost:4000/auth";


  // 401 HANDLER


function handle401(res) {
  if (res.status === 401) {
    console.warn(" 401 Unauthorized → redirect to /login");
    localStorage.removeItem("jwt_token");
    window.location.href = "/login";
    return true;
  }
  return false;
}


  // AUTH


export async function login(email, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  const data = await res.json();
  setToken(data.token);

  console.log("TOKEN SAVED:", data.token);
  return data;
}


  // HELPERS


function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


  // ARTICLES


export async function list() {
  const res = await fetch(API_URL, {
    headers: authHeaders(),
  });

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Failed to fetch list");

  return await res.json();
}

export async function get(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: authHeaders(),
  });

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Failed to fetch article");

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
    headers: authHeaders(),
    body: form,
  });

  if (handle401(res)) return;
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
    headers: authHeaders(),
    body: form,
  });

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Update failed");

  return await res.json();
}

export async function remove(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Delete failed");

  return await res.json();
}


  // COMMENTS


export async function listComments(articleId) {
  const res = await fetch(`${API_URL}/${articleId}/comments`, {
    headers: authHeaders(),
  });

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Failed to fetch comments");

  return await res.json();
}

export async function createComment(articleId, text) {
  const res = await fetch(`${API_URL}/${articleId}/comments`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ text }),
  });

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Failed to create comment");

  return await res.json();
}


  // VERSIONS


export async function listVersions(articleId) {
  const res = await fetch(`${API_URL}/${articleId}/versions`, {
    headers: authHeaders(),
  });

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Failed to fetch versions");

  return await res.json();
}

export async function getVersion(articleId, version) {
  const res = await fetch(
    `${API_URL}/${articleId}/versions/${version}`,
    {
      headers: authHeaders(),
    }
  );

  if (handle401(res)) return;
  if (!res.ok) throw new Error("Failed to fetch version");

  return await res.json();
}
