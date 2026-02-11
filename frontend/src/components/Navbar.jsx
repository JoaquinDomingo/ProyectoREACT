import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/games">GameManager</Link>
            </div>
            <div className="navbar-links">
                <Link to="/games">Todos los Juegos</Link>
                <Link to="/my-games">Mis Juegos</Link>
                <Link to="/create-game">Nuevo Juego</Link>
                <span className="user-welcome">Hola, {user.username}</span>
                <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
            </div>
        </nav>
    );
};

export default Navbar;
