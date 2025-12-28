import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../api/cars.api";

const API_URL = "http://localhost:5000";

export default function Home() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCars().then(setCars);
  }, []);

  return (
    <div className="w-full px-10 py-6">
      <h1 className="text-2xl font-semibold mb-6">Cars</h1>

      <div className="grid grid-cols-3 gap-6">
        {cars.map(car => (
          <div
            key={car.id}
            onClick={() => navigate(`/cars/${car.id}`)}
            className="
              max-w-sm
              border rounded-lg overflow-hidden bg-white
              cursor-pointer
              transition
              hover:shadow-lg
            "
          >
            {/* IMAGE */}
            <div className="h-36 bg-gray-100">
              {car.cover ? (
                <img
                  src={`${API_URL}${car.cover}`}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h2 className="font-medium text-base mb-1">
                {car.title}
              </h2>

              <div className="text-base font-semibold">
                €{car.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
