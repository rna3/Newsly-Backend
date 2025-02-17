-- Users table to store user information
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table to store favorited articles by users
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  article_id TEXT NOT NULL,
  title TEXT,
  url TEXT,
  image_url TEXT,
  published_at TIMESTAMP,
  source_name TEXT,
  content TEXT,
  UNIQUE (user_id, article_id)
);

-- Comments table for user comments on articles
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  article_id TEXT NOT NULL,
  title TEXT,
  url TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
