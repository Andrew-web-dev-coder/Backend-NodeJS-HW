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


export async function removeAttachment(id, filename) {
  const res = await fetch(`${API_URL}/${id}/attachments/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Attachment delete failed");
  return await res.json();
}

