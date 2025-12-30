import React, { useEffect, useRef, useState } from "react";
import { deleteCarImage } from "../api/cars.api";

const API_URL = "http://localhost:5000";

/* =====================
   CONSTANTS
===================== */
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 1950 + 1 },
  (_, i) => CURRENT_YEAR - i
);

const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
const GEARBOX_TYPES = ["Manual", "Automatic"];

export default function CarForm({ initialData, onSubmit, submitText }) {
  const titleRef = useRef(null);
  const dragIndex = useRef(null);

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

  const [images, setImages] = useState([]);
  const [cover, setCover] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  /* =====================
     INIT DATA (EDIT)
  ===================== */
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
    setCover(initialData.cover || initialData.images?.[0] || null);
  }, [initialData]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitted) setErrors(validate({ ...form, [e.target.name]: e.target.value }));
  }

  /* =====================
     VALIDATION
  ===================== */
  function validate(values) {
    const e = {};

    if (values.title.trim().length < 5)
      e.title = "Title must be at least 5 characters";

    if (!values.brand.trim()) e.brand = "Brand is required";
    if (!values.model.trim()) e.model = "Model is required";

    if (!YEARS.includes(Number(values.year)))
      e.year = "Select a valid year";

    if (!values.price || Number(values.price) <= 0)
      e.price = "Enter a valid price";

    if (values.mileage === "" || Number(values.mileage) < 0)
      e.mileage = "Mileage cannot be negative";

    if (!FUEL_TYPES.includes(values.fuelType))
      e.fuelType = "Select fuel type";

    if (!GEARBOX_TYPES.includes(values.gearbox))
      e.gearbox = "Select gearbox";

    if (values.location.trim().length < 2)
      e.location = "Location is required";

    return e;
  }

  /* =====================
     SUBMIT
  ===================== */
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const existingImages = images.filter(img => typeof img === "string");
    fd.append("existingImages", JSON.stringify(existingImages));

    images.forEach(img => {
      if (img instanceof File) fd.append("images", img);
    });

    if (cover && typeof cover === "string") {
      fd.append("cover", cover);
    }

    onSubmit(fd);
  }

  function showError(name) {
    return submitted && errors[name];
  }

  async function handleDelete(img) {
    if (typeof img === "string" && initialData) {
      await deleteCarImage(initialData.id, img);
    }
    setImages(prev => prev.filter(i => i !== img));
    if (cover === img) setCover(null);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full px-6 py-6">
      {/* PHOTOS */}
      <section className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="font-medium">Photos</h2>
          <span className="text-xs text-gray-400">Optional • Drag to reorder</span>
        </div>

        <div className="flex gap-4 items-start flex-wrap">
          {images.map((img, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                const copy = [...images];
                const dragged = copy.splice(dragIndex.current, 1)[0];
                copy.splice(i, 0, dragged);
                setImages(copy);
              }}
              className="w-40"
            >
              <div className="relative">
                <img
                  src={img instanceof File ? URL.createObjectURL(img) : `${API_URL}${img}`}
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
                  Set as cover
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
        <Input ref={titleRef} label="Title" name="title" value={form.title} onChange={handleChange} error={showError("title")} />
        <Input label="Price (€)" name="price" type="number" value={form.price} onChange={handleChange} error={showError("price")} />
        <Input label="Brand" name="brand" value={form.brand} onChange={handleChange} error={showError("brand")} />
        <Input label="Model" name="model" value={form.model} onChange={handleChange} error={showError("model")} />

        <YearDropdown
          value={form.year}
          onChange={year => {
            setForm(p => ({ ...p, year }));
            if (submitted) setErrors(validate({ ...form, year }));
          }}
          error={showError("year")}
        />

        <Input label="Mileage (km)" name="mileage" type="number" value={form.mileage} onChange={handleChange} error={showError("mileage")} />

        <Select label="Fuel type" value={form.fuelType} options={FUEL_TYPES} onChange={v => setForm(p => ({ ...p, fuelType: v }))} error={showError("fuelType")} />
        <Select label="Gearbox" value={form.gearbox} options={GEARBOX_TYPES} onChange={v => setForm(p => ({ ...p, gearbox: v }))} error={showError("gearbox")} />

        <Input label="Location" name="location" value={form.location} onChange={handleChange} error={showError("location")} />

        <div className="col-span-4">
          <label className="block text-sm mb-1">Description (optional)</label>
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
        className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded"
      >
        {submitText}
      </button>
    </form>
  );
}

/* =====================
   COMPONENTS
===================== */
const Input = React.forwardRef(({ label, error, ...props }, ref) => (
  <div>
    <label className="block text-sm mb-1">{label}</label>
    <input ref={ref} {...props} className={`w-full h-9 border rounded px-3 ${error ? "border-red-500" : ""}`} />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
));

function Select({ label, value, options, onChange, error }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className={`w-full h-9 border rounded px-3 ${error ? "border-red-500" : ""}`}>
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function YearDropdown({ value, onChange, error }) {
  const [query, setQuery] = useState(value ? String(value) : "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) setQuery(String(value));
  }, [value]);

  function getVisibleYears() {
    if (!query) return YEARS.slice(0, 7);
    const q = Number(query);
    if (!YEARS.includes(q)) return [];
    const idx = YEARS.indexOf(q);
    const start = Math.max(0, idx - 3);
    return YEARS.slice(start, start + 7);
  }

  function handleBlur() {
    if (!YEARS.includes(Number(query))) {
      setQuery("");
      onChange("");
    }
    setOpen(false);
  }

  return (
    <div className="relative">
      <label className="block text-sm mb-1">Year</label>
      <input
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        className={`w-full h-9 border rounded px-3 ${error ? "border-red-500" : ""}`}
      />

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-52 overflow-y-auto">
          {getVisibleYears().map(y => (
            <div
              key={y}
              onMouseDown={() => {
                setQuery(String(y));
                onChange(y);
                setOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {y}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
