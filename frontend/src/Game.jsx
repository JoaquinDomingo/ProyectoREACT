const Game = ({game, categorias, plataformas,onEdit, onDelete}) => {
    if (!categorias || !plataformas) {
        return <div>Cargando datos del juego</div>;
    }
    const nombrCat = (id) => categorias.find(c => c.id === String(id)).name || id
    const nombrPlat = (id) => plataformas.find(p => p.id === String(id)).name || id
    const plats = Array.isArray(game.Plataforma) ? game.Plataforma : [game.Plataforma];
    
    return (
        <div className="game">
            <h3>{game.name}</h3>
            <p><strong>Descripcion:</strong> {game.descripcion}</p>
            <p><strong>Fecha de Lanzamiento:{game.Fecha}</strong></p>
            <p><strong>Compañia: {game.Compañia}</strong></p>
            <p><strong>Plataforma/s: {plats.map(nombrPlat).join(", ")} </strong></p>
            <p><strong>Categorias: {game.Categorias.map(nombrCat).join(", ")}</strong></p>
            <p><strong>Precio: {game.Precio}</strong></p>
            <p><strong>Imagen: <img src={game.Imagen}></img></strong></p>
            <a 
                href={game.Video} 
            >
                Ver Trailer en YouTube
            </a>
            <button onClick={() => onEdit(game)}>Editar</button>
            <button onClick={() => onDelete(game.id)}>Borrar</button>
        </div>
    )
}

export default Game