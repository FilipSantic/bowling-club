const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getPreviousGames,
  createGame,
  updateGame
} = require("../controllers/gameController");

router
  .route("/")
  .get(protect, getPreviousGames)
  .post(protect, createGame);
router.patch("/:id/:frame/:try", protect, updateGame);

module.exports = router;