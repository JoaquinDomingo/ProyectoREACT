const { readData, saveData } = require('../utils/db');

// Helper for pagination
const paginate = (array, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return {
        data: array.slice(startIndex, endIndex),
        total: array.length,
        currentPage: page,
        totalPages: Math.ceil(array.length / limit)
    };
};

const getAllGames = (req, res) => {
    const db = readData();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const enrichedGames = db.games.map(game => {
        const owner = db.users.find(user => user.id === game.userId);
        return {
            ...game,
            owner: owner ? owner.username : 'Unknown'
        };
    });

    const result = paginate(enrichedGames, page, limit);
    res.json(result);
};

const getMyGames = (req, res) => {
    const db = readData();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const myGames = db.games.filter(game => game.userId === req.user.id);

    // Enrich my games too (though owner is me)
    const enrichedGames = myGames.map(game => ({
        ...game,
        owner: req.user.username
    }));

    const result = paginate(enrichedGames, page, limit);
    res.json(result);
};

const getGameById = (req, res) => {
    const { id } = req.params;
    const db = readData();
    const game = db.games.find(g => g.id === id);

    if (!game) {
        return res.status(404).json({ message: 'Game not found' });
    }

    const owner = db.users.find(user => user.id === game.userId);
    const enrichedGame = {
        ...game,
        owner: owner ? owner.username : 'Unknown'
    };

    res.json(enrichedGame);
};

const createGame = (req, res) => {
    const { name, descripcion, Fecha, Compañia, Plataforma, Categorias, Precio, Imagen, Video } = req.body;
    const db = readData();

    const newGame = {
        id: Date.now().toString(),
        userId: req.user.id,
        name,
        descripcion,
        Fecha,
        Compañia,
        Plataforma,
        Categorias,
        Precio,
        Imagen,
        Video
    };

    db.games.push(newGame);
    saveData(db);

    res.status(201).json(newGame);
};

const updateGame = (req, res) => {
    const { id } = req.params;
    const db = readData();
    const gameIndex = db.games.findIndex(g => g.id === id);

    if (gameIndex === -1) {
        return res.status(404).json({ message: 'Game not found' });
    }

    // Only owner can update
    if (db.games[gameIndex].userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this game' });
    }

    const updatedGame = {
        ...db.games[gameIndex],
        ...req.body,
        userId: req.user.id // Ensure ownership doesn't change
    };

    db.games[gameIndex] = updatedGame;
    saveData(db);

    res.json(updatedGame);
};

const deleteGame = (req, res) => {
    const { id } = req.params;
    const db = readData();
    const gameIndex = db.games.findIndex(g => g.id === id);

    if (gameIndex === -1) {
        return res.status(404).json({ message: 'Game not found' });
    }

    const game = db.games[gameIndex];
    const userRole = req.user.role;
    const userId = req.user.id;

    // Allow if Owner OR Admin
    if (game.userId === userId || userRole === 'admin') {
        db.games.splice(gameIndex, 1);
        saveData(db);
        return res.json({ message: 'Game deleted' });
    } else {
        return res.status(403).json({ message: 'Not authorized to delete this game' });
    }
};

const getCategories = (req, res) => {
    const db = readData();
    res.json(db.categorias);
};

const getPlatforms = (req, res) => {
    const db = readData();
    res.json(db.plataforma);
};

module.exports = { getAllGames, getMyGames, getGameById, createGame, updateGame, deleteGame, getCategories, getPlatforms };
