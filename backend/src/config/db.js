import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Construct connection config
// Accepts direct DATABASE_URL or constructs from Supabase parameters
const connectionString = process.env.DATABASE_URL;

let pool = null;

if (connectionString && !connectionString.includes('[YOUR-PASSWORD]')) {
  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Supabase PostgreSQL connections
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err);
  });
} else {
  console.log('ℹ️ DATABASE_URL not set or contains [YOUR-PASSWORD] placeholder. Operating in API/memory synchronization mode.');
}

/**
 * Execute a SQL query with error handling
 */
export const query = async (text, params) => {
  if (!pool) {
    return null;
  }
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log('Executed query', { text: text.substring(0, 50), duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('PostgreSQL Query Error:', { query: text.substring(0, 80), error: err.message });
    throw err;
  }
};

/**
 * Test database connectivity
 */
export const testDbConnection = async () => {
  if (!pool) {
    return { connected: false, message: 'No connection string provided' };
  }
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    console.log('✅ PostgreSQL Database connected successfully:', res.rows[0]);
    return { connected: true, data: res.rows[0] };
  } catch (err) {
    console.warn('⚠️ Could not connect to PostgreSQL directly:', err.message);
    return { connected: false, error: err.message };
  }
};

export default {
  query,
  testDbConnection,
  pool
};
