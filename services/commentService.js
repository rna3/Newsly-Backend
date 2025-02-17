import pool from '../db/index.js';

// Create a new comment and return it (joined with username).
export const createComment = async (user_id, article_id, commentText) => {
  // Insert the comment and get its new id.
  const insertResult = await pool.query(
    `INSERT INTO comments (user_id, article_id, comment)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [user_id, article_id, commentText]
  );
  const insertedId = insertResult.rows[0].id;
  
  // Fetch the inserted comment joined with the user's username.
  const commentResult = await pool.query(
    `SELECT c.*, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [insertedId]
  );
  return commentResult.rows[0];
};

// Get all comments for a specific article.
export const getCommentsByArticleId = async (article_id) => {
  const result = await pool.query(
    `SELECT c.*, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.article_id = $1
     ORDER BY c.created_at DESC`,
    [article_id]
  );
  return result.rows;
};

// Update a comment (ensuring it belongs to the user) and return the updated comment.
export const updateCommentById = async (commentId, user_id, commentText) => {
  const existing = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
  if (existing.rows.length === 0) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    throw err;
  }
  if (existing.rows[0].user_id !== user_id) {
    const err = new Error('Not authorized to update this comment');
    err.statusCode = 403;
    throw err;
  }
  await pool.query(
    `UPDATE comments SET comment = $1 WHERE id = $2`,
    [commentText, commentId]
  );
  const updated = await pool.query(
    `SELECT c.*, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = $1`,
    [commentId]
  );
  return updated.rows[0];
};

// Delete a comment (ensuring it belongs to the user) and return the deleted comment.
export const deleteCommentById = async (commentId, user_id) => {
  const existing = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
  if (existing.rows.length === 0) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    throw err;
  }
  if (existing.rows[0].user_id !== user_id) {
    const err = new Error('Not authorized to delete this comment');
    err.statusCode = 403;
    throw err;
  }
  const result = await pool.query(
    'DELETE FROM comments WHERE id = $1 RETURNING *',
    [commentId]
  );
  return result.rows[0];
};
