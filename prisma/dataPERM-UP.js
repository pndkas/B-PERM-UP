import { prisma } from "../src/lib/prisma.js"; // Import แบบ Named Export ตามที่คุณตั้งค่าไว้
import bcrypt from "bcrypt";

async function main() {
  console.log("--- เริ่มการ Seed ข้อมูล ---");

  // ==========================================
  // 👤 1. สร้างข้อมูล Admin
  // ==========================================
  const adminPassword = await bcrypt.hash("008080", 9);

  // เช็คว่ามี Admin ตัวนี้อยู่หรือยัง (ป้องกัน Error ถ้ากด seed ซ้ำ)
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: "superadmin@gmail.com" },
  });

  if (!existingAdmin) {
    const admin = await prisma.admin.create({
      data: {
        name: "Superadmin",
        email: "superadmin@gmail.com",
        password: adminPassword,
        role: "SUPER_ADMIN",
        isActive: "ACTIVE",
        notes: "ผู้ดูแลระบบสูงสุด",
      },
    });
    console.log(`✅ สร้าง Admin สำเร็จ: ${admin.email}`);
  } else {
    console.log("⚠️ Admin ตัวนี้มีอยู่ในระบบแล้ว ข้ามการสร้าง...");
  }

  // ==========================================
  // 🎮 2. สร้างข้อมูล Game
  // ==========================================
  const valorant = await prisma.game.create({
    data: {
      gameName: "Valorant",
      uidGame: "RIOT_ID",
      category: "FPS / Action",
      imageUrl: "https://example.com/images/valorant-logo.png",
      isActive: "ACTIVE",
    },
  });

  console.log(
    `✅ สร้างเกม: ${valorant.gameName} สำเร็จ (ID: ${valorant.gameId})`,
  );

  // ==========================================
  // 📦 3. สร้างข้อมูล Package
  // ==========================================
  const packagesData = [
    {
      packageName: "300 Valorant Points",
      price: 100.0,
      unitCost: 85.0,
      isActive: "ACTIVE",
      gameId: valorant.gameId,
    },
    {
      packageName: "625 Valorant Points",
      price: 200.0,
      unitCost: 170.0,
      isActive: "ACTIVE",
      gameId: valorant.gameId,
    },
  ];

  for (const pkgItem of packagesData) {
    await prisma.package.create({ data: pkgItem });
    console.log(` - สร้างแพ็กเกจ: ${pkgItem.packageName} สำเร็จ`);
  }

  console.log("--- Seed ข้อมูลเสร็จเรียบร้อย! ---");
}

main()
  .catch((e) => {
    console.error("❌ เกิดข้อผิดพลาดในการ Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
