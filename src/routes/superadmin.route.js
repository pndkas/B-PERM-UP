import express from "express";
import { Login } from "../controllers/admin.controller.js";

const superAdminRoute = express.Router();

superAdminRoute.post("/login", Login);
// superAdminRoute.get("/");

export default superAdminRoute;
