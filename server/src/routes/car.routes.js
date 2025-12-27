import express from "express";
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/car.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.get("/", getCars);
router.get("/:id", getCarById);

// protected
router.post("/", authRequired, createCar);
router.put("/:id", authRequired, updateCar);
router.delete("/:id", authRequired, deleteCar);

export default router;
