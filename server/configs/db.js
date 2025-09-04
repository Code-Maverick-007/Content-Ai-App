import { Pool } from '@neondatabase/serverless';

// Create a connection pool with the database URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
};

// Test the connection when the server starts
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', { error, text });
    throw error;
  }
};

export {
  pool,
  query,
  testConnection
};

export default {
  pool,
  query,
  testConnection
};
