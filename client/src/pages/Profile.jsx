import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const API_URL = "http://localhost:5000";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  // ako nema userId → moj profil
  const isOwnProfile = !userId || String(userId) === String(user?.id);

  const [activeTab, setActiveTab] = useState("active");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // korisnik čiji se profil gleda
  const [profileUser, setProfileUser] = useState(null);

  // stats (nezavisno od taba)
  const [stats, setStats] = useState({
    active: 0,
    sold: 0,
    total: 0,
  });

  /* =======================
     FETCH PROFILE USER
  ======================= */
  useEffect(() => {
    if (isOwnProfile) {
      setProfileUser(user);
      return;
    }

    api
      .get(`/users/${userId}`)
      .then(res => setProfileUser(res.data))
      .catch(() => setProfileUser(null));
  }, [isOwnProfile, userId, user]);

  /* =======================
     FETCH STATS (SAMO MOJ PROFIL)
  ======================= */
  useEffect(() => {
    if (!isOwnProfile) return;

    Promise.all([
      api.get("/cars/my?status=active"),
      api.get("/cars/my?status=sold"),
    ]).then(([activeRes, soldRes]) => {
      const active = activeRes.data.length;
      const sold = soldRes.data.length;

      setStats({
        active,
        sold,
        total: active + sold,
      });
    });
  }, [isOwnProfile]);

  /* =======================
     FETCH CARS (TAB)
  ======================= */
  useEffect(() => {
    setLoading(true);

    const url = isOwnProfile
      ? `/cars/my?status=${activeTab}`
      : `/users/${userId}/cars`; // tuđi profil → samo active

    api
      .get(url)
      .then(res => setCars(res.data))
      .finally(() => setLoading(false));
  }, [activeTab, userId, isOwnProfile]);

  async function handleMarkAsSold(id) {
    await api.patch(`/cars/${id}/sold`);
    setCars(prev => prev.filter(c => c.id !== id));
    setStats(s => ({
      active: s.active - 1,
      sold: s.sold + 1,
      total: s.total,
    }));
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this car?")) return;
    await api.delete(`/cars/${id}`);
    setCars(prev => prev.filter(c => c.id !== id));
    setStats(s => ({
      ...s,
      total: s.total - 1,
    }));
  }

  return (
    <div className="w-full px-10 py-6">
      {/* =======================
         PROFILE HEADER
      ======================= */}
      <div className="flex items-center gap-6 mb-8 p-6 border rounded-lg bg-white">
        <img
          src="/avatar.png"
          alt="Avatar"
          className="w-20 h-20 rounded-full bg-gray-100 object-cover"
        />

        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {profileUser?.name || "User"}
          </h1>

          {isOwnProfile && (
            <p className="text-gray-500">{profileUser?.email}</p>
          )}

          <span className="inline-block mt-2 text-xs px-3 py-1 rounded bg-slate-900 text-white">
            Seller
          </span>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => navigate("/sell")}
            className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            + Sell a car
          </button>
        )}
      </div>

      {/* =======================
         STATS (SAMO MOJ PROFIL)
      ======================= */}
      {isOwnProfile && (
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard label="Active listings" value={stats.active} />
          <StatCard label="Sold cars" value={stats.sold} />
          <StatCard label="Total listings" value={stats.total} />
        </div>
      )}

      {/* =======================
         TABS (SAMO MOJ PROFIL)
      ======================= */}
      {isOwnProfile && (
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
      )}

      {/* =======================
         CONTENT
      ======================= */}
      {loading && <p className="text-gray-500">Loading cars...</p>}

      {!loading && cars.length === 0 && (
        <p className="text-gray-500 mt-10">
          {isOwnProfile
            ? activeTab === "sold"
              ? "You don’t have any sold cars yet."
              : "You don’t have any active listings."
            : "This user has no active listings."}
        </p>
      )}

      {!loading && cars.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {cars.map(car => (
            <div
              key={car.id}
              onClick={() => {
                if (!isOwnProfile) navigate(`/cars/${car.id}`);
              }}
              className={`border rounded overflow-hidden cursor-pointer ${
                isOwnProfile ? "group relative" : ""
              }`}
            >
              {/* IMAGE */}
              <div className="relative w-full h-44">
                <img
                  src={`${API_URL}${car.cover}`}
                  alt={car.title}
                  className={`w-full h-full object-cover transition ${
                    isOwnProfile ? "group-hover:blur-sm duration-300" : ""
                  }`}
                />

                {/* OVERLAY – SAMO MOJ PROFIL */}
                {isOwnProfile && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-3">
                      <ActionButton
                        label="View"
                        onClick={() => navigate(`/cars/${car.id}`)}
                      />

                      {activeTab === "active" && (
                        <>
                          <ActionButton
                            label="Edit car"
                            variant="secondary"
                            onClick={() => navigate(`/edit/${car.id}`)}
                          />
                          <ActionButton
                            label="Mark as sold"
                            variant="primary"
                            onClick={() => handleMarkAsSold(car.id)}
                          />
                        </>
                      )}

                      <ActionButton
                        label="Delete"
                        variant="danger"
                        onClick={() => handleDelete(car.id)}
                      />
                    </div>
                  </div>
                )}
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
   COMPONENTS
======================= */

function StatCard({ label, value }) {
  return (
    <div className="p-5 border rounded-lg bg-white text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function ActionButton({ label, onClick, variant = "default" }) {
  const base =
    "px-5 py-2 rounded text-sm font-medium transition w-40";

  const styles = {
    default: "bg-white text-gray-900 hover:bg-gray-100",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
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
