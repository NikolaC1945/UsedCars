import prisma from "../config/prisma.js";

/* =========================
   TOGGLE FAVORITE
========================= */
export async function toggleFavorite(req, res) {
  try {
    const userId = req.user.id;
    const carId = Number(req.params.carId);

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_carId: {
          userId,
          carId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          userId_carId: {
            userId,
            carId,
          },
        },
      });

      return res.json({ favorited: false });
    }

    await prisma.favorite.create({
      data: {
        userId,
        carId,
      },
    });

    res.json({ favorited: true });
  } catch (err) {
    console.error("TOGGLE FAVORITE ERROR:", err);
    res.status(500).json({ message: "Failed to toggle favorite" });
  }
}

/* =========================
   GET MY FAVORITES
========================= */
export async function getMyFavorites(req, res) {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        car: {
          include: {
            owner: true, // ✅ relacija
          },
        },
      },
      orderBy: { id: "desc" },
    });

    // frontend očekuje array automobila
    const cars = favorites.map(f => f.car);

    res.json(cars);
  } catch (err) {
    console.error("GET FAVORITES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
}
