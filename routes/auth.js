import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Route for registering a new user
router.post('/register', register);

// Route for logging in an existing user
router.post('/login', login);

export default router;
