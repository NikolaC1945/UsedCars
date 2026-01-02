import { useEffect, useState } from "react";
import { getCars } from "../api/cars.api";
import CarCard from "../components/CarCard";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState("");

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
      {/* HERO */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Find your next car
        </h1>
        <p className="text-gray-600">
          Browse used cars from verified sellers
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-4 mb-6">
        <select
          value={brand}
          onChange={e => setBrand(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All brands</option>
          {[...new Set(cars.map(c => c.brand))].map(b => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* LOADING / EMPTY */}
      {loading && (
        <p className="text-gray-500">Loading cars...</p>
      )}

      {!loading && filteredCars.length === 0 && (
        <p className="text-gray-500">No cars available.</p>
      )}

      {/* GRID */}
      {!loading && filteredCars.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
