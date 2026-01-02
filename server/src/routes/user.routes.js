import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  getUserCars,
  getUserById,
  getMyStats 
} from "../controllers/user.controller.js";


const router = express.Router();

router.get("/me", authRequired, getMyProfile);
router.get("/:id", getUserById);
router.get("/:id/cars", getUserCars);

router.get("/:id/cars", (req, res) => {
  res.json({ ok: true, id: req.params.id });
});

export default router;
