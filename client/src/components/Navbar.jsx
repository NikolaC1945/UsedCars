import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link to="/">Home</Link>

      {isAuthenticated && (
        <Link to="/sell">Sell a car</Link>
      )}

      {!isAuthenticated && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {isAuthenticated && (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
}
