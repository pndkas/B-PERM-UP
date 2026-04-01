import { prisma } from "../lib/prisma.js";

export const findAdminById = async (id) => {
  return await prisma.admin.findUnique({
    where: {
      adminId: Number(id),
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

export const createAdmin = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 9);
  return await prisma.admin.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });
};

export const getAllMembers = async () => {
  return await prisma.member.findMany({
    orderBy: { memberId: "desc" },
    select: {
      memberId: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
    },
  });
};

export const checkMemberById = async (memberId) => {
  return await prisma.member.findUnique({
    where: { memberId: Number(memberId) },
  });
};

export const getDashboardStats = async () => {
  const [totalGames, totalMembers, pendingOrders, revenue] = await Promise.all([
    prisma.game.count(),
    prisma.member.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalGames,
    totalUsers: totalMembers,
    pendingOrders,
    totalRevenue: Number(revenue._sum.amount) || 0,
  };
};

export const updateMemberData = async (memberId, data) => {
  return await prisma.member.update({
    where: { memberId: Number(memberId) }, // 💡 ใช้ ID ให้ตรงกับที่ Service เช็ค
    data: {
      name: data.name,
      isActive: data.isActive,
      notes: data.notes,
    },
  });
};
