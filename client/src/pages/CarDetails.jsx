import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarById } from "../api/cars.api";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCarById(id)
      .then(setCar)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="p-4">Loading car...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600">{error}</p>;
  }

  if (!car) {
    return <p className="p-4">Car not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{car.title}</h1>

      <p className="text-gray-600 mb-4">
        {car.brand} {car.model} • {car.year}
      </p>

      <p className="text-xl font-semibold mb-4">{car.price} €</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <p><strong>Mileage:</strong> {car.mileage} km</p>
        <p><strong>Fuel:</strong> {car.fuelType}</p>
        <p><strong>Gearbox:</strong> {car.gearbox}</p>
        <p><strong>Location:</strong> {car.location}</p>
      </div>

      {car.description && (
        <div className="mt-4">
          <h2 className="font-semibold mb-1">Description</h2>
          <p>{car.description}</p>
        </div>
      )}

      {car.owner && (
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold mb-1">Seller info</h2>
          <p>{car.owner.name}</p>
          <p className="text-sm text-gray-600">{car.owner.email}</p>
          {car.owner.phone && (
            <p className="text-sm">{car.owner.phone}</p>
          )}
        </div>
      )}
    </div>
  );
}
