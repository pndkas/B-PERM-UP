import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร"),

    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").min(1, "กรุณากรอกอีเมล"),

    password: z.string().min(4, "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร"),

    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});
