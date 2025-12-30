import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const API_URL = "http://localhost:5000";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("active"); // active | sold
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get(`/cars/my?status=${activeTab}`)
      .then(res => setCars(res.data))
      .finally(() => setLoading(false));
  }, [activeTab]);

  async function handleMarkAsSold(id) {
    await api.patch(`/cars/${id}/sold`);
    setCars(prev => prev.filter(c => c.id !== id));
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this car?")) return;
    await api.delete(`/cars/${id}`);
    setCars(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="w-full px-10 py-6">
      {/* USER SUMMARY */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Profile</h1>
        <p className="text-gray-600">{user?.name}</p>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {["active", "sold"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded font-medium transition ${
              activeTab === tab
                ? "bg-slate-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab === "active" ? "Active" : "Sold"}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading && <p className="text-gray-500">Loading cars...</p>}

      {!loading && cars.length === 0 && (
        <p className="text-gray-500 mt-10">
          {activeTab === "sold"
            ? "You don’t have any sold cars yet."
            : "You don’t have any active listings."}
        </p>
      )}

      {!loading && cars.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {cars.map(car => (
            <div
              key={car.id}
              className="group relative border rounded overflow-hidden cursor-pointer"
            >
              {/* IMAGE */}
              <div className="relative w-full h-44">
                {car.cover ? (
                  <img
                    src={`${API_URL}${car.cover}`}
                    alt={car.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:blur-sm"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No image
                  </div>
                )}

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <div className="flex flex-col gap-3">
                    <ActionButton
                      label="View"
                      onClick={() => navigate(`/cars/${car.id}`)}
                    />

                    {activeTab === "active" && (
                      <ActionButton
                        label="Mark as sold"
                        variant="primary"
                        onClick={() => handleMarkAsSold(car.id)}
                      />
                    )}

                    <ActionButton
                      label="Delete"
                      variant="danger"
                      onClick={() => handleDelete(car.id)}
                    />
                  </div>
                </div>
              </div>

              {/* INFO */}
              <div className="p-4">
                <h2 className="font-medium">{car.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {car.year} • {car.mileage} km • {car.fuelType}
                </p>
                <div className="mt-2 font-semibold text-lg">
                  €{car.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =======================
   ACTION BUTTON
======================= */
function ActionButton({ label, onClick, variant = "default" }) {
  const base =
    "px-5 py-2 rounded text-sm font-medium transition w-40";

  const styles = {
    default:
      "bg-white text-gray-900 hover:bg-gray-100",
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      className={`${base} ${styles[variant]}`}
    >
      {label}
    </button>
  );
}
