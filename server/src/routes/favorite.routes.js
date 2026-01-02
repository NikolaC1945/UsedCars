import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  toggleFavorite,
  getMyFavorites,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/:carId", authRequired, toggleFavorite);
router.get("/", authRequired, getMyFavorites);

export default router;
