import express from "express";

const app = express();
app.use(express.json());

app.use("", (req, res) => {
  res.json("test Service");
});

app.use("", (req, res) => {
  res.json("test Service");
});

export default app;
