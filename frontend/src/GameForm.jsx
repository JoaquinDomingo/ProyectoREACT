import { useEffect, useState } from "react";

const GameForm = ({game, onSave, onCancel, categoriasDisponibles, plataformasDisponibles}) => {
    const [name, setName] = useState('')
    const [descripcion, setDescription] = useState('')
    const [fecha, setFecha] = useState('')
    const [compania, setCompania] = useState('')
    const [precio, setPrecio] = useState('')
    const [imagen, setImagen] = useState('')
    const [video, setVideo] = useState('')
    
    const [misCategorias, setMisCategorias] = useState([]);
    const [misPlataformas, setMisPlataformas] = useState([]);

    useEffect(() => {
        if (game) {
            setName(game.name || '')
            setDescription(game.descripcion || '')
            setFecha(game.Fecha || '')
            setCompania(game.Compañia || '')
            setPrecio(game.Precio || '')
            setImagen(game.Imagen || '')
            setVideo(game.Video || '')
            setMisCategorias(game.Categorias || [])
            setMisPlataformas(Array.isArray(game.Plataforma) ? game.Plataforma : [game.Plataforma])
        } else {
            setName('')
            setDescription('')
            setFecha('')
            setCompania('')
            setPrecio('')
            setImagen('')
            setVideo('')
            setMisCategorias([])
            setMisPlataformas([])
        }
    }, [game])

    const handleToggle = (id, lista, setLista) => {
        const numId = parseInt(id);
        lista.includes(numId) 
            ? setLista(lista.filter(i => i !== numId)) 
            : setLista([...lista, numId]);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            name, 
            descripcion, 
            Fecha: fecha, 
            Compañia: compania, 
            Precio: parseFloat(precio), 
            Imagen: imagen, 
            Video: video,
            Categorias: misCategorias,
            Plataforma: misPlataformas
        })
    }

    return (
        <form onSubmit={handleSubmit} className="game-form">
            <h3>{game ? "Editar Videojuego" : "Añadir Nuevo Videojuego"}</h3>
            
            <div className="form-group">
                <label>Nombre:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Descripción:</label>
                <textarea value={descripcion} onChange={(e) => setDescription(e.target.value)} required />

                <label>Fecha Lanzamiento:</label>
                <input type="text" value={fecha} onChange={(e) => setFecha(e.target.value)} />

                <label>Compañía:</label>
                <input type="text" value={compania} onChange={(e) => setCompania(e.target.value)} />

                <label>Precio (€):</label>
                <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} />

                <label>URL Imagen:</label>
                <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} />

                <label>URL Video:</label>
                <input type="text" value={video} onChange={(e) => setVideo(e.target.value)} />
            </div>

            <div className="form-selection">
                <h4>Categorías</h4>
                {categoriasDisponibles && categoriasDisponibles.map(cat => (
                  <label key={cat.id}>
                    <input 
                      type="checkbox" 
                      checked={misCategorias.includes(parseInt(cat.id))} 
                      onChange={() => handleToggle(cat.id, misCategorias, setMisCategorias)} 
                    /> {cat.name}
                  </label>
                ))}
            </div>

            <div className="form-selection">
                <h4>Plataformas</h4>
                {plataformasDisponibles && plataformasDisponibles.map(plat => (
                  <label key={plat.id}>
                    <input 
                      type="checkbox" 
                      checked={misPlataformas.includes(parseInt(plat.id))} 
                      onChange={() => handleToggle(plat.id, misPlataformas, setMisPlataformas)} 
                    /> {plat.name}
                  </label>
                ))}
            </div>

            <div className="form-buttons">
                <button type="submit">Guardar Videojuego</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    )
}

export default GameForm;