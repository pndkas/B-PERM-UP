import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {
  checkMemberById,
  checkMemberStatus,
  createAdmin,
  findAdminByEmail,
  getAllMembers,
  getDashboardStats,
} from "../services/adminAuth.service.js";
import { createAdminToken } from "../utils/jwt.js";

export const registerAdmin = async (req, res, next) => {
  try {
    if (req.admin.role !== "SUPER_ADMIN") {
      return next(createHttpError(403, "คุณไม่มีสิทธิ์เพิ่มบัญชีแอดมิน"));
    }

    const { name, email, password, role } = req.body;

    const existingAdmin = await findAdminByEmail(email);
    if (existingAdmin) {
      return next(createHttpError(400, "อีเมลแอดมินนี้ถูกใช้งานแล้ว"));
    }

    const newAdmin = await createAdmin({ name, email, password, role });

    res.status(201).json({ message: "สร้างบัญชีแอดมินสำเร็จ", data: newAdmin });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // หา User จาก Email
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return next(createHttpError(401, "อีเมลหรือรหัสผ่านไม่ถูกต้อง"));
    }

    // เช็ค Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return next(createHttpError(401, "อีเมลหรือรหัสผ่านไม่ถูกต้อง"));
    }

    // สร้าง token
    const token = createAdminToken(admin);

    console.log("SENDING TO FRONTEND:", {
      id: admin.adminId,
      role: admin.role,
    });

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      admin: { id: admin.adminId, role: admin.role, name: admin.name },
    });
  } catch (error) {
    next(error);
  }
};

// ดึงข้อมูลลูกค้าที่สมัคร เอามาทำเป็นตาราง
export const getMembers = async (req, res, next) => {
  try {
    const members = await getAllMembers();

    res.status(200).json({
      message: "ดึงข้อมูลสมาชิกสำเร็จ",
      total: members.length,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// ในหน้าเดียวกันก็ทำปุ่ม approve ให้เปลี่ยนสถานะเป็น 'ACTIVE'
export const approveMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { status } = req.body;
    const member = await checkMemberById(memberId);
    if (!member) {
      return next(createHttpError(404, "ไม่พบข้อมูลสมาชิก"));
    }

    const updateMember = await checkMemberStatus(memberId, status);
    res.status(200).json({
      message: `อัปเดตสถานะของ ${updateMember.name} เป็น ${status} เรียบร้อยแล้ว`,
      data: updateMember,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};
