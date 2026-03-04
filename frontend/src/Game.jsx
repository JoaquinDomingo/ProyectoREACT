import React, { useState } from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Chip, CardActions, IconButton, Tooltip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';

const Game = ({ game, onVerDetalle }) => {
  const { user } = useAuth();

  // Local state to optimistic UI updates
  const [likes, setLikes] = useState(game.likes || []);
  const [dislikes, setDislikes] = useState(game.dislikes || []);

  const hasLiked = user && likes.includes(user.id);
  const hasDisliked = user && dislikes.includes(user.id);

  const handleVote = async (e, voteType) => {
    e.stopPropagation(); // Avoid triggering CardActionArea
    if (!user) return; // Must be logged in

    try {
      const res = await api.post(`/games/${game.id}/vote`, { voteType });
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (error) {
      console.error("Error al votar:", error);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)',
          '& .game-image': {
            transform: 'scale(1.05)',
          }
        },
        backgroundColor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <CardActionArea onClick={() => onVerDetalle(game)} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="220"
            image={game.Imagen}
            alt={game.name}
            className="game-image"
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0) 100%)',
            pointerEvents: 'none'
          }} />
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5, pb: 0 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              fontSize: '1.2rem',
              lineHeight: 1.3,
              mb: 0,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {game.name}
          </Typography>

          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {game.Compañia || 'Desconocida'}
            </Typography>
            <Chip
              label={`${game.Precio} €`}
              color="primary"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Separated CardActions for Buttons to avoid click collision with ActionArea */}
      <CardActions sx={{ px: 2.5, pb: 2, pt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={user ? "Me gusta" : "Inicia sesión para votar"}>
            <span>
              <IconButton
                size="small"
                color={hasLiked ? "success" : "default"}
                onClick={(e) => handleVote(e, hasLiked ? 'none' : 'like')}
                disabled={!user}
              >
                {hasLiked ? <ThumbUpIcon fontSize="small" /> : <ThumbOutlinedIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: hasLiked ? 'success.main' : 'text.secondary' }}>
            {likes.length}
          </Typography>

          <Tooltip title={user ? "No me gusta" : "Inicia sesión para votar"}>
            <span>
              <IconButton
                size="small"
                color={hasDisliked ? "error" : "default"}
                onClick={(e) => handleVote(e, hasDisliked ? 'none' : 'dislike')}
                disabled={!user}
                sx={{ ml: 1 }}
              >
                {hasDisliked ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: hasDisliked ? 'error.main' : 'text.secondary' }}>
            {dislikes.length}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
};

export default Game;