import express from "express";
import {
  approveMember,
  getMembers,
  Login,
} from "../controllers/admin.controller.js";

const adminRoute = express.Router();

adminRoute.post("/login", Login);
adminRoute.get("/members", getMembers);
adminRoute.patch("/approve/:memberId", approveMember);

export default adminRoute;
