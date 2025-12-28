import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     RESTORE SESSION ON LOAD
     ========================= */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // 🔑 attach token to axios
      api.defaults.headers.common["Authorization"] =
        `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGIN
     ========================= */
  function login(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);

    // 🔑 attach token immediately
    api.defaults.headers.common["Authorization"] =
      `Bearer ${token}`;
  }

  /* =========================
     LOGOUT
     ========================= */
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    // 🔥 remove token from axios
    delete api.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
