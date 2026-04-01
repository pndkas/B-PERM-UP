import { prisma } from "../lib/prisma.js";

export const getPackagesByGameId = async (gameId) => {
  return await prisma.package.findMany({
    where: {
      gameId: Number(gameId),
      isActive: "ACTIVE", // ดึงเฉพาะที่เปิดใช้งาน
    },
    orderBy: { price: "asc" }, // เรียงราคาจากน้อยไปมาก
  });
};

export const getPackages = async () => {
  return await prisma.package.findMany({
    include: {
      game: {
        select: {
          gameName: true,
        },
      },
    },
    orderBy: {
      gameId: "asc",
    },
  });
};

export const createPackage = async (data) => {
  return await prisma.package.create({
    data: {
      packageName: data.packageName,
      imageUrl: data.imageUrl,
      price: parseFloat(data.price),
      unitCost: data.unitCost ? parseFloat(data.unitCost) : 0,
      isActive: data.isActive || "ACTIVE",
      notes: data.notes,
      gameId: Number(data.gameId),
    },
  });
};

export const updatePackage = async (id, data) => {
  const updateData = { ...data };
  if (data.price) updateData.price = parseFloat(data.price);
  if (data.unitCost) updateData.unitCost = parseFloat(data.unitCost);
  if (data.gameId) updateData.gameId = Number(data.gameId);

  return await prisma.package.update({
    where: { packageId: Number(id) },
    data: updateData,
  });
};

// ลบแพ็กเกจ
export const deletePackage = async (id) => {
  return await prisma.package.delete({
    where: { packageId: Number(id) },
  });
};
