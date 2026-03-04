import React, { useState, useEffect } from 'react';
import api from '../context/api';
import GameList from '../GameList';
import { useAuxData } from '../hooks/useAuxData';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const AllGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categorias, plataformas } = useAuxData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await api.get('/games?limit=100');
                setGames(res.data.data);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleVerDetalle = (game) => {
        navigate(`/games/${game.id}`);
    };

    const gamesFiltrados = games.filter(g => {
        const cumpleNombre = g.name.toLowerCase().includes(searchTerm.toLowerCase());
        const cumpleCategoria = categoriaSeleccionada
            ? g.Categorias.includes(String(categoriaSeleccionada)) || g.Categorias.includes(Number(categoriaSeleccionada))
            : true;
        return cumpleNombre && cumpleCategoria;
    });

    if (loading) return <Loading />;

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    fontWeight="800"
                    sx={{
                        background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                        mb: 1
                    }}
                >
                    Catálogo de Juegos
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Explora nuestra colección completa de títulos, filtra por categoría y encuentra tu próxima aventura.
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: 3,
                    mb: 4,
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 4px 20px -5px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <TextField
                    label="Buscar por nombre..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, width: '100%' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ minWidth: { xs: '100%', md: 250 } }}>
                    <InputLabel id="categoria-select-label">Filtrar por categoría</InputLabel>
                    <Select
                        labelId="categoria-select-label"
                        id="categoria-select"
                        value={categoriaSeleccionada}
                        label="Filtrar por categoría"
                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                        <MenuItem value=""><em>Todas las categorías</em></MenuItem>
                        {categorias.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {gamesFiltrados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No se encontraron juegos que coincidan con tu búsqueda.
                    </Typography>
                </Box>
            ) : (
                <GameList
                    games={gamesFiltrados}
                    onVerDetalle={handleVerDetalle}
                />
            )}
        </Container>
    );
};

export default AllGames;
