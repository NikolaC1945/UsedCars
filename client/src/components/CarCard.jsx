import { Link } from "react-router-dom";

export default function CarCard({ car }) {
  return (
    <Link
      to={`/cars/${car.id}`}
      className="border rounded-lg p-4 hover:shadow"
    >
      <h2 className="font-bold">{car.title}</h2>
      <p className="text-sm text-gray-600">
        {car.brand} {car.model} • {car.year}
      </p>
      <p className="mt-2 font-semibold">{car.price} €</p>
      <p className="text-sm">{car.location}</p>
    </Link>
  );
}
