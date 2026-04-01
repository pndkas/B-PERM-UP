import { prisma } from "../lib/prisma.js";

export const createOrder = async (data) => {
  return await prisma.order.create({
    data: {
      uidGameMember: data.uidGameMember,
      amount: data.amount,
      slipImageUrl: data.slipImageUrl,
      memberId: Number(data.memberId),
      packageId: Number(data.packageId),
      status: "PENDING",
    },
  });
};

export const getOrdersByMemberId = async (memberId) => {
  return await prisma.order.findMany({
    where: { memberId: Number(memberId) },
    include: {
      package: {
        include: {
          game: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      member: true,
      package: { include: { game: true } },
      admin: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// src/services/order.service.js

export const updateOrderStatus = async (orderId, status, adminId) => {
  // 1. แปลง ID เป็นตัวเลข (เพราะใน Error บอกว่า orderId?: Int)
  const numberId = Number(orderId);

  if (isNaN(numberId)) {
    throw new Error(`ID ออเดอร์ไม่ถูกต้อง: ${orderId}`);
  }

  return await prisma.order.update({
    where: {
      // 🎯 เปลี่ยนจาก id: เป็น orderId: ตาม Schema ของแม่
      orderId: numberId,
    },
    data: {
      status: status,
      approveBy: adminId ? Number(adminId) : null,
    },
  });
};
