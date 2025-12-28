import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/car.routes.js";
import path from "path";

dotenv.config();

const app = express();

/* =========================
   CORS — FIXED (IMPORTANT)
   ========================= */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,              // allow cookies / auth
  })
);

app.use(express.json());

/* =========================
   STATIC FILES
   ========================= */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

/* =========================
   HEALTH CHECK
   ========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* =========================
   ROUTES
   ========================= */
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

export default app;
