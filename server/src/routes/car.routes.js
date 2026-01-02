import express from "express";
import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  deleteCarImage,
  getMyCars,
  markCarAsSold,
} from "../controllers/car.controller.js";

import {
  authRequired,
  optionalAuth,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* =======================
   GET ALL CARS (HOME)
   OPTIONAL AUTH → BITNO ZA ❤️
======================= */
router.get("/", optionalAuth, getCars);

/* =======================
   GET MY CARS (PROFILE)
======================= */
router.get("/my", authRequired, getMyCars);

/* =======================
   MARK AS SOLD
======================= */
router.patch("/:id/sold", authRequired, markCarAsSold);

/* =======================
   GET ONE CAR (DETAILS)
   OPTIONAL AUTH → BITNO ZA ❤️
======================= */
router.get("/:id", optionalAuth, getCarById);

/* =======================
   CREATE CAR
======================= */
router.post(
  "/",
  authRequired,
  upload.array("images"),
  createCar
);

/* =======================
   UPDATE CAR
======================= */
router.put(
  "/:id",
  authRequired,
  upload.array("images"),
  updateCar
);

/* =======================
   DELETE IMAGE
======================= */
router.delete(
  "/:id/image/:filename",
  authRequired,
  deleteCarImage
);

/* =======================
   DELETE CAR
======================= */
router.delete("/:id", authRequired, deleteCar);

export default router;
