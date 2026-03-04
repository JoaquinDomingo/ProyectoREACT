import React, { useState, useEffect } from 'react';
import api from '../context/api';
import GameList from '../GameList';
import { useAuxData } from '../hooks/useAuxData';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Box, InputAdornment, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const AllGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categorias, plataformas } = useAuxData();
    const navigate = useNavigate();

    // Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    // Paginación
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                // Se envía page y limit a la API
                const res = await api.get(`/games?page=${page}&limit=${limit}`);
                setGames(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, [page, limit]);

    const handleVerDetalle = (game) => {
        navigate(`/games/${game.id}`);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setPage(1); // Volver a la página 1 cuando cambia el límite
    };

    // Filtros por lado del cliente sobre los juegos de la "página actual"
    // (Idealmente también bajaría al backend si el dataset es grande, pero seguimos la lógica inicial)
    const gamesFiltrados = games.filter(g => {
        const cumpleNombre = g.name.toLowerCase().includes(searchTerm.toLowerCase());
        const cumpleCategoria = categoriaSeleccionada
            ? g.Categorias.includes(String(categoriaSeleccionada)) || g.Categorias.includes(Number(categoriaSeleccionada))
            : true;
        return cumpleNombre && cumpleCategoria;
    });

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

                <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
                    <InputLabel id="limit-select-label">Juegos por página</InputLabel>
                    <Select
                        labelId="limit-select-label"
                        id="limit-select"
                        value={limit}
                        label="Juegos por página"
                        onChange={handleLimitChange}
                    >
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={12}>12</MenuItem>
                        <MenuItem value={24}>24</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Loading />
            ) : gamesFiltrados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No se encontraron juegos que coincidan con tu búsqueda en esta página.
                    </Typography>
                </Box>
            ) : (
                <>
                    <GameList
                        games={gamesFiltrados}
                        onVerDetalle={handleVerDetalle}
                    />

                    {/* Controles de Paginación */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default AllGames;
