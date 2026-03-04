import React, { useState, useEffect } from 'react';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { Container, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button, Paper, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminPanel = () => {
    const [reportedGames, setReportedGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir si no es admin
        if (user && user.role !== 'admin') {
            navigate('/games');
            return;
        }

        const fetchReports = async () => {
            try {
                const res = await api.get('/games/admin/reports');
                setReportedGames(res.data);
            } catch (error) {
                console.error("Error fetching reported games:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchReports();
        }
    }, [user, navigate]);

    const handleDeleteGame = async (gameId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este juego reportado? (Esta acción es irreversible)")) {
            try {
                await api.delete(`/games/${gameId}`);
                // Quitar el juego del estado local
                setReportedGames(prev => prev.filter(g => g.id !== gameId));
            } catch (error) {
                console.error("Error deleting game:", error);
                alert("Error al eliminar el juego");
            }
        }
    };

    if (loading) return <Loading />;

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom color="error">
                    Panel de Administración
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Gestión de juegos reportados por la comunidad.
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    Juegos Reportados ({reportedGames.length})
                </Typography>

                <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
                    {reportedGames.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No hay juegos reportados en este momento. ¡Todo limpio!
                            </Typography>
                        </Box>
                    ) : (
                        reportedGames.map((game) => (
                            <ListItem
                                key={game.id}
                                sx={{
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    mb: 2,
                                    borderRadius: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'scale(1.01)', backgroundColor: 'rgba(255,255,255,0.02)' }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                                            {game.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Publicado por: {game.owner}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                                                <Chip
                                                    label={`${game.reports.length} reportes`}
                                                    color="error"
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                    }
                                />
                                <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => navigate(`/games/${game.id}`)}
                                        size="small"
                                    >
                                        Ver
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteGame(game.id)}
                                        size="small"
                                    >
                                        Eliminar
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default AdminPanel;
