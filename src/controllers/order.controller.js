import {
  createOrder,
  getAllOrders,
  getOrdersByMemberId,
  updateOrderStatus,
} from "../services/order.service.js";

export const checkout = async (req, res) => {
  try {
    const user = req.member;
    // console.log("User from Token:", req.member);

    const slipUrl = req.file?.path || req.file?.secure_url;
    if (!slipUrl) {
      return res.status(400).json({
        message: "ไม่พบไฟล์สลิป (Backend receive file as undefined)",
        debug_file_info: req.file, // ส่งกลับไปดูที่หน้าบ้านเลยว่าได้อะไร
      });
    }

    const { packageId, customerUid, amount } = req.body;

    const order = await createOrder({
      packageId: Number(packageId),
      uidGameMember: customerUid,
      amount: parseFloat(amount),
      slipImageUrl: slipUrl,
      memberId: Number(user.memberId),
    });

    res.status(201).json({ message: "สำเร็จ!", order });
  } catch (error) {
    // 🎯 หัวใจสำคัญ: พ่น Error ออกไปที่ Browser เลย
    console.error("❌ FULL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "ระเบิดตรงนี้: " + error.message,
      prismaCode: error.code, // เช่น P2002, P2003
      meta: error.meta, // ข้อมูลเพิ่มเติมว่า Field ไหนพัง
    });
  }
};

export const getMyHistory = async (req, res) => {
  try {
    const memberId = req.member.id;
    const history = await getOrdersByMemberId(memberId);

    res.status(200).json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: "ไม่สามารถดึงข้อมูลประวัติได้: " + error.message });
  }
};

export const adminGetOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "ดึงข้อมูลออเดอร์ไม่สำเร็จ: " + error.message });
  }
};

export const adminUpdateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const adminId = req.adminId;
    if (!adminId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "ไม่พบข้อมูลแอดมิน กรุณาล็อกอินใหม่",
        });
    }
    const adminName = req.admin?.name || "Admin";

    // 1. ตรวจสอบ ID
    if (!id || id === "undefined") {
      return res.status(400).json({
        success: false,
        message: "ID ออเดอร์ไม่ถูกต้อง",
      });
    }

    // 2. 🎯 ปรับรายการที่อนุญาตให้ตรงกับ Schema (Enum) ของแม่เป๊ะๆ
    const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"];

    // เช็คว่า status ที่ส่งมา (status) อยู่ในกลุ่มที่อนุญาตไหม
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        // แก้ Message ใหม่ไม่ให้หลอกตัวเอง:
        message: `สถานะ '${status}' ไม่ถูกต้อง! ระบบรองรับแค่: ${validStatuses.join(", ")}`,
        debug_received: status,
      });
    }

    // 3. Log การทำงาน
    console.log(
      `🔔 Admin [${adminName}] is updating Order #${id} to [${status}]`,
    );

    // 4. สั่งอัปเดตผ่าน Service
    const updated = await updateOrderStatus(id, status, adminId);

    // 5. ส่งคำตอบกลับ
    res.status(200).json({
      success: true,
      message: `อัปเดตโดย ${adminName} เมื่อ ${new Date().toLocaleString("th-TH")}`,
      updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
