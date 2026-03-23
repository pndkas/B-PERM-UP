import createHttpError from "http-errors";

export const authSuperAdmin = (req, res, next) => {
  if (req.userRole !== "SUPER_ADMIN") {
    return next(
      createHttpError(403, "เฉพาะ Super Admin เท่านั้นที่ทำรายการนี้ได้"),
    );
  }
  next();
};
