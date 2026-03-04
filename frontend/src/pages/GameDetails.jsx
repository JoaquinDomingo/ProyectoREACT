import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../context/api';
import { useAuxData } from '../hooks/useAuxData';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Container, Grid, Typography, Button, Box, Chip, Card, CardMedia, CardContent, Divider, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Avatar, Paper, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const GameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [game, setGame] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const { categorias, plataformas } = useAuxData();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await api.get(`/games/${id}`);
                setGame(res.data);
                setComments(res.data.comments || []);
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

    const handleReport = async () => {
        if (!user) {
            alert('Debes iniciar sesión para reportar un juego.');
            return;
        }
        if (window.confirm('¿Estás seguro de que quieres reportar este juego como inapropiado?')) {
            try {
                await api.post(`/games/${id}/report`);
                alert('Juego reportado exitosamente. Un administrador lo revisará.');
            } catch (error) {
                console.error("Error reporting game:", error);
                alert("Error al reportar el juego");
            }
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;
        try {
            const res = await api.post(`/games/${id}/comments`, { text: newComment });
            const updatedRes = await api.get(`/games/${id}`);
            setComments(updatedRes.data.comments || []);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Error al añadir comentario");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("¿Seguro que quieres borrar este comentario?")) {
            try {
                await api.delete(`/games/${id}/comments/${commentId}`);
                const updatedRes = await api.get(`/games/${id}`);
                setComments(updatedRes.data.comments || []);
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert("Error al eliminar el comentario. Posiblemente no tienes permisos o el comentario tiene respuestas.");
            }
        }
    };

    if (loading) return <Loading />;
    if (!game) return null;

    const nombrCat = (catId) => categorias.find(c => c.id === String(catId) || c.id === Number(catId))?.name || catId;
    const nombrPlat = (platId) => plataformas.find(p => p.id === String(platId) || p.id === Number(platId))?.name || platId;

    const plats = Array.isArray(game.Plataforma) ? game.Plataforma : [game.Plataforma];
    const isOwner = user && game.userId === user.id;
    const isAdmin = user && user.role === 'admin';

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    color="inherit"
                >
                    Volver
                </Button>

                <Tooltip title="Reportar contenido inapropiado">
                    <Button
                        color="warning"
                        variant="text"
                        startIcon={<ReportProblemIcon />}
                        onClick={handleReport}
                    >
                        Reportar
                    </Button>
                </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
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

            {/* SECCIÓN DE COMENTARIOS */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    Comentarios ({comments.length})
                </Typography>

                <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    {user ? (
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Avatar sx={{ bgcolor: 'primary.main', textTransform: 'uppercase' }}>
                                {user.username.charAt(0)}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    placeholder="Añade un comentario..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                >
                                    Comentar
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography color="text.secondary">
                            Inicia sesión para dejar un comentario.
                        </Typography>
                    )}
                </Paper>

                <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, border: comments.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => {
                            const isCommentOwner = user && comment.userId === user.id;
                            const hasReplies = comment.replies && comment.replies.length > 0;
                            const canDelete = isAdmin || (isCommentOwner && !hasReplies);

                            return (
                                <React.Fragment key={comment.id}>
                                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                        <Box sx={{ mr: 2 }}>
                                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main', textTransform: 'uppercase' }}>
                                                {comment.authorName ? comment.authorName.charAt(0) : '?'}
                                            </Avatar>
                                        </Box>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {comment.authorName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(comment.date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body1" sx={{ mt: 1, color: 'text.primary', whiteSpace: 'pre-wrap' }}>
                                                    {comment.text}
                                                </Typography>
                                            }
                                        />
                                        {canDelete && (
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment.id)} color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        )}
                                    </ListItem>
                                    {index < comments.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Sé el primero en comentar sobre este juego.
                            </Typography>
                        </Box>
                    )}
                </List>
            </Box>
        </Container>
    );
};

export default GameDetails;
