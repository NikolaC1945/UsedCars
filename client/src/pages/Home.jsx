import { useEffect, useState } from "react";
import { getCars } from "../api/cars.api";
import CarCard from "../components/CarCard";

export default function Home() {

  useEffect(() => {
  getCars()
    .then((data) => {
      console.log("CARS FROM API:", data);
      setCars(data);
    })
    .catch((err) => {
      console.error("FETCH ERROR:", err);
    })
    .finally(() => setLoading(false));
}, []);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-4">Loading cars...</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
