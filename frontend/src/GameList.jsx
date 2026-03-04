import React from 'react';
import { Grid } from '@mui/material';
import Game from './Game';

const GameList = ({ games, onVerDetalle }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {games.map((game) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
          <Game
            game={game}
            onVerDetalle={onVerDetalle}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default GameList;