import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="mt-20 border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-10 py-8 flex flex-col md:flex-row justify-between gap-6">
        {/* LEFT */}
        <div>
          <h2 className="font-bold text-lg">UsedCars</h2>
          <p className="text-sm text-gray-600 mt-1">
            Platform for buying and selling vehicles
          </p>
          <p className="text-xs text-gray-500 mt-3">
            © 2026 UsedCars
          </p>
        </div>

        {/* LINKS */}
        <div className="flex gap-6 text-sm items-start">
          <Link to="/" className="hover:underline text-gray-700">
            Home
          </Link>

          {isAuthenticated && (
            <Link to="/profile" className="hover:underline text-gray-700">
              Profile
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
