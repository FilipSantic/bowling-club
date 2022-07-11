const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getPreviousGames,
  createGame,
  updateGame,
} = require("../controllers/gameController");

router.route("/").get(protect, getPreviousGames).post(protect, createGame);
router.patch(
  "/:id/:current_frame/:bowl_try/:frame_score/:strike_count/:last_frame_scenario/:additional",
  protect,
  updateGame
);

module.exports = router;
