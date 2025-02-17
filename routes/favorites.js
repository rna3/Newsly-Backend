import express from 'express';
import { addFavorite, getFavorites, deleteFavorites } from '../controllers/favoritesController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only authenticated users can add/view favorites
router.post('/', authenticateToken, addFavorite);
router.get('/', authenticateToken, getFavorites);
router.delete('/', authenticateToken, deleteFavorites);

export default router;