import { useNavigate } from "react-router-dom";
import CarForm from "../components/CarForm";
import { createCar } from "../api/cars.api";

export default function CreateCar() {
  const navigate = useNavigate();

  async function handleCreate(data) {
    const car = await createCar(data);
    navigate(`/cars/${car.id}`);
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sell a car</h1>
      <CarForm onSubmit={handleCreate} submitText="Publish" />
    </div>
  );
}
