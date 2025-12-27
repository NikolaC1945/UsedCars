import { createContext, useContext, useEffect, useState } from "react";
import { getToken, logout as apiLogout } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 runs once on app load / refresh
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  function login(token) {
    setToken(token); // 🔥 THIS IS WHAT WAS MISSING
  }

  function logout() {
    apiLogout();
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
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
