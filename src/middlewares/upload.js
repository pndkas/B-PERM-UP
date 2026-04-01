import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "slips",
    // 🎯 ใช้ allowed_formats (snake_case) ตาม Document ของ Library
    allowed_formats: ["jpg", "png", "jpeg", "avif"],
    // เพิ่ม public_id เพื่อป้องกันชื่อไฟล์ซ้ำหรือมีอักขระพิเศษ
    public_id: (req, file) => `slip-${Date.now()}`,
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัด 5MB ที่หลังบ้านด้วย
});
