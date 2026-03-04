const express = require('express');
const router = express.Router();
const { getAllGames, getMyGames, getGameById, createGame, updateGame, deleteGame, getCategories, getPlatforms, voteGame, addComment, deleteComment, reportGame, getReportedGames, chatWithAssistant } = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');



router.post('/chat', authMiddleware, chatWithAssistant);
router.get('/', authMiddleware, getAllGames);
router.get('/my-games', authMiddleware, getMyGames);
router.get('/admin/reports', authMiddleware, getReportedGames);
router.get('/categorias', authMiddleware, getCategories);
router.get('/plataforma', authMiddleware, getPlatforms);
router.get('/:id', authMiddleware, getGameById);
router.post('/:id/vote', authMiddleware, voteGame);
router.post('/:id/comments', authMiddleware, addComment);
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);
router.post('/:id/report', authMiddleware, reportGame);
router.post('/', authMiddleware, createGame);
router.put('/:id', authMiddleware, updateGame);
router.delete('/:id', authMiddleware, deleteGame);

module.exports = router;
