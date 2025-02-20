// backend/models/Favorite.js
import pool from '../db/index.js';

class Favorite {
//   /**
//    * Creates a new favorite record for a user.
//    * @param {number} user_id
//    * @param {Object} articleData - Must include article_id, title, url, image_url, published_at, source_name, and content.
//    * @returns {Promise<Object>}
//    */
  static async create(user_id, articleData) {
    const { article_id, title, url, image_url, published_at, source_name, content } = articleData;
    const result = await pool.query(
      `INSERT INTO favorites 
       (user_id, article_id, title, url, image_url, published_at, source_name, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [user_id, article_id, title, url, image_url, published_at, source_name, content]
    );
    return result.rows[0];
  }

//   /**
//    * Retrieves all favorites for a given user.
//    * @param {number} user_id
//    * @returns {Promise<Array>}
//    */
  static async getByUserId(user_id) {
    const result = await pool.query(
      `SELECT * FROM favorites WHERE user_id = $1 ORDER BY published_at DESC`,
      [user_id]
    );
    return result.rows;
  }

//   /**
//    * Deletes favorites by their IDs for a given user.
//    * @param {number} user_id
//    * @param {Array<number>} ids
//    * @returns {Promise<Array>}
//    */
  static async deleteByIds(user_id, ids) {
    const result = await pool.query(
      `DELETE FROM favorites 
       WHERE id = ANY($1::int[]) AND user_id = $2 
       RETURNING *`,
      [ids, user_id]
    );
    return result.rows;
  }
}

export default Favorite;
