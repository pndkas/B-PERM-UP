import { ZodError } from "zod";

export default function errorHdl(err, req, res, next) {
  // 1. ดัก Token Expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: 401,
      error: "Token Expired",
      message: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
    });
  }

  // 2. ดัก JWT ผิดพลาด
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: 401,
      error: "Invalid Token",
      message: "เซสชันไม่ถูกต้อง",
    });
  }

  // 3. ดัก Zod Validation (ส่งมาจากหน้าบ้านผิด Format)
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "ข้อมูลที่ส่งมาไม่ถูกต้อง", // 👈 เพิ่ม message กลางไว้ให้ React ดึงง่ายๆ
      errors: err.flatten().fieldErrors,
    });
  }

  // 4. กรณีอื่นๆ (รวมถึง 404 ที่เราโยนมา และ createHttpError จาก Controller)
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    status: statusCode,
    success: false,
    message: message,
  });
}
