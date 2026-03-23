import { prisma } from "../lib/prisma.js";

export const findAdminById = async (id) => {
  return await prisma.admin.findUnique({
    where: {
      adminId: id,
      isActive: "ACTIVE", // ด่านแรก: เช็คสถานะ (ถ้าโดนแบน จะหาไม่เจอทันที)
    },
    select: {
      adminId: true, // เอา ID ไปใช้ต่อในตาราง Order/Transaction
      name: true, // เอาไปแสดงผล "สวัสดีครับ คุณ..."
      email: true,
      isActive: true,
      role: true, // สำคัญมาก: เอาไว้เช็คว่าคนนี้มีสิทธิ์ "ลบข้อมูล" (Super Admin) หรือไม่
      createdAt: true,
    },
  });
};

// เช็คว่า Email นี้มีในระบบหรือยัง
export const findAdminByEmail = async (email) => {
  return await prisma.admin.findUnique({
    where: { email },
  });
};

export const getAllMembers = async () => {
  return await prisma.member.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const checkMemberById = async (memberId) => {
  return await prisma.member.findUnique({
    where: { id: Number(memberId) },
  });
};

export const checkMemberStatus = async (memberId, status) => {
  return await prisma.member.update({
    where: { id: Number(memberId) },
    data: { isActive: status },
  });
};
