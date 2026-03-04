import React, { useState, useEffect } from 'react';
import api from '../context/api';
import GameList from '../GameList';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { Container, Typography } from '@mui/material';

const MyGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyGames = async () => {
            try {
                const res = await api.get('/games/my-games?limit=100');
                setGames(res.data.data);
            } catch (error) {
                console.error("Error fetching my games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyGames();
    }, []);

    const handleVerDetalle = (game) => {
        navigate(`/games/${game.id}`);
    };

    if (loading) return <Loading />;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Mis Videojuegos
            </Typography>
            {games.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No tienes videojuegos registrados.
                </Typography>
            ) : (
                <GameList
                    games={games}
                    onVerDetalle={handleVerDetalle}
                />
            )}
        </Container>
    );
};

export default MyGames;
