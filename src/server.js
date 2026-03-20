import dotenv from "dotenv";
import app from "./app.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`PERM is running ${PORT}`));
