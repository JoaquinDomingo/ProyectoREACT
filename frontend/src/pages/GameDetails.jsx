import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../context/api';
import { useAuxData } from '../hooks/useAuxData';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Container, Grid, Typography, Button, Box, Chip, Card, CardMedia, CardContent, Divider, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VideocamIcon from '@mui/icons-material/Videocam';

const GameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const { categorias, plataformas } = useAuxData();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await api.get(`/games/${id}`);
                setGame(res.data);
            } catch (error) {
                console.error("Error fetching game details:", error);
                alert("Error al cargar el juego o no existe.");
                navigate('/games');
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este juego?")) {
            try {
                await api.delete(`/games/${id}`);
                alert("Juego eliminado correctamente");
                navigate('/my-games');
            } catch (error) {
                console.error("Error deleting game:", error);
                alert("Error al eliminar el juego");
            }
        }
    };

    if (loading) return <Loading />;
    if (!game) return null;

    const nombrCat = (catId) => categorias.find(c => c.id === String(catId) || c.id === Number(catId))?.name || catId;
    const nombrPlat = (platId) => plataformas.find(p => p.id === String(platId) || p.id === Number(platId))?.name || platId;

    const plats = Array.isArray(game.Plataforma) ? game.Plataforma : [game.Plataforma];
    const isOwner = user && game.userId === user.id;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
                color="inherit"
            >
                Volver
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h3" component="h1" fontWeight="bold">
                    {game.name}
                </Typography>
                {isOwner && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/edit-game/${game.id}`)}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                        >
                            Eliminar
                        </Button>
                    </Box>
                )}
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <Card elevation={3}>
                        <CardMedia
                            component="img"
                            image={game.Imagen}
                            alt={game.name}
                            sx={{ width: '100%', height: 'auto', maxHeight: 600, objectFit: 'cover' }}
                        />
                    </Card>

                    {game.Video && (
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<VideocamIcon />}
                            href={game.Video}
                            target="_blank"
                            rel="noopener noreferrer"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Ver Trailer
                        </Button>
                    )}
                </Grid>

                <Grid item xs={12} md={7}>
                    <Card elevation={2} sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }}>
                        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                            <Typography variant="h6" gutterBottom color="primary">
                                Acerca del juego
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4, lineHeight: 1.7 }}>
                                {game.descripcion}
                            </Typography>

                            <Divider sx={{ my: 3 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Compañía</Typography>
                                    <Typography variant="body1" fontWeight="medium">{game.Compañia}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Lanzamiento</Typography>
                                    <Typography variant="body1" fontWeight="medium">{game.Fecha}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Precio</Typography>
                                    <Typography variant="body1" fontWeight="medium">{game.Precio} €</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Propietario</Typography>
                                    <Typography variant="body1" fontWeight="medium">{game.owner}</Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Plataformas
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {plats.map(p => (
                                        <Chip key={p} label={nombrPlat(p)} color="primary" variant="outlined" />
                                    ))}
                                </Box>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Categorías
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {game.Categorias.map(c => (
                                        <Chip key={c} label={nombrCat(c)} color="secondary" />
                                    ))}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default GameDetails;
