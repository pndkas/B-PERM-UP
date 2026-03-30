import express from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  updateGame,
} from "../controllers/game.controller.js";
import {
  authAdmin,
  authSuperAdmin,
} from "../middlewares/adminAuth.middleware.js";

const gameRoute = express.Router();

gameRoute.get("/games", getAllGames);
gameRoute.post("/create", authAdmin, createGame);
gameRoute.patch("/:id", authAdmin, updateGame);
gameRoute.delete("/:id", authAdmin, authSuperAdmin, deleteGame);

export default gameRoute;
