const express = require('express');
const router = express.Router();
const { getAllGames, getMyGames, getGameById, createGame, updateGame, deleteGame, getCategories, getPlatforms } = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/', authMiddleware, getAllGames);
router.get('/my-games', authMiddleware, getMyGames);
router.get('/categorias', authMiddleware, getCategories);
router.get('/plataforma', authMiddleware, getPlatforms);
router.get('/:id', authMiddleware, getGameById);
router.post('/', authMiddleware, createGame);
router.put('/:id', authMiddleware, updateGame);
router.delete('/:id', authMiddleware, deleteGame);

module.exports = router;
