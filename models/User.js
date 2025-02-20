import pool from '../db/index.js';

class User {
  // /**
  //  * Finds a user by email.
  //  * @param {string} email
  //  * @returns {Promise<Object|null>}
  //  */
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  // /**
  //  * Creates a new user.
  //  * @param {string} username
  //  * @param {string} email
  //  * @param {string} hashedPassword
  //  * @returns {Promise<Object>}
  //  */
  static async create(username, email, hashedPassword) {
    const result = await pool.query(
      `INSERT INTO users (username, email, password) 
       VALUES ($1, $2, $3) RETURNING *`,
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }
}

export default User;
