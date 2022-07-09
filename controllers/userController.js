const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { createGame, getPreviousGames } = require("../controllers/gameController");

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const userModel = new User;

  if (!username || !password) {
    res.status(400);
    throw new Error("Some of the fields are missing");
  }

  const userExists = await userModel.findOne(username);

  if (userExists) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create(username, hashedPassword);

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: username,
      password: hashedPassword,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const userModel = new User;

  const user = await userModel.findOne(username);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      password: user.password,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const getUserData = asyncHandler(async (req, res) => {
  let currentGame = await createGame(req, res);
  let previousGames = await getPreviousGames(req, res);

  if (currentGame) {
    res.status(201).json({
      game_id: currentGame.id,
      user_id: currentGame.user_id,
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
      current_frame: currentGame.current_frame,
      score: currentGame.score,
      ongoing: currentGame.ongoing,
      previous_games: previousGames
    });
  } else {
    res.status(400);
    throw new Error("Error loading game");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserData,
};