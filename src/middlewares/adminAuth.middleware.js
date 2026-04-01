import createHttpError from "http-errors";
import { verifyAdminToken } from "../utils/jwt.js";
import { findAdminById } from "../services/adminAuth.service.js";

export const authAdmin = async (req, res, next) => {
  try {
    const authZ = req.headers.authorization;

    // 1. ตรวจสอบว่ามี Header Authorization หรือไม่
    if (!authZ || !authZ.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "กรุณาเข้าสู่ระบบ (No Token Provided)" });
    }

    const token = authZ.split(" ")[1];

    // 2. Verify Token
    let payload;
    try {
      payload = verifyAdminToken(token); // มั่นใจว่าฟังก์ชันนี้ return decoded data ออกมา
    } catch (jwtError) {
      return res
        .status(401)
        .json({ message: "Session หมดอายุหรือรูปแบบ Token ไม่ถูกต้อง" });
    }

    if (!payload || !payload.id) {
      return res.status(401).json({ message: "Session ไม่ถูกต้อง" });
    }

    // 3. ค้นหา Admin ใน Database
    const admin = await findAdminById(payload.id);

    // 4. ตรวจสอบสิทธิ์ (รองรับทั้ง ADMIN และ SUPER_ADMIN)
    if (!admin) {
      return res.status(403).json({ message: "ไม่พบข้อมูลบัญชีผู้ดูแลระบบ" });
    }

    // เช็คสถานะการใช้งาน (ถ้ามีฟิลด์ isActive ใน DB)
    if (admin.isActive === "INACTIVE" || admin.status === "DISABLED") {
      return res.status(403).json({ message: "บัญชีของคุณถูกระงับการใช้งาน" });
    }

    // 5. ฝากข้อมูลไว้ใน Request เพื่อใช้ต่อใน Controller
    req.admin = admin;
    req.adminId = admin.id || admin.adminId; // ปรับตามชื่อ field ใน DB คุณ
    req.role = admin.role;

    next();
  } catch (error) {
    console.error("Auth Admin Middleware Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error ในส่วนของการยืนยันตัวตน" });
  }
};

export const authSuperAdmin = (req, res, next) => {
  try {
    // เราสามารถเรียกใช้ req.role ได้เลย เพราะมันผ่าน authAdmin มาก่อนแล้ว
    if (req.role !== "SUPER_ADMIN") {
      return next(createHttpError(403, "ไม่มีสิทธิ์เข้าใช้งาน"));
    }

    next();
  } catch (error) {
    next(error);
  }
};
