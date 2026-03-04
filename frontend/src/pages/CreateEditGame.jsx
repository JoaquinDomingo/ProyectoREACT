import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../context/api';
import GameForm from '../GameForm';
import { useAuxData } from '../hooks/useAuxData';
import { Container, Box, Typography, CircularProgress } from '@mui/material';

const CreateEditGame = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { categorias, plataformas } = useAuxData();
    const [gameToEdit, setGameToEdit] = useState(null);
    const [loading, setLoading] = useState(!!id);

    useEffect(() => {
        if (id) {
            const fetchGame = async () => {
                try {
                    const res = await api.get(`/games/${id}`);
                    setGameToEdit(res.data);
                } catch (error) {
                    console.error("Error fetching game to edit:", error);
                    alert("Error al cargar juego para editar");
                    navigate('/games');
                } finally {
                    setLoading(false);
                }
            };
            fetchGame();
        }
    }, [id, navigate]);

    const handleSave = async (gameData) => {
        try {
            if (id) {
                await api.put(`/games/${id}`, gameData);
                alert("Juego actualizado!");
            } else {
                await api.post('/games', gameData);
                alert("Juego creado!");
            }
            navigate('/my-games');
        } catch (error) {
            console.error("Error saving game:", error);
            alert("Error al guardar el juego.");
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    {id ? 'Editar Videojuego' : 'Registrar Videojuego'}
                </Typography>
            </Box>
            <GameForm
                game={gameToEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                categoriasDisponibles={categorias}
                plataformasDisponibles={plataformas}
            />
        </Container>
    );
};

export default CreateEditGame;
