import createError from "http-errors";

export default function notFoundHdl(req, res, next) {
  const err = createError(404, `ไม่พบเส้นทาง (Path): ${req.originalUrl}`);
  next(err);
}
