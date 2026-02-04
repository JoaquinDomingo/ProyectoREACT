import React, { useState, useEffect } from 'react';
import GameList from './GameList';
import GameForm from './GameForm';
import GameDetail from './GameDetail';
import './App.css';

function App() {
  const [games, setGames] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [editingGame, setEditingGame] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resJ = await fetch('http://localhost:3000/videojuegos');
      const resC = await fetch('http://localhost:3000/categorias');
      const resP = await fetch('http://localhost:3000/plataforma');

      setGames(await resJ.json());
      setCategorias(await resC.json());
      setPlataformas(await resP.json());
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleSave = async (gameData) => {
    const url = editingGame 
      ? `http://localhost:3000/videojuegos/${editingGame.id}` 
      : 'http://localhost:3000/videojuegos';
    
    await fetch(url, {
      method: editingGame ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData)
    });

    setEditingGame(null);
    setShowForm(false);
    cargarDatos();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este videojuego?")) {
      await fetch(`http://localhost:3000/videojuegos/${id}`, { method: 'DELETE' });
      cargarDatos();
      setSelectedGame(null);
    }
  };

  const gamesFiltrados = games.filter(g => {
    const cumpleNombre = g.name.toLowerCase().includes(searchTerm.toLowerCase());
    const cumpleCategoria = categoriaSeleccionada 
      ? g.Categorias.includes(String(categoriaSeleccionada)) || g.Categorias.includes(Number(categoriaSeleccionada))
      : true;
    return cumpleNombre && cumpleCategoria;
  });

  return (
    <div className="App">

      {!showForm ? (
        <>
          <div className="section-container">
            <h2>Categorías</h2>
            <div className="categories-grid">
              <div 
                className={`category-card ${!categoriaSeleccionada ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada(null)}
              >
                TODOS
              </div>
              {categorias.map(cat => (
                <div 
                  key={cat.id} 
                  className={`category-card ${categoriaSeleccionada === cat.id ? 'active' : ''}`}
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                >
                  {cat.name.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          <div className="section-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Catálogo de Juegos</h2>
              <button className="btn-add" onClick={() => setShowForm(true)} style={{ margin: 0 }}>
                + Añadir Juego
              </button>
            </div>

            <div className="search-container">
              <input 
                type="text" 
                placeholder="Buscar por nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <GameList 
              games={gamesFiltrados} 
              categorias={categorias} 
              plataformas={plataformas}
              onVerDetalle={(g) => setSelectedGame(g)} 
            />
          </div>
        </>
      ) : (
        <div className="section-container">
          <h2>{editingGame ? 'Editar Juego' : 'Añadir Nuevo Juego'}</h2>
          <GameForm 
            key={editingGame?.id || 'nuevo'}
            game={editingGame} 
            onSave={handleSave} 
            onCancel={() => { setShowForm(false); setEditingGame(null); }}
            categoriasDisponibles={categorias}
            plataformasDisponibles={plataformas}
          />
        </div>
      )}

      {selectedGame && (
        <GameDetail 
          game={selectedGame}
          categorias={categorias}
          plataformas={plataformas}
          onClose={() => setSelectedGame(null)}
          onEdit={(g) => { setEditingGame(g); setShowForm(true); }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;