import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";

/* =======================
   GET ALL
======================= */
export const getCars = async (req, res) => {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(cars);
};

/* =======================
   GET ONE
======================= */
export const getCarById = async (req, res) => {
  const car = await prisma.car.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(car);
};

/* =======================
   CREATE
======================= */
export const createCar = async (req, res) => {
  const images = req.files?.map(f => `/uploads/${f.filename}`) || [];

  const car = await prisma.car.create({
    data: {
      ...req.body,
      price: Number(req.body.price),
      year: Number(req.body.year),
      mileage: Number(req.body.mileage),
      images,
      cover: images[0] || null,
      userId: req.user.id,
    },
  });

  res.status(201).json(car);
};

/* =======================
   UPDATE (CRITICAL FIX)
======================= */
export const updateCar = async (req, res) => {
  const id = Number(req.params.id);

  const existing = await prisma.car.findUnique({
    where: { id },
  });

  if (!existing) return res.status(404).json({ message: "Not found" });

  let images = existing.images;

  if (req.body.existingImages) {
    try {
      const parsed = JSON.parse(req.body.existingImages);
      if (Array.isArray(parsed)) images = parsed;
    } catch {}
  }

  const uploaded = req.files?.map(f => `/uploads/${f.filename}`) || [];
  images = [...images, ...uploaded];

  /* 🔴 COVER IS NEVER DERIVED FROM ORDER */
  let cover = existing.cover;

  if (req.body.cover && images.includes(req.body.cover)) {
    cover = req.body.cover;
  }

  if (!cover || !images.includes(cover)) {
    cover = images[0] || null;
  }

  const safe = (v, f) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : f;
  };

  const car = await prisma.car.update({
    where: { id },
    data: {
      title: req.body.title,
      brand: req.body.brand,
      model: req.body.model,
      fuelType: req.body.fuelType,
      gearbox: req.body.gearbox,
      location: req.body.location,
      description: req.body.description,
      price: safe(req.body.price, existing.price),
      year: safe(req.body.year, existing.year),
      mileage: safe(req.body.mileage, existing.mileage),
      images,
      cover,
    },
  });

  res.json(car);
};

/* =======================
   DELETE IMAGE
======================= */
export const deleteCarImage = async (req, res) => {
  const id = Number(req.params.id);
  const { filename } = req.params;
  const img = `/uploads/${filename}`;

  const car = await prisma.car.findUnique({ where: { id } });

  const images = car.images.filter(i => i !== img);

  let cover = car.cover === img ? images[0] || null : car.cover;

  await prisma.car.update({
    where: { id },
    data: { images, cover },
  });

  const full = path.join(process.cwd(), img);
  if (fs.existsSync(full)) fs.unlinkSync(full);

  res.json({ success: true });
};

/* =======================
   DELETE CAR
======================= */
export const deleteCar = async (req, res) => {
  const id = Number(req.params.id);
  const car = await prisma.car.findUnique({ where: { id } });

  car.images.forEach(i => {
    const p = path.join(process.cwd(), i);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  });

  await prisma.car.delete({ where: { id } });
  res.json({ success: true });
};
