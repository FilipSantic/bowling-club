import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import gamesService from "./gamesService";

const game = JSON.parse(localStorage.getItem("game"));
const games = JSON.parse(localStorage.getItem("games"));

const initialState = {
  game: game ? game : null,
  games: games ? games : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createGame = createAsyncThunk(
  "games/create",
  async (gameData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await gamesService.createGame(gameData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateGame = createAsyncThunk(
  "games/update",
  async (gameData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await gamesService.updateGame(gameData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getGames = createAsyncThunk(
  "games/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await gamesService.getGames(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const gamesSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGame.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.game = action.payload;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateGame.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.game = action.payload;
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGames.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.games = action.payload;
      })
      .addCase(getGames.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = gamesSlice.actions;
export default gamesSlice.reducer;
