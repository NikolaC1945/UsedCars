import apiFetch from "./api";

export async function login(credentials) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export async function register(payload) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getStoredUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
