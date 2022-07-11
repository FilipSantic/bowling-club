import axios from "axios";

const API_URL = "/api/games";

const createGame = async (gameData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, gameData, config);

  if (response.data) {
    localStorage.setItem("game", JSON.stringify(response.data));
  }

  return response.data;
};

const updateGame = async (gameData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const PARAMS_URL = `/${gameData.game.game_id}/${gameData.game.current_frame}/${gameData.game.bowl_try}/${gameData.game.frame_score}/${gameData.game.strike_count}/${gameData.game.last_frame_scenario}`;
  const response = await axios.patch(API_URL + PARAMS_URL, gameData, config);

  if (response.data) {
    localStorage.setItem("game", JSON.stringify(response.data));
  }

  return response.data;
};

const getGames = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  if (response.data) {
    localStorage.setItem("games", JSON.stringify(response.data));
  }

  return response.data;
};

const gamesService = {
  createGame,
  updateGame,
  getGames,
};

export default gamesService;