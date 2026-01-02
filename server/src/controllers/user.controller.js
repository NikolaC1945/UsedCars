import prisma from "../config/prisma.js";

export async function getMyProfile(req, res) {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  res.json(user);
}

export async function getUserById(req, res) {
  try {
    const userId = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true, // možeš kasnije maknuti ako ne želiš javno
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
}

export async function getUserCars(req, res) {
  try {
    const userId = Number(req.params.id);

    const cars = await prisma.car.findMany({
      where: {
        ownerId: userId,
        isSold: false,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(cars);
  } catch (err) {
    console.error("GET USER CARS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user cars" });
  }
}

export async function getMyStats(req, res) {
  try {
    const userId = req.user.id;

    const [active, sold] = await Promise.all([
      prisma.car.count({
        where: { ownerId: userId, isSold: false },
      }),
      prisma.car.count({
        where: { ownerId: userId, isSold: true },
      }),
    ]);

    res.json({
      active,
      sold,
      total: active + sold,
    });
  } catch (err) {
    console.error("GET MY STATS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
}

