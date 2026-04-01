import express from "express";
import {
  getMyOrderHistory,
  getMyProfile,
  updateMyProfile,
} from "../controllers/member.controller.js";
import { checkout, getMyHistory } from "../controllers/order.controller.js";
import { upload } from "../middlewares/upload.js";
import { getGamePackages } from "../controllers/package.controller.js";
import { authMember } from "../middlewares/memberAuth.middleware.js";

const memberRoute = express.Router();

memberRoute.get("/packages/:gameId", getGamePackages);

memberRoute.get("/profile", authMember, getMyProfile);
memberRoute.patch("/profile", authMember, updateMyProfile);
memberRoute.get("/history", authMember, getMyOrderHistory);

memberRoute.get("/history", authMember, getMyHistory);
memberRoute.post("/checkout", authMember, upload.single("slip"), checkout);

export default memberRoute;
