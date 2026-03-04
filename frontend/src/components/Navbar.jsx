import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/games"
                    sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                >
                    GameManager
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button color="inherit" component={Link} to="/games">
                        Todos los Juegos
                    </Button>
                    <Button color="inherit" component={Link} to="/my-games">
                        Mis Juegos
                    </Button>
                    <Button color="inherit" component={Link} to="/create-game">
                        Nuevo Juego
                    </Button>
                    <Typography variant="body1" sx={{ ml: 2, mr: 2 }}>
                        Hola, {user.username}
                    </Typography>
                    <Button variant="outlined" color="inherit" onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
