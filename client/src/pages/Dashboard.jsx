import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GameForm from "../components/GameForm";
import GameItem from '../components/GameItem';
import Spinner from "../components/Spinner";
import {
  createGame,
  getGames,
  reset,
} from "../features/games/gamesSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { game, games, isLoading, isError, message } = useSelector(
    (state) => state.games
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }

    dispatch(getGames());
    dispatch(createGame(user));

    return () => {
      dispatch(reset);
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.username}</h1>
        <h2>Bowling Game</h2>
      </section>

      <GameForm />

      <section className='content'>
        <h2>Current Game</h2>
          <div className='game'>
              <GameItem key={game.id} game={game} />
          </div>
      </section>

      <section className='content'>
        <h2>Previous Games</h2>
        {games.previousGames.length > 0 ? (
          <div className='games'>
            {games.previousGames.map((game) => (
              <GameItem key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <h3>No previous games were played</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;