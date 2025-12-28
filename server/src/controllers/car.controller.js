import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";

/* =======================
   GET ALL CARS
======================= */
export const getCars = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cars" });
  }
};

/* =======================
   GET CAR BY ID
======================= */
export const getCarById = async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch car" });
  }
};

/* =======================
   CREATE CAR
======================= */
export const createCar = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: "Failed to create car" });
  }
};

/* =======================
   UPDATE CAR
======================= */
export const updateCar = async (req, res) => {
  try {
    const carId = Number(req.params.id);

    const existingCar = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    /* EXISTING IMAGES (SAFE) */
    let existingImages = existingCar.images;

    if (typeof req.body.existingImages === "string") {
      try {
        const parsed = JSON.parse(req.body.existingImages);
        if (Array.isArray(parsed)) existingImages = parsed;
      } catch {}
    }

    const newImages = req.files?.map(f => `/uploads/${f.filename}`) || [];
    const images = [...existingImages, ...newImages];

    /* COVER (SAFE) */
    let cover = existingCar.cover;
    if (req.body.cover && images.includes(req.body.cover)) {
      cover = req.body.cover;
    } else if (!images.includes(cover)) {
      cover = images[0] || null;
    }

    /* 🔒 SAFE NUMBER PARSING */
    const safeNumber = (value, fallback) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : fallback;
    };

    const car = await prisma.car.update({
      where: { id: carId },
      data: {
        title: req.body.title ?? existingCar.title,
        brand: req.body.brand ?? existingCar.brand,
        model: req.body.model ?? existingCar.model,
        fuelType: req.body.fuelType ?? existingCar.fuelType,
        gearbox: req.body.gearbox ?? existingCar.gearbox,
        location: req.body.location ?? existingCar.location,
        description: req.body.description ?? existingCar.description,

        price: safeNumber(req.body.price, existingCar.price),
        year: safeNumber(req.body.year, existingCar.year),
        mileage: safeNumber(req.body.mileage, existingCar.mileage),

        images,
        cover,
      },
    });

    res.json(car);
  } catch (err) {
    console.error("UPDATE CAR ERROR:", err);
    res.status(500).json({ message: "Failed to update car" });
  }
};




/* =======================
   DELETE SINGLE IMAGE
======================= */
export const deleteCarImage = async (req, res) => {
  try {
    const carId = Number(req.params.id);
    const { filename } = req.params;
    const imagePath = `/uploads/${filename}`;

    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const images = car.images.filter(img => img !== imagePath);

    await prisma.car.update({
      where: { id: carId },
      data: {
        images,
        cover:
          car.cover === imagePath ? images[0] || null : car.cover,
      },
    });

    const fullPath = path.join(process.cwd(), imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};

/* =======================
   DELETE CAR
======================= */
export const deleteCar = async (req, res) => {
  try {
    const carId = Number(req.params.id);

    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    car.images.forEach(img => {
      const fullPath = path.join(process.cwd(), img);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await prisma.car.delete({
      where: { id: carId },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete car" });
  }
};
