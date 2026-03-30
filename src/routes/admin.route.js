import express from "express";
import {
  approveMember,
  getMembers,
  getStats,
  Login,
  registerAdmin,
} from "../controllers/admin.controller.js";
import {
  authAdmin,
  authSuperAdmin,
} from "../middlewares/adminAuth.middleware.js";

const adminRoute = express.Router();

adminRoute.post("/login", Login);

adminRoute.get("/stats", authAdmin, getStats);
adminRoute.get("/members", authAdmin, getMembers);
adminRoute.patch("/approve/:memberId", authAdmin, approveMember);

adminRoute.post("/register-admin", authAdmin, authSuperAdmin, registerAdmin);

export default adminRoute;
