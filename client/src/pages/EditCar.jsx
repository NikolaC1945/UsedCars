import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarById, updateCar } from "../api/cars.api";
import CarForm from "../components/CarForm";

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    getCarById(id).then(setCar);
  }, [id]);

  async function handleUpdate(formData) {
    await updateCar(id, formData);
    navigate(`/cars/${id}`);
  }

  if (!car) return null;

  return (
    <CarForm
      initialData={car}
      onSubmit={handleUpdate}
      submitText="Save changes"
    />
  );
}
