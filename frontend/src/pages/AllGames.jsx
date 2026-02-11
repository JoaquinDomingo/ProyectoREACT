import React, { useState, useEffect } from 'react';
import api from '../context/api';
import GameList from '../GameList';
import { useAuxData } from '../hooks/useAuxData';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const AllGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const { categorias, plataformas } = useAuxData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await api.get('/games?limit=100');
                setGames(res.data.data);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleVerDetalle = (game) => {
        navigate(`/games/${game.id}`);
    };

    const gamesFiltrados = games.filter(g => {
        const cumpleNombre = g.name.toLowerCase().includes(searchTerm.toLowerCase());
        const cumpleCategoria = categoriaSeleccionada
            ? g.Categorias.includes(String(categoriaSeleccionada)) || g.Categorias.includes(Number(categoriaSeleccionada))
            : true;
        return cumpleNombre && cumpleCategoria;
    });

    if (loading) return <Loading />;

    return (
        <div className="section-container">
            <h2>Catálogo Completo</h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    onChange={(e) => setCategoriaSeleccionada(e.target.value ? parseInt(e.target.value) : null)}
                    value={categoriaSeleccionada || ''}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <GameList
                games={gamesFiltrados}
                onVerDetalle={handleVerDetalle}
            />
        </div>
    );
};

export default AllGames;
