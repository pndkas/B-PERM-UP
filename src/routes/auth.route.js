import express from "express";
import { Login, Register } from "../controller/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/register", Register);

authRoute.post("/login", Login);
