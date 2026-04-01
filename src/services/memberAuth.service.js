import { prisma } from "../lib/prisma.js";

export const findMemberById = async (id) => {
  return await prisma.member.findUnique({
    where: {
      memberId: id,
      isActive: "ACTIVE",
    },
    select: {
      memberId: true,
      name: true,
      email: true,
      isActive: true,
      birthDate: true,
      createdAt: true,
    },
  });
};

// เช็คว่า Email นี้มีในระบบหรือยัง
export const findMemberByEmail = async (email) => {
  return await prisma.member.findUnique({
    where: { email },
  });
};

export const createMember = async (data) => {
  return await prisma.member.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      isActive: "PENDING",
    },
  });
};

export const findOrdersByMemberId = async (memberId) => {
  return await prisma.order.findMany({
    where: {
      memberId: memberId,
    },
    include: {
      package: {
        include: {
          game: true, // ดึงข้อมูลเกมมาด้วย (gameName, imageUrl)
        },
      },
    },
    orderBy: {
      createdAt: "desc", // เอาล่าสุดขึ้นก่อน
    },
  });
};

export const updateMemberData = async (memberId, data) => {
  return await prisma.member.update({
    where: { memberId: Number(memberId) },
    data: {
      ...data,
    },
  });
};
