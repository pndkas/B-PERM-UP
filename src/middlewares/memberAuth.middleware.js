import createHttpError from "http-errors";
import { verifyMemberToken } from "../utils/jwt.js";
import { findMemberById } from "../services/memberAuth.service.js";

export const authMember = async (req, res, next) => {
  try {
    const authZ = req.headers.authorization;

    // ใช้ ?. เพื่อความปลอดภัย และตรวจสอบ Bearer
    if (!authZ?.startsWith("Bearer ")) {
      return next(
        createHttpError(401, "กรุณาตรวจสอบข้อมูล และเข้าสู่ระบบอีกครั้ง"),
      );
    }

    const token = authZ.split(" ")[1];
    const payload = verifyMemberToken(token);

    if (!payload) {
      return next(createHttpError(401, "เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่"));
    }

    const member = await findMemberById(payload.id);

    // เช็คกรณีไม่พบ User ในระบบ
    if (!member) {
      return next(createHttpError(404, "ไม่พบข้อมูลผู้ใช้ในระบบ"));
    }

    // แยกเช็คตามสถานะ เพื่อให้แจ้งเตือนลูกค้าได้ตรงจุด (เรียงลำดับใหม่)
    if (member.isActive === "BANNED") {
      return next(
        createHttpError(403, "บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อแอดมิน"),
      );
    }

    if (member.isActive === "PENDING") {
      return next(createHttpError(403, "บัญชีของคุณอยู่ระหว่างการรออนุมัติ"));
    }

    if (member.isActive !== "ACTIVE") {
      return next(createHttpError(403, "ไม่พบข้อมูล โปรดติดต่อแอดมิน"));
    }

    req.member = member;
    req.userRole = "MEMBER";

    next();
  } catch (error) {
    next(error);
  }
};
