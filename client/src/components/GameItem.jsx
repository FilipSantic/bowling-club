function GameItem({ game }) {
  return (
    <div className="game">
      <div>Frame 1: {game.frame_1}</div>
      <div>Frame 2: {game.frame_2}</div>
      <div>Frame 3: {game.frame_3}</div>
      <div>Frame 4: {game.frame_4}</div>
      <div>Frame 5: {game.frame_5}</div>
      <div>Frame 6: {game.frame_6}</div>
      <div>Frame 7: {game.frame_7}</div>
      <div>Frame 8: {game.frame_8}</div>
      <div>Frame 9: {game.frame_9}</div>
      <div>Frame 10: {game.frame_10}</div>
      <h2>Score: {game.score}</h2>
    </div>
  );
}

export default GameItem;