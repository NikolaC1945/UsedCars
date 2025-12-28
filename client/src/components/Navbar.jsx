import { NavLink } from "react-router-dom";

export default function Navbar() {
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

        <nav style={{ display: "flex", gap: 28 }}>
          {[
            { to: "/", label: "Home" },
            { to: "/sell", label: "Sell a car" },
            { to: "/logout", label: "Logout" },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                fontWeight: 600,
                color: isActive ? "var(--accent)" : "var(--primary)",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
