import express from 'express';
import { addComment, getComments, updateComment, deleteComment } from '../controllers/commentsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/comments - Add a comment to an article.
// Protected route: requires valid JWT.
router.post('/', authenticateToken, addComment);

// GET /api/comments?article_id=XYZ - Retrieve all comments for a specific article.
// Protected route: requires valid JWT.
router.get('/', authenticateToken, getComments);

router.patch('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;
