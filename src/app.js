import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import memberRoute from "./routes/member.route.js";
import gameRoute from "./routes/game.route.js";
import notFoundHdl from "./middlewares/notFoundHdl.middleware.js";
import errorHdl from "./middlewares/errorHdl.middleware.js";

const app = express();
app.use((req, res, next) => {
  console.log("--- มันแตกตรงไหน ---");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  next();
});
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  }),
);

app.use("", authRoute);
app.use("/member", memberRoute);
app.use("/admin", adminRoute);
app.use("/", gameRoute);

app.use(notFoundHdl);
app.use(errorHdl);

export default app;
