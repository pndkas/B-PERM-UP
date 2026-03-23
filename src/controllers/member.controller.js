import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { findMemberByEmail } from "../services/memberAuth.service.js";
import { createMemberToken } from "../utils/jwt.js";
import { createMember } from "../services/memberAuth.service.js";

export const Register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingMember = await findMemberByEmail(email);
    if (existingMember) {
      return next(createHttpError(400, "อีเมลนี้ถูกใช้งานแล้ว"));
    }

    const hashedPassword = await bcrypt.hash(password, 9);

    const newMember = await createMember({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ กรุณารอแอดมินอนุมัติ",
      user: {
        id: newMember.memberId,
        name: newMember.name,
        email: newMember.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // หา User จาก Email
    const member = await findMemberByEmail(email);
    if (!member) {
      return next(createHttpError(401, "อีเมลหรือรหัสผ่านไม่ถูกต้อง"));
    }

    // เช็ค Password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return next(createHttpError(401, "อีเมลหรือรหัสผ่านไม่ถูกต้อง"));
    }

    // เช็คสถานะ PENDING/BANNED
    if (member.isActive !== "ACTIVE") {
      const message =
        member.isActive === "PENDING"
          ? "รอแอดมินอนุมัติการใช้งาน"
          : "บัญชีของคุณถูกระงับ";
      return next(createHttpError(403, message));
    }

    // สร้าง token
    const token = createMemberToken(member);

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: { id: member.memberId, name: member.name, email: member.email },
    });
  } catch (error) {
    next(error);
  }
};
