import React, { useState, useEffect } from 'react';
import api from '../context/api';
import GameList from '../GameList';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

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
        <div className="section-container">
            <h2>Mis Videojuegos</h2>
            {games.length === 0 ? (
                <p>No tienes videojuegos registrados.</p>
            ) : (
                <GameList
                    games={games}
                    onVerDetalle={handleVerDetalle}
                />
            )}
        </div>
    );
};

export default MyGames;
