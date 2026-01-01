import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../api/cars.api";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCars()
      .then(setCars)
      .finally(() => setLoading(false));
  }, []);

  const filteredCars = brand
    ? cars.filter(c => c.brand === brand)
    : cars;

  return (
    <div className="w-full px-10 py-6">
      {/* =====================
          HERO SECTION (NEW)
         ===================== */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Find your next car
        </h1>
        <p className="text-gray-600">
          Browse used cars from verified sellers
        </p>
      </div>

      {/* =====================
          FILTERS (NEW)
         ===================== */}
      <div className="flex gap-4 mb-6">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All brands</option>
          {[...new Set(cars.map(c => c.brand))].map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* =====================
          LOADING / EMPTY (NEW)
         ===================== */}
      {loading && (
        <p className="text-gray-500">Loading cars...</p>
      )}

      {!loading && filteredCars.length === 0 && (
        <p className="text-gray-500">No cars available.</p>
      )}

      {/* =====================
          CARS GRID (EXISTING + UPGRADED CARD)
         ===================== */}
      <div className="grid md:grid-cols-3 gap-4">
        {filteredCars.map(car => (
          <div
            key={car.id}
            className="border rounded p-4 cursor-pointer hover:shadow"
            onClick={() => navigate(`/cars/${car.id}`)}
          >
            {/* IMAGE (NEW) */}
            <div className="w-full h-40 mb-3 overflow-hidden rounded bg-gray-100">
              {car.cover ? (
              <img
                src={`http://localhost:5000${car.cover}`}
                alt={car.title}
                className="w-full h-full object-cover"
              />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  No image
                </div>
              )}

            </div>

            {/* EXISTING TITLE */}
            <h2 className="font-medium leading-tight">
              {car.title}
            </h2>

            {/* META (NEW) */}
            <p className="text-sm text-gray-600 mt-1">
              {car.year} • {car.mileage} km • {car.fuelType}
            </p>

            {/* LOCATION (NEW) */}
            <p className="text-sm text-gray-500 mt-1">
              {car.location}
            </p>

            {/* PRICE (EXISTING, samo pomjereno) */}
            <div className="mt-3 font-semibold text-lg">
              €{car.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
