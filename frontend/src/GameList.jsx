import { useState } from "react";
import Game from "./Game";

const GameList = ({ games, categorias, plataformas, onEdit, onDelete }) => {

    const [catsSeleccionadas, setCatsSeleccionadas] = useState(
        categorias.map(c => parseInt(c.id))
    );

    const handleCheckboxChange = (id) => {
        const numId = parseInt(id);
        if (catsSeleccionadas.includes(numId)) {
            setCatsSeleccionadas(catsSeleccionadas.filter(c => c !== numId));
        } else {
            setCatsSeleccionadas([...catsSeleccionadas, numId]);
        }
    };

    const filteredGames = games.filter(game => 
        game.Categorias.some(catId => catsSeleccionadas.includes(catId))
    );

    return (
        <div>
            <div className="filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <strong>Filtrar por Categoría:</strong>
                {categorias.map(cat => (
                    <label key={cat.id} style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '4px' }}>
                        <input
                            type="checkbox"
                            checked={catsSeleccionadas.includes(parseInt(cat.id))}
                            onChange={() => handleCheckboxChange(cat.id)}
                        />
                        {cat.name}
                    </label>
                ))}
            </div>

            <div className="list-container">
                {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                        <Game 
                            key={game.id} 
                            game={game} 
                            categorias={categorias} 
                            plataformas={plataformas} 
                            onEdit={onEdit} 
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <p>No hay juegos que coincidan con las categorías seleccionadas.</p>
                )}
            </div>
        </div>
    );
}

export default GameList;