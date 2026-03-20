import jwt from "jsonwebtoken";
import creatHttpError from "http-errors";

export const verifyMember = (req, res, next) => {
  const authMember = req.headers.authorization;
  if (!authMember || !authMember.startsWith("Bearer "))
    return next(creatHttpError(401, "กรุณาเข้าสู่ระบบลูกค้า!"));

  const token = authMember.split(" ")[1];

  jwt.verify(token, process.env.JWT_MEMBER_SECRET, (err, payload) => {
    if (err) return res.status(403).json("Token ลูกค้าไม่ถูกต้อง!");

    req.userId = payload.id;
    req.userRole = "MEMBER";
    next();
  });
};
