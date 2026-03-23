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
