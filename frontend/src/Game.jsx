const Game = ([game, onEdit, onDelete]) => {
    return (
        <div className="game">
            <h3>{game.name}</h3>
            <p><strong>Descripcion:</strong> {game.descripcion}</p>
            <p><strong>Fecha de Lanzamiento:{game.Fecha}</strong></p>
            <p><strong>Compañia: {game.Compañia}</strong></p>
            <p><strong>Plataforma/s: {game.Plataforma} </strong></p>
            <p><strong>Categorias: {game.Categorias}</strong></p>
            <p><strong>Precio: {game.Precio}</strong></p>
            <p><strong>Imagen: {game.Imagen}</strong></p>
            <p><strong>Video: {game.Video}</strong></p>
            <button onClick={() => onEdit(game)}>Editar</button>
            <button onClick={() => onDelete(game.id)}>Borrar</button>
        </div>
    )
}

export default Game