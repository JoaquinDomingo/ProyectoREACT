import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../context/api';
import { useAuxData } from '../hooks/useAuxData';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

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
        <div className="section-container">
            <button className="btn-back" onClick={() => navigate(-1)}>Volver</button>

            <div className="game-detail-page">
                <div className="detail-header">
                    <h2>{game.name}</h2>
                    {isOwner && (
                        <div>
                            <button className="btn-edit" onClick={() => navigate(`/edit-game/${game.id}`)}>Editar</button>
                            <button className="btn-delete" onClick={handleDelete}>Eliminar</button>
                        </div>
                    )}
                </div>

                <div className="detail-content">
                    <img src={game.Imagen} alt={game.name} className="detail-image" />

                    <div className="detail-info">
                        <p><strong>Descripción:</strong> {game.descripcion}</p>
                        <p><strong>Compañía:</strong> {game.Compañia}</p>
                        <p><strong>Lanzamiento:</strong> {game.Fecha}</p>
                        <p><strong>Precio:</strong> {game.Precio} €</p>
                        <p><strong>Propietario:</strong> {game.owner}</p>

                        <div className="tags-container">
                            <strong>Plataformas:</strong>
                            <div className="tags">
                                {plats.map(p => <span key={p} className="tag platform">{nombrPlat(p)}</span>)}
                            </div>
                        </div>

                        <div className="tags-container">
                            <strong>Categorías:</strong>
                            <div className="tags">
                                {game.Categorias.map(c => <span key={c} className="tag category">{nombrCat(c)}</span>)}
                            </div>
                        </div>

                        {game.Video && (
                            <div className="video-link">
                                <a href={game.Video} target="_blank" rel="noopener noreferrer">Ver Trailer</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
