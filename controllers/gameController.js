const asyncHandler = require("express-async-handler");
const Game = require("../models/gameModel");

const createGame = asyncHandler(async (req, res) => {
  const gameModel = new Game;
  let game = await gameModel.load(req.user.id);

  if(!game) {
    game = await gameModel.create(req.user.id);
  }

  if (game) {
    res.status(201).json({
      _id: game.id,
      user_id: game.user_id,
      frame_1: game.frame_1,
      frame_2: game.frame_2,
      frame_3: game.frame_3,
      frame_4: game.frame_4,
      frame_5: game.frame_5,
      frame_6: game.frame_6,
      frame_7: game.frame_7,
      frame_8: game.frame_8,
      frame_9: game.frame_9,
      frame_10: game.frame_10,
      score: game.score,
      ongoing: game.ongoing,
    });
  } else {
    res.status(400);
    throw new Error("Game was not started");
  }
});

const getGames = asyncHandler(async (req, res) => {
});

module.exports = {
  createGame,
  getGames,
};