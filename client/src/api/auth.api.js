import api from "./api";

export async function login(credentials) {
  const res = await api.post("/auth/login", credentials);
  return res.data;
}

export async function register(payload) {
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
