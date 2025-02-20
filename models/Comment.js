import pool from '../db/index.js';

class Comment {
  // /**
  //  * Creates a new comment and returns it with the associated username.
  //  * @param {number} user_id
  //  * @param {string} article_id
  //  * @param {string} commentText
  //  * @returns {Promise<Object>}
  //  */
  static async create(user_id, article_id, commentText) {
    const insertResult = await pool.query(
      `INSERT INTO comments (user_id, article_id, comment)
       VALUES ($1, $2, $3) RETURNING id`,
      [user_id, article_id, commentText]
    );
    const insertedId = insertResult.rows[0].id;
    const result = await pool.query(
      `SELECT c.*, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = $1`,
      [insertedId]
    );
    return result.rows[0];
  }

  // /**
  //  * Retrieves comments for a given article.
  //  * @param {string} article_id
  //  * @returns {Promise<Array>}
  //  */
  static async getByArticleId(article_id) {
    const result = await pool.query(
      `SELECT c.*, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.article_id = $1 
       ORDER BY c.created_at DESC`,
      [article_id]
    );
    return result.rows;
  }

  // /**
  //  * Updates a comment if the user is authorized.
  //  * @param {number} commentId
  //  * @param {number} user_id
  //  * @param {string} commentText
  //  * @returns {Promise<Object>}
  //  */
  static async update(commentId, user_id, commentText) {
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
    await pool.query('UPDATE comments SET comment = $1 WHERE id = $2', [commentText, commentId]);
    const updated = await pool.query(
      `SELECT c.*, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = $1`,
      [commentId]
    );
    return updated.rows[0];
  }

  // /**
  //  * Deletes a comment if the user is authorized.
  //  * @param {number} commentId
  //  * @param {number} user_id
  //  * @returns {Promise<Object>}
  //  */
  static async delete(commentId, user_id) {
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
  }
}

export default Comment;
