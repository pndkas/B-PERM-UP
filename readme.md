# 🎮 PERM-UP API Documentation

ระบบหลังบ้านสำหรับเว็บไซต์เติมเกม (Game Refill Platform) พัฒนาด้วย Node.js (Express 5) และ Prisma ORM

## 🚀 Base URL

`http://localhost:9000`

---

## 🔐 Authentication (Public)

| Method | Endpoint    | Description                | Validation             |
| :----- | :---------- | :------------------------- | :--------------------- |
| POST   | `/register` | สมัครสมาชิกใหม่            | `Zod (registerSchema)` |
| POST   | `/login`    | เข้าสู่ระบบ (Member/Admin) | -                      |

---

## 👤 Member Endpoints

_ต้องมี Header: `Authorization: Bearer <token>`_

### Profile & History

| Method | Endpoint          | Description                  |
| :----- | :---------------- | :--------------------------- |
| GET    | `/member/profile` | ดูข้อมูลส่วนตัว              |
| PATCH  | `/member/profile` | แก้ไขข้อมูลส่วนตัว           |
| GET    | `/member/history` | ดูประวัติการสั่งซื้อของตนเอง |

### Shop & Checkout

| Method | Endpoint                   | Description                              |
| :----- | :------------------------- | :--------------------------------------- |
| GET    | `/member/packages/:gameId` | ดูแพ็กเกจทั้งหมดของเกมนั้นๆ              |
| POST   | `/member/checkout`         | แจ้งชำระเงิน (Upload Slip to Cloudinary) |

---

## 🛠️ Admin Endpoints

_ต้องมี Header: `Authorization: Bearer <admin_token>`_

### Dashboard & Management

| Method | Endpoint                  | Description                             |
| :----- | :------------------------ | :-------------------------------------- |
| GET    | `/admin/stats`            | ดูสถิติรวมของระบบ (Dashboard)           |
| GET    | `/admin/members`          | ดูรายชื่อสมาชิกทั้งหมด                  |
| PATCH  | `/admin/member/:memberId` | แก้ไขข้อมูลสมาชิก                       |
| POST   | `/admin/register-admin`   | เพิ่ม Admin ใหม่ (**Super Admin Only**) |

### Game Management

| Method | Endpoint          | Description                            |
| :----- | :---------------- | :------------------------------------- |
| GET    | `/admin/games`    | ดูรายการเกมทั้งหมด                     |
| POST   | `/admin/games`    | เพิ่มเกมใหม่เข้าสู่ระบบ                |
| PATCH  | `/admin/game/:id` | แก้ไขข้อมูลเกม                         |
| DELETE | `/admin/game/:id` | ลบเกมออกจากระบบ (**Super Admin Only**) |

### Package Management

| Method | Endpoint              | Description        |
| :----- | :-------------------- | :----------------- |
| GET    | `/admin/packages`     | ดูแพ็กเกจทั้งหมด   |
| POST   | `/admin/packages`     | เพิ่มแพ็กเกจใหม่   |
| PATCH  | `/admin/packages/:id` | แก้ไขข้อมูลแพ็กเกจ |
| DELETE | `/admin/packages/:id` | ลบแพ็กเกจ          |

### Order Management

| Method | Endpoint            | Description                   |
| :----- | :------------------ | :---------------------------- |
| GET    | `/admin/orders`     | ดูรายการคำสั่งซื้อทั้งหมด     |
| PATCH  | `/admin/orders/:id` | อนุมัติ/ปฏิเสธ รายการสั่งซื้อ |

---

## 🎮 Game Content (Public)

| Method | Endpoint     | Description                      |
| :----- | :----------- | :------------------------------- |
| GET    | `/games`     | ดึงรายการเกมทั้งหมดมาแสดงหน้าแรก |
| GET    | `/games/:id` | ดูรายละเอียดของเกมรายตัว         |

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

- **Runtime:** Node.js (Express 5.2.1)
- **Database:** MariaDB (via Prisma 7.5.0)
- **Auth:** JSON Web Token (JWT) & Bcrypt
- **Storage:** Cloudinary (ใช้งานผ่าน `multer-storage-cloudinary`)
- **Validation:** Zod 4.3.6
- **Payment:** PromptPay QR Generator & QRCode

---
