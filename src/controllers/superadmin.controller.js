export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!name || !email || !password) {
      return next(createHttpError(400, "กรุณากรอกข้อมูลให้ครบถ้วน"));
    }

    // 2. เช็คว่า Email ซ้ำไหม
    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) return next(createHttpError(400, "Email นี้ถูกใช้งานแล้ว"));

    // 3. Hash Password ก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. บันทึกโดยระบุ Role เป็น ADMIN ทันที
    const newAdmin = await prisma.member.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isActive: "ACTIVE", // อนุมัติให้ทันทีเพราะ Superadmin เป็นคนสร้าง
      },
    });

    res.status(201).json({
      message: "สร้างบัญชี Admin สำเร็จ",
      admin: { name: newAdmin.name, email: newAdmin.email },
    });
  } catch (error) {
    next(error);
  }
};
