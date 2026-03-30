import createHttpError from "http-errors";
import { verifyAdminToken } from "../utils/jwt.js";
import { findAdminById } from "../services/adminAuth.service.js";

export const authAdmin = async (req, res, next) => {
  try {
    const authZ = req.headers.authorization;
    if (!authZ?.startsWith("Bearer ")) {
      return next(createHttpError(401, "Admin Access Only!"));
    }

    const token = authZ.split(" ")[1];
    const payload = verifyAdminToken(token);
    // const payload = jwt.verify(token, process.env.ADMIN_SECRET);

    // จริงๆคือ Token หมดนะจ๊ะ
    if (!payload) {
      return next(createHttpError(401, "Session ไม่ถูกต้องหรือหมดอายุ"));
    }
    const admin = await findAdminById(payload.id);

    if (!admin || admin.isActive !== "ACTIVE") {
      return next(
        createHttpError(403, "บัญชีถูกระงับหรือไม่มีสิทธิ์เข้าใช้งาน"),
      );
    }

    req.admin = admin;
    req.adminId = admin.adminId;
    req.role = admin.role;

    next();
  } catch (error) {
    next(error);
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
