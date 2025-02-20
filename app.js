import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

// Import route modules
import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import favoritesRoutes from './routes/favorites.js';
import commentsRoutes from './routes/comments.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      process.env.FRONTEND_URL, // production
      'http://localhost:5173',  // local
      'http://127.0.0.1:5173'     // local alternative
    ];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/comments', commentsRoutes);

//error handler
app.use(errorHandler);

export default app;