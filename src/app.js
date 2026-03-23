import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import memberRoute from "./routes/member.route.js";
import superAdminRoute from "./routes/superadmin.route.js";
import { authAdmin } from "./middlewares/adminAuth.middleware.js";
import { authSuperAdmin } from "./middlewares/checkSuperAdmin.middleware.js";

const app = express();
app.use((req, res, next) => {
  // console.log("--- มีคนยิงเข้ามา! ---");
  // console.log("Method:", req.method);
  // console.log("URL:", req.url);
  next();
});
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("", authRoute);
app.use("/member", memberRoute);
app.use("/admin", authAdmin, adminRoute);
app.use("/superadmin", authSuperAdmin, superAdminRoute);

export default app;
