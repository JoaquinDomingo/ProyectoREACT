const Game = ({ game, onVerDetalle }) => {
  return (
    <div className="game" onClick={() => onVerDetalle(game)}>
      <img src={game.Imagen} alt={game.name} />
      <div style={{ padding: '10px' }}>
        <h3>{game.name}</h3>
        <p>{game.Precio} €</p>
      </div>
    </div>
  );
};

export default Game;