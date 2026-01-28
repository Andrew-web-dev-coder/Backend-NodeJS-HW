import { setToken, getToken, removeToken } from "../auth";

const API_ROOT = "http://localhost:4000";
const API_URL = `${API_ROOT}/articles`;
const AUTH_URL = `${API_ROOT}/auth`;

// ========================
// 401 HANDLER
// ========================

function handle401(res) {
  if (res.status === 401) {
    console.warn("401 Unauthorized → redirect to /login");
    removeToken(); 
    window.location.href = "/login";
    return true;
  }
  return false;
}

// ========================
// AUTH
// ========================

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

// ========================
// HELPERS
// ========================

function authHeaders(extra = {}) {  
  const token = getToken();

  console.log("TOKEN USED (authHeaders):", token); 

  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ========================
// ARTICLES
// ========================

export async function list(search = "") {
  const query = search
    ? `?search=${encodeURIComponent(search)}`
    : "";

  console.log("TOKEN USED (list):", getToken());
  console.log("REQUEST URL:", `${API_URL}${query}`);

  const res = await fetch(`${API_URL}${query}`, {
    headers: authHeaders(),
  });

  if (handle401(res)) return [];
  if (!res.ok) throw new Error("Failed to fetch articles");

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

  (data.files || []).forEach((f) => form.append("files", f));

  const token = getToken();

  const res = await fetch(`http://localhost:4000/articles/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("UPDATE FAILED:", text);
    throw new Error("Update failed");
  }

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

// ========================
// COMMENTS
// ========================

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

// ========================
// VERSIONS
// ========================

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
