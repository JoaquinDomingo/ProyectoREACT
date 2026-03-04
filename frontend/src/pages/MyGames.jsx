import React, { useState, useEffect } from 'react';
import api from '../context/api';
import GameList from '../GameList';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material';

const MyGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Paginación
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchMyGames = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/games/my-games?page=${page}&limit=${limit}`);
                setGames(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                console.error("Error fetching my games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyGames();
    }, [page, limit]);

    const handleVerDetalle = (game) => {
        navigate(`/games/${game.id}`);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
        setPage(1); // Volver a la página 1 al cambiar el límite
    };

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Mis Videojuegos
                </Typography>

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="limit-select-label">Juegos por pág.</InputLabel>
                    <Select
                        labelId="limit-select-label"
                        id="limit-select"
                        value={limit}
                        label="Juegos por pág."
                        onChange={handleLimitChange}
                        size="small"
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
            ) : games.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                        No tienes videojuegos registrados en esta página.
                    </Typography>
                </Box>
            ) : (
                <>
                    <GameList
                        games={games}
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
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};

export default MyGames;
