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

    if (!payload) {
      return next(createHttpError(401, "Token แอดมินไม่ถูกต้องหรือหมดอายุ"));
    }
    const admin = await findAdminById(payload.id);

    if (!admin || admin.isActive !== "ACTIVE") {
      return next(createHttpError(403, "บัญชีแอดมินถูกระงับการใช้งาน"));
    }

    req.admin = admin;
    req.userRole = admin.role;

    next();
  } catch (error) {
    next(error);
  }
};
