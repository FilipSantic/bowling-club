const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getGames,
  createGame,
} = require("../controllers/gamesController");

router
  .route("/")
  .get(protect, getGames)
  .post(protect, createGame);

module.exports = router;