import express from "express";
import cors from "cors";
import carRoutes from "./routes/car.routes.js";
import authRoutes from "./routes/auth.routes.js";
import path from "path";

const app = express();

/* =========================
   CORS — CORRECT & FINAL
   ========================= */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   STATIC FILES
   ========================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   ROUTES
   ========================= */
app.use("/api/cars", carRoutes);
app.use("/api/auth", authRoutes);

/* =========================
   START SERVER
   ========================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
