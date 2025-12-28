import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCarById } from "../api/cars.api";

const API_URL = "http://localhost:5000";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getCarById(id).then(setCar);
  }, [id]);

  if (!car) return <p style={{ padding: 40 }}>Loading...</p>;

  const images = car.images || [];

  function prev() {
    setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div style={{ maxWidth: 1200, margin: "30px auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        {/* LEFT */}
        <div>
          {/* CAROUSEL */}
          <div style={{ position: "relative" }}>
            <img
              src={`${API_URL}${images[index]}`}
              style={{
                width: "100%",
                height: 420,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <button onClick={prev} style={arrow("left")}>‹</button>
            <button onClick={next} style={arrow("right")}>›</button>
          </div>

          {/* THUMBNAILS */}
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {images.map((img, i) => (
              <img
                key={img}
                src={`${API_URL}${img}`}
                onClick={() => setIndex(i)}
                style={{
                  width: 90,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 4,
                  cursor: "pointer",
                  border: i === index ? "3px solid #000" : "1px solid #ddd",
                }}
              />
            ))}
          </div>

          {/* DESCRIPTION */}
          <section style={{ marginTop: 32 }}>
            <h3>Description</h3>
            <p style={{ color: "#444", lineHeight: 1.6 }}>
              {car.description || "No description provided."}
            </p>
          </section>
        </div>

        {/* RIGHT */}
        <aside>
          <h1 style={{ marginBottom: 8 }}>{car.title}</h1>
          <p style={{ color: "#666", marginBottom: 16 }}>
            {car.brand} {car.model}
          </p>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            €{car.price}
          </div>

          {/* SPECS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <Spec label="Year" value={car.year} />
            <Spec label="Mileage" value={`${car.mileage} km`} />
            <Spec label="Fuel" value={car.fuelType} />
            <Spec label="Gearbox" value={car.gearbox} />
            <Spec label="Location" value={car.location} />
            <Spec label="Condition" value="Used" />
          </div>

          {/* ✅ ONLY CHANGE IS HERE */}
          <Link to={`/edit/${car.id}`}>
            <button
              style={{
                width: "100%",
                padding: "14px 0",
                background: "#000",
                color: "#fff",
                border: "none",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Edit car
            </button>
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "#777" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function arrow(side) {
  return {
    position: "absolute",
    top: "50%",
    [side]: 12,
    transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: 20,
  };
}
