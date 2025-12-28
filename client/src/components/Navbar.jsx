import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Used<span style={{ color: "var(--accent)" }}>Cars</span>
        </div>

        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 600,
              color: isActive ? "var(--accent)" : "var(--primary)",
            })}
          >
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/sell"
                style={({ isActive }) => ({
                  fontWeight: 600,
                  color: isActive ? "var(--accent)" : "var(--primary)",
                })}
              >
                Sell a car
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--primary)",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => ({
                  fontWeight: 600,
                  color: isActive ? "var(--accent)" : "var(--primary)",
                })}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                style={({ isActive }) => ({
                  fontWeight: 600,
                  color: isActive ? "var(--accent)" : "var(--primary)",
                })}
              >
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
