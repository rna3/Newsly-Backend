import express from 'express';
import { searchNews } from '../controllers/newsController.js';

const router = express.Router();

// Route for searching news via NewsAPI
router.get('/search', searchNews);

export default router;