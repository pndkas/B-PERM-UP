import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {
  findMemberByEmail,
  findMemberById,
  findOrdersByMemberId,
} from "../services/memberAuth.service.js";
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
      member: {
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
      return next(createHttpError(401, "ยังไม่มีข้อมูลสมาชิกใน PERM-UP"));
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
      member: { id: member.memberId, name: member.name, email: member.email },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    // 1. ดึงข้อมูลจากที่ Middleware เตรียมไว้ให้ (req.member)
    const profile = req.member;
    // console.log("profile", profile);

    if (!profile) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสมาชิก" });
    }

    // 2. ถ้าใน Middleware ดึงมาครบแล้ว (name, email, createdAt)
    // ก็ส่ง profile กลับไปได้เลยครับ
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

import { updateMemberData } from "../services/memberAuth.service.js";

export const updateMyProfile = async (req, res, next) => {
  try {
    // 🛡️ ดึง ID จาก Token ที่ Middleware (authMember) เตรียมไว้ให้
    const memberId = req.member.memberId || req.member.id;

    // 📝 รับเฉพาะฟิลด์ที่ User ทั่วไปแก้ได้
    const { name, birthDate, phone } = req.body;

    // 🚀 ส่งไปอัปเดตผ่าน Service ตัวเดียวกัน
    const updated = await updateMemberData(memberId, {
      name,
      phone,
      birthDate: birthDate ? new Date(birthDate) : null,
    });

    res.status(200).json({
      success: true,
      message: "อัปเดตโปรไฟล์สำเร็จ 🚀",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrderHistory = async (req, res, next) => {
  try {
    const memberId = req.member.memberId;

    if (!memberId) {
      return res.status(401).json({ message: "ไม่พบข้อมูลผู้ใช้งาน" });
    }
    const orders = await findOrdersByMemberId(memberId);
    const formattedOrders = orders.map((order) => ({
      orderId: order.orderId,
      gameName: order.package.game.gameName,
      packageName: order.package.packageName,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt,
      uidGameMember: order.uidGameMember,
      slipImageUrl: order.slipImageUrl,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    next(error);
  }
};
