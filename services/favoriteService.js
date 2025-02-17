import pool from '../db/index.js';

// Create a favorite entry for a user.
export const createFavorite = async (user_id, articleData) => {
  const { article_id, title, url, image_url, published_at, source_name, content } = articleData;
  // Insert the favorite and return the created record.
  const result = await pool.query(
    `INSERT INTO favorites 
       (user_id, article_id, title, url, image_url, published_at, source_name, content)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [user_id, article_id, title, url, image_url, published_at, source_name, content]
  );
  return result.rows[0];
};

// Retrieve all favorites for a given user.
export const getFavoritesByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM favorites WHERE user_id = $1 ORDER BY published_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Delete multiple favorites (bulk delete) for a user.
export const deleteFavoritesByIds = async (user_id, ids) => {
  const result = await pool.query(
    `DELETE FROM favorites 
       WHERE id = ANY($1::int[]) AND user_id = $2 
       RETURNING *`,
    [ids, user_id]
  );
  return result.rows;
};
