import express from "express";
import { Login, Register } from "../controllers/Member.controller.js";
import { registerSchema } from "../validations/schema.js";
import { validate } from "../middlewares/validator.js";

const authRoute = express.Router();

authRoute.post("/register", validate(registerSchema), Register);

authRoute.post("/login", Login);

export default authRoute;
