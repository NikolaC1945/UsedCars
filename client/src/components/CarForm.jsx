import { useEffect, useRef, useState } from "react";
import { deleteCarImage } from "../api/cars.api";

const API_URL = "http://localhost:5000";

export default function CarForm({ initialData, onSubmit, submitText }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    fuelType: "",
    gearbox: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]); // string | File
  const [cover, setCover] = useState(null);
  const dragIndex = useRef(null);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData.title || "",
      price: initialData.price || "",
      brand: initialData.brand || "",
      model: initialData.model || "",
      year: initialData.year || "",
      mileage: initialData.mileage || "",
      fuelType: initialData.fuelType || "",
      gearbox: initialData.gearbox || "",
      location: initialData.location || "",
      description: initialData.description || "",
    });

    setImages(initialData.images || []);
    setCover(initialData.coverImage || initialData.images?.[0] || null);
  }, [initialData]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleDrop(i) {
    const copy = [...images];
    const dragged = copy.splice(dragIndex.current, 1)[0];
    copy.splice(i, 0, dragged);
    dragIndex.current = null;
    setImages(copy);
  }

  function imageSrc(img) {
    return img instanceof File
      ? URL.createObjectURL(img)
      : `${API_URL}${img}`;
  }

  async function handleDelete(img) {
    if (typeof img === "string") {
      await deleteCarImage(initialData.id, img);
    }

    setImages(prev => prev.filter(i => i !== img));

    if (cover === img) {
      setCover(null);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();

    // normal fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // existing images (KEEP ORDER)
    const existingImages = images.filter(img => typeof img === "string");
    fd.append("existingImages", JSON.stringify(existingImages));

    // new images only
    images.forEach(img => {
      if (img instanceof File) {
        fd.append("images", img);
      }
    });

    // cover must be STRING (existing image)
    if (cover && typeof cover === "string") {
      fd.append("coverImage", cover);
    }

    onSubmit(fd);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full px-6 py-6">
      <h1 className="text-xl font-semibold mb-4">Edit car</h1>

      {/* PHOTOS */}
      <section className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="font-medium">Photos</h2>
          <span className="text-xs text-gray-400">Drag to reorder</span>
        </div>

        <div className="flex gap-4 items-start">
          {images.map((img, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className="w-40"
            >
              <div className="relative">
                <img
                  src={imageSrc(img)}
                  className="w-full h-28 object-cover rounded border"
                />

                {cover === img && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                    COVER
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setCover(img)}
                  className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                >
                  Set cover
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(img)}
                  className="px-3 py-1 text-xs rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <label className="w-40 h-28 border border-dashed rounded flex items-center justify-center text-gray-400 cursor-pointer">
            + Add photos
            <input
              type="file"
              multiple
              hidden
              onChange={e =>
                setImages(prev => [...prev, ...Array.from(e.target.files)])
              }
            />
          </label>
        </div>
      </section>

      {/* FORM */}
      <section className="grid grid-cols-4 gap-x-4 gap-y-4">
        <Input label="Title" name="title" value={form.title} onChange={handleChange} />
        <Input label="Price (€)" name="price" value={form.price} onChange={handleChange} />
        <Input label="Brand" name="brand" value={form.brand} onChange={handleChange} />
        <Input label="Model" name="model" value={form.model} onChange={handleChange} />

        <Input label="Year" name="year" value={form.year} onChange={handleChange} />
        <Input label="Mileage (km)" name="mileage" value={form.mileage} onChange={handleChange} />
        <Input label="Fuel type" name="fuelType" value={form.fuelType} onChange={handleChange} />
        <Input label="Gearbox" name="gearbox" value={form.gearbox} onChange={handleChange} />

        <Input label="Location" name="location" value={form.location} onChange={handleChange} />

        <div className="col-span-4">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full h-24 border rounded px-3 py-2"
          />
        </div>
      </section>

      <button
        type="submit"
        className="mt-6 bg-slate-900 text-white px-6 py-3 rounded"
      >
        {submitText}
      </button>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input {...props} className="w-full h-9 border rounded px-3" />
    </div>
  );
}
