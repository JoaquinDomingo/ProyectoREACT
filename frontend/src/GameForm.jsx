import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, FormGroup, FormControlLabel, Checkbox, Grid, Paper, Divider } from "@mui/material";

const GameForm = ({ game, onSave, onCancel, categoriasDisponibles, plataformasDisponibles }) => {
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
        <Paper elevation={3} sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Nombre del Videojuego"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Fecha Lanzamiento (Ej. 2024)"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Compañía"
                            value={compania}
                            onChange={(e) => setCompania(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Precio (€)"
                            type="number"
                            inputProps={{ step: "0.01" }}
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="URL Imagen"
                            value={imagen}
                            onChange={(e) => setImagen(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="URL Video (Trailer)"
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Categorías</Typography>
                        <FormGroup row>
                            {categoriasDisponibles && categoriasDisponibles.map(cat => (
                                <FormControlLabel
                                    key={cat.id}
                                    control={
                                        <Checkbox
                                            checked={misCategorias.includes(parseInt(cat.id))}
                                            onChange={() => handleToggle(cat.id, misCategorias, setMisCategorias)}
                                        />
                                    }
                                    label={cat.name}
                                />
                            ))}
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" gutterBottom>Plataformas</Typography>
                        <FormGroup row>
                            {plataformasDisponibles && plataformasDisponibles.map(plat => (
                                <FormControlLabel
                                    key={plat.id}
                                    control={
                                        <Checkbox
                                            checked={misPlataformas.includes(parseInt(plat.id))}
                                            onChange={() => handleToggle(plat.id, misPlataformas, setMisPlataformas)}
                                        />
                                    }
                                    label={plat.name}
                                />
                            ))}
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={onCancel}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Guardar Videojuego
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
}

export default GameForm;