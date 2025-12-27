import prisma from "../config/prisma.js";

/**
 * GET /api/cars
 * Public – list all cars
 */
export async function getCars(req, res) {
  try {
    const cars = await prisma.car.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(cars);
  } catch (error) {
    console.error("Get cars error:", error);
    res.status(500).json({ message: "Failed to fetch cars." });
  }
}

/**
 * GET /api/cars/:id
 * Public – single car
 */
export async function getCarById(req, res) {
  try {
    const carId = Number(req.params.id);

    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    res.json(car);
  } catch (error) {
    console.error("Get car error:", error);
    res.status(500).json({ message: "Failed to fetch car." });
  }
}

/**
 * POST /api/cars
 * Protected – create car
 */
export async function createCar(req, res) {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    const userId = req.user.id;

    const {
      title,
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      gearbox,
      location,
      description,
      images,
    } = req.body;

    if (!title || !brand || !model || !year || !price) {
      return res.status(400).json({ message: "Missing required fields." });
    }

  const car = await prisma.car.create({
  data: {
    title,
    brand,
    model,
    year: Number(year) || 0,
    price: Number(price) || 0,
    mileage: Number(mileage) || 0,
    fuelType: fuelType || "Unknown",
    gearbox: gearbox || "Unknown",
    location: location || "Unknown",
    description,
    images: images || [],
    ownerId: userId,
  },
});



    res.status(201).json(car);
  } catch (error) {
    console.error("Create car error:", error);
    res.status(500).json({ message: "Failed to create car." });
  }
}

/**
 * PUT /api/cars/:id
 * Protected – only owner
 */
export async function updateCar(req, res) {
  try {
    const carId = Number(req.params.id);
    const userId = req.user.id;

    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    if (car.ownerId !== userId) {
      return res.status(403).json({ message: "Not allowed." });
    }

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: req.body,
    });

    res.json(updatedCar);
  } catch (error) {
    console.error("Update car error:", error);
    res.status(500).json({ message: "Failed to update car." });
  }
}

/**
 * DELETE /api/cars/:id
 * Protected – only owner
 */
export async function deleteCar(req, res) {
  try {
    const carId = Number(req.params.id);
    const userId = req.user.id;

    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    if (car.ownerId !== userId) {
      return res.status(403).json({ message: "Not allowed." });
    }

    await prisma.car.delete({
      where: { id: carId },
    });

    res.json({ message: "Car deleted successfully." });
  } catch (error) {
    console.error("Delete car error:", error);
    res.status(500).json({ message: "Failed to delete car." });
  }
}
