import { apiFetch } from "./api";

export async function fetchUsers() {
  return apiFetch("/users");
}

export async function updateUserRole(userId, role) {
  return apiFetch(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
