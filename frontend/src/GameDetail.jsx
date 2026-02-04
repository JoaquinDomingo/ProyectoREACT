const GameDetail = ({ game, categorias, plataformas, onClose, onEdit, onDelete }) => {
    if (!game) return null;

    const nombrCat = (id) => categorias.find(c => c.id === String(id))?.name || id;
    const nombrPlat = (id) => plataformas.find(p => p.id === String(id))?.name || id;
    const plats = Array.isArray(game.Plataforma) ? game.Plataforma : [game.Plataforma];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-x" onClick={onClose}>&times;</span>
                
                <img src={game.Imagen} alt={game.name} className="modal-banner" />
                
                <div className="modal-details">
                    <h2>{game.name}</h2>
                    <p><strong>Descripción:</strong> {game.descripcion}</p>
                    <p><strong>Compañía:</strong> {game.Compañia} | <strong>Lanzamiento:</strong> {game.Fecha}</p>
                    <p><strong>Plataformas:</strong> {plats.map(nombrPlat).join(", ")}</p>
                    <p><strong>Categorías:</strong> {game.Categorias.map(nombrCat).join(", ")}</p>
                    <p className="modal-price">Precio: {game.Precio} €</p>

                    <div className="modal-video">
                        <a href={game.Video}>Ver el Trailer del Video</a> 
                            
                    </div>

                    <div className="form-buttons">
                        <button className="btn-edit" onClick={() => onEdit(game)}>Editar</button>
                        <button className="btn-delete" onClick={() => onDelete(game.id)}>Borrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetail;