import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';

const Game = ({ game, onVerDetalle }) => {
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
          {/* Subtle gradient overlay to make text pop if we ever place it on the image, and just looks premium */}
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
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 2.5 }}>
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
    </Card>
  );
};

export default Game;