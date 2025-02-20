import express from 'express';
import { register, login, getCurrentUser, logout } from '../controllers/authController.js';

const router = express.Router();

// Route for registering a new user
router.post('/register', register);

// Route for logging in an existing user
router.post('/login', login);

//route for logging out
router.post('/logout', logout);

// new endpoint to get current user
router.get('/me', getCurrentUser);

export default router;
