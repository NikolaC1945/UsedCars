import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { getMyProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", authRequired, getMyProfile);

export default router;
