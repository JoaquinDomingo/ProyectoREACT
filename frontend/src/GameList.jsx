import Game from './Game';

const GameList = ({ games, onVerDetalle }) => {
  return (
    <div className="list-container">
      {games.map((game) => (
        <Game 
          key={game.id} 
          game={game} 
          onVerDetalle={onVerDetalle} 
        />
      ))}
    </div>
  );
};

export default GameList;