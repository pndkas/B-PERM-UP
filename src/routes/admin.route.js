import express from "express";
import {
  getMembers,
  getStats,
  Login,
  registerAdmin,
  updateMember,
} from "../controllers/admin.controller.js";
import {
  authAdmin,
  authSuperAdmin,
} from "../middlewares/adminAuth.middleware.js";
import {
  createGame,
  deleteGame,
  getAllGames,
  updateGame,
} from "../controllers/game.controller.js";
import {
  addPackage,
  editPackage,
  getAllPackages,
  getGamePackages,
  removePackage,
} from "../controllers/package.controller.js";
import {
  adminGetOrders,
  adminUpdateOrder,
} from "../controllers/order.controller.js";

const adminRoute = express.Router();

adminRoute.post("/login", Login);

adminRoute.get("/packages", authAdmin, getAllPackages);
adminRoute.get("/packages/:gameId", getGamePackages);

adminRoute.post("/packages", authAdmin, addPackage);
adminRoute.patch("/packages/:id", authAdmin, editPackage);
adminRoute.delete("/packages/:id", authAdmin, removePackage);

adminRoute.get("/stats", authAdmin, getStats);
adminRoute.get("/members", authAdmin, getMembers);
adminRoute.patch("/member/:memberId", authAdmin, updateMember);

adminRoute.post("/register-admin", authAdmin, authSuperAdmin, registerAdmin);

adminRoute.get("/games", authAdmin, getAllGames);
adminRoute.post("/games", authAdmin, createGame);
adminRoute.patch("/game/:id", authAdmin, updateGame);
adminRoute.delete("/game/:id", authAdmin, deleteGame);

adminRoute.get("/orders", authAdmin, adminGetOrders);
adminRoute.patch("/orders/:id", authAdmin, adminUpdateOrder);

export default adminRoute;
