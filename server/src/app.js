import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/car.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

export default app;
