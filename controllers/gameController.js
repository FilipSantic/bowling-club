const asyncHandler = require("express-async-handler");
const Game = require("../models/gameModel");

const createGame = asyncHandler(async (req, res) => {
  const gameModel = new Game();
  let currentGame = await gameModel.load(req.user.id);

  if (!currentGame) {
    currentGame = await gameModel.create(req.user.id);
  }

  if (currentGame) {
    res.status(201).json({
      game_id: currentGame.id,
      user_id: currentGame.user_id,
      current_frame: currentGame.current_frame,
      bowl_try: currentGame.bowl_try,
      bowl_1_score: currentGame.bowl_1_score,
      frame_score: currentGame.frame_score,
      strike_count: currentGame.strike_count,
      last_frame_scenario: currentGame.last_frame_scenario,
      additional: currentGame.additional,
      frame_1: currentGame.frame_1,
      frame_2: currentGame.frame_2,
      frame_3: currentGame.frame_3,
      frame_4: currentGame.frame_4,
      frame_5: currentGame.frame_5,
      frame_6: currentGame.frame_6,
      frame_7: currentGame.frame_7,
      frame_8: currentGame.frame_8,
      frame_9: currentGame.frame_9,
      frame_10: currentGame.frame_10,
      score: currentGame.score,
      ongoing: currentGame.ongoing,
    });
  } else {
    res.status(400);
    throw new Error("Error creating or loading game");
  }
});

const updateGame = asyncHandler(async (req, res) => {
  const gameModel = new Game();
  let throwScenario = "NORMAL";
  let strikeCount;

  if (!req.body.score || req.body.score < 0 || req.body.score > 10) {
    res.status(400);
    throw new Error(
      "Bowl score must be in range of 0 to 10 knocked pins in whole frame"
    );
  }

  if (Number(req.params.frame_score) + Number(req.body.score) > 10) {
    res.status(400);
    throw new Error("You can not knock more than 10 pins in a frame");
  }

  if (req.params.additional == 0) {
    if (req.params.bowl_try == 1 && req.body.score == 10) {
      strikeCount = Number(++req.params.strike_count);
      if (req.params.current_frame == 10) {
        throwScenario = "STRIKE_LAST";
      } else {
        throwScenario = "STRIKE";
      }
    }
    if (
      req.params.bowl_try == 2 &&
      Number(req.params.frame_score) + Number(req.body.score) === 10
    ) {
      if (req.params.current_frame == 10) {
        throwScenario = "SPARE_LAST";
      } else {
        throwScenario = "SPARE";
      }
    }
  } else if (req.params.additional == 1) {
    throwScenario = "SPARE_ADDITIONAL";
  } else if (req.params.additional == 2) {
    if (req.body.score == 10) {
      strikeCount = Number(++req.params.strike_count);
    }
    throwScenario = "STRIKE_ADDITIONAL";
  }

  await gameModel.update(
    req.params.id,
    req.params.current_frame,
    req.params.bowl_try,
    strikeCount,
    req.params.last_frame_scenario,
    req.body.score,
    throwScenario
  );

  if (req.body.score) {
    res.status(201).json({
      game_id: req.params.id,
      current_frame: req.params.current_frame,
      bowl_try: req.params.bowl_try,
      frame_score: req.params.frame_score,
      strike_count: strikeCount,
      last_frame_scenario: req.params.last_frame_scenario,
      additional: req.params.additional,
      score: req.body.score,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

const getPreviousGames = asyncHandler(async (req, res) => {
  const gameModel = new Game();
  let previousGames = await gameModel.loadAll(req.user.id);

  if (previousGames) {
    res.status(201).json({
      previousGames,
    });
  } else {
    res.status(400);
    throw new Error("Error loading game");
  }
});

module.exports = {
  createGame,
  updateGame,
  getPreviousGames,
};
