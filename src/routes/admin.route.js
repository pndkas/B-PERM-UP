import express from "express";
import { approveMember, getMembers } from "../controllers/admin.controller.js";

const adminRoute = express.Router();

// adminRoute.post("/login", Login);
adminRoute.get("/dashboard/members", getMembers);
adminRoute.patch("/approve/:memberId", approveMember);

export default adminRoute;
