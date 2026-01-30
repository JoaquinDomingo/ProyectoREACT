import { useEffect, useState } from "react";

const GameForm = ({game, onSave, onCancel}) => {
    const [name, setName] = useState ('')
    const [descripcion, setDescription] = useState('')
    const [fecha, setFecha] = useState('')
    const [compañia, setCompañia] = useState('')
    const [precio, setPrecio] = useState()
    const [imagen, setImagen] = useState('')
    const [video, setVideo] = useState('')

    useEffect(() => {
        if (game) {
            setName(game.name)
            setDescription(game.descripcion)
            setFecha(game.Fecha)
            setCompañia(game.Compañia)
            setPrecio(game.Precio)
            setImagen(game.Imagen)
            setVideo(game.Video)
        } else {
            setName()
            setDescription()
            setFecha()
            setCompañia()
            setPrecio()
            setImagen()
            setVideo()
        }
    }, [game])
    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({name, descripcion, fecha,compañia,precio, imagen, video})
    }

    return (
        <form onSubmit={handleSubmit} className="game-form">
            <div>
                <label>Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

                <label>Descripcion</label>
                <textarea value={descripcion} onChange={(e) => setDescription(e.target.value)}/>
            
                <label>Fecha</label>
                <input type="text" value={fecha} onChange={(e) => setFecha(e.target.value)}></input>
            
            
            
            
            
            
            
            
            
            </div>
        </form>
    )
}