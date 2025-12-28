import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars } from "../api/cars.api";

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
            className="border rounded p-4 cursor-pointer hover:shadow"
            onClick={() => navigate(`/cars/${car.id}`)}
          >
            <h2 className="font-medium">{car.title}</h2>

            <p className="text-sm text-gray-600 mt-2">
              {car.brand} {car.model}
            </p>

            <div className="mt-4 font-semibold">
              €{car.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
