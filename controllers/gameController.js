const asyncHandler = require("express-async-handler");
const Game = require("../models/gameModel");

const createGame = asyncHandler(async (req, res) => {
  const gameModel = new Game;
  let currentGame = await gameModel.load(req.user.id);

  if(!currentGame) {
    currentGame = await gameModel.create(req.user.id);
  }

  return currentGame;
});

const updateGame = asyncHandler(async (req, res) => {
  const { bowl_score, frame_score } = req.body;
  const gameModel = new Game;
  let throwScenario = "NORMAL";

  if (bowl_score < 0 || bowl_score > 10 || frame_score > 10) {
    res.status(400);
    throw new Error("Bowl score must be in range of 0 to 10 knocked pins in whole frame");
  }

  if(req.params.try == 1 && bowl_score === 10) {
    throwScenario = "STRIKE";
  }
  if(req.params.try == 2 && (frame_score + bowl_score === 10)) {
    throwScenario = "SPARE";
  }

  await gameModel.update(req.params.id, req.params.frame, req.params.try, bowl_score, frame_score, throwScenario);

  if (bowl_score) {
    res.status(201).json({
      _id: req.params.id,
      frame: req.params.frame,
      try: req.params.try,
      bowl_score: bowl_score,
      thow_scenario: throwScenario
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getPreviousGames = asyncHandler(async (req, res) => {
  const gameModel = new Game;
  let previousGames = await gameModel.loadAll(req.user.id);

  return previousGames;
});

module.exports = {
  createGame,
  updateGame,
  getPreviousGames,
};