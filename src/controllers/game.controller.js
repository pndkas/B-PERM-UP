import createHttpError from "http-errors";
import {
  createNewGame,
  deleteGameById,
  findAllGames,
  updateGameById,
} from "../services/game.service.js";

export const getAllGames = async (req, res, next) => {
  try {
    const games = await findAllGames();
    res.json(games);
  } catch (error) {
    next(error);
  }
};

export const createGame = async (req, res, next) => {
  try {
    const { gameName, uidGame, category, imageUrl } = req.body;

    if (!gameName || !uidGame) {
      throw createHttpError(400, "ข้อมูลไม่ครบถ้วน (gameName, uidGame)");
    }

    const data = { gameName, uidGame, category, imageUrl };
    const newGame = await createNewGame(data);

    res.status(201).json({ message: "สร้างเกมสำเร็จ", data: newGame });
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedGame = await updateGameById(id, req.body);
    res.json({ message: "อัปเดตข้อมูลสำเร็จ", data: updatedGame });
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteGameById(id);
    res.json({ message: "ลบเกมสำเร็จ" });
  } catch (error) {
    next(error);
  }
};
