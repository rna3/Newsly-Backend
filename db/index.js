import pkg from 'pg';
const { Pool} = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Create a new pool instance to manage connections
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
