import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../api/favorites.api";

const API_URL = "http://localhost:5000";

export default function CarCard({ car }) {
  const { user } = useAuth();

  // inicijalno stanje dolazi iz backend-a
  const [isSaved, setIsSaved] = useState(Boolean(car.isFavorite));

  // sync ako se car refetch-uje
  useEffect(() => {
    setIsSaved(Boolean(car.isFavorite));
  }, [car.isFavorite]);

  async function handleToggleFavorite(e) {
    e.preventDefault();   // sprječava Link navigation
    e.stopPropagation();  // sprječava klik na karticu

    try {
      const res = await toggleFavorite(car.id);
      setIsSaved(res.favorited);
    } catch (err) {
      console.error("Toggle favorite failed", err);
    }
  }

  return (
    <Link
      to={`/cars/${car.id}`}
      className="relative border rounded-lg overflow-hidden hover:shadow transition"
    >
      {/* IMAGE */}
      <div className="relative w-full h-44 bg-gray-100">
        {car.cover ? (
          <img
            src={`${API_URL}${car.cover}`}
            alt={car.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}

        {/* ❤️ FAVORITE — ISTO KAO U CarDetails.jsx */}
        {user && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              color: isSaved ? "red" : "#fff",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ♥
          </button>
        )}

        {/* SOLD BADGE */}
        {car.isSold && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
            SOLD
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="p-4">
        <h2 className="font-medium">{car.title}</h2>

        <p className="text-sm text-gray-600 mt-1">
          {car.year} • {car.mileage} km • {car.fuelType}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          {car.location}
        </p>

        <div className="mt-2 font-semibold text-lg">
          €{car.price}
        </div>
      </div>
    </Link>
  );
}
