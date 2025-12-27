import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCar } from "../api/cars.api";

export default function CreateCar() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuelType: "",
    gearbox: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage),
      images: [],
    };

    console.log("PAYLOAD SENT:", payload);

    try {
      await createCar(payload);
      navigate("/");
  } catch (err) {
      alert("Failed to create car");
      console.error(err);
  }
};


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Post a car</h1>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="brand" placeholder="Brand" onChange={handleChange} required />
        <input name="model" placeholder="Model" onChange={handleChange} required />
        <input name="year" type="number" placeholder="Year" onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price (€)" onChange={handleChange} required />
        <input name="mileage" type="number" placeholder="Mileage" onChange={handleChange} />
        <input name="fuelType" placeholder="Fuel type" onChange={handleChange} required/>
        <input name="gearbox" placeholder="Gearbox" onChange={handleChange} required />
        <input name="location" placeholder="Location" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} />

        <button className="bg-black text-white py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
