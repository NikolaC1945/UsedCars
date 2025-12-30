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
      cars: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  res.json(user);
}
