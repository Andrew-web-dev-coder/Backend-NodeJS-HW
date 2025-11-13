const API_URL = "http://localhost:4000/articles";

export const api = {
  async list() {
    const res = await fetch(API_URL);
    return res.json();
  },
  async get(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Error fetching article");
    return res.json();
  },
  async post(data) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error creating article");
    return res.json();
  },
};
