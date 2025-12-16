import express from "express";

const router = express.Router();

// temporary test route
router.get("/", (req, res) => {
  res.json({ message: "Cars route works!" });
});

export default router;
