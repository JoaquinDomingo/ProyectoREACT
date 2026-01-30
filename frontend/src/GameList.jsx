import { useState } from "react";
import Game from "./Game";

const GameList = ({games, onEdit, onDelete}) => {
    const [category, setCategory] = useState()
    const filteredGames = games.filter(game => (category ? game.Categorias === category : true))

    return (
        <div>
            <div className="filters">
                <label>
                    Filtrado por Categoria
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </label>
            </div>
            {filteredGames.map((game) => (
                <Game key={game.id} game={game} onEdit={onEdit} onDelete={onDelete}/>
            ))}
        </div>
    )

}

export default GameList

