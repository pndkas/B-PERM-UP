import { prisma } from "../lib/prisma.js";

export const findAllGames = async () => {
  return await prisma.game.findMany({
    include: { packages: true },
    orderBy: { gameId: "desc" },
  });
};

export const createNewGame = async (gameData) => {
  return await prisma.game.create({
    data: {
      ...gameData,
      isActive: "ACTIVE",
    },
  });
};

export const updateGameById = async (id, updateData) => {
  return await prisma.game.update({
    where: { gameId: Number(id) },
    data: updateData,
  });
};

export const deleteGameById = async (id) => {
  return await prisma.game.delete({
    where: { gameId: Number(id) },
  });
};

export const getGameById = async (id) => {
  return await prisma.game.findUnique({
    where: {
      gameId: Number(id),
    },
    include: {
      packages: {
        where: { isActive: "ACTIVE" },
        orderBy: { price: "asc" },
      },
    },
  });
};
