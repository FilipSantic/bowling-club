import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createGame, updateGame, getGames } from "../features/games/gamesSlice";

function GameForm() {
  const { user } = useSelector((state) => state.auth);
  const { game } = useSelector((state) => state.games);
  const [formData, setFormData] = useState({
    score: "",
  });

  const dispatch = useDispatch();

  const { score } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(updateGame({ game, score }));
    setTimeout(function () {
      dispatch(createGame(user));
      dispatch(getGames());
    }, 500);
    setFormData({ score: "" });
  };

  return (
    <section className="form">
      <h3>Current Frame: {game.current_frame}</h3>
      <h3>Try: {game.bowl_try}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Number of knocked pins</label>
          <input
            type="text"
            name="score"
            id="score"
            value={score}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Insert
          </button>
        </div>
      </form>
    </section>
  );
}

export default GameForm;
