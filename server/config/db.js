import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'techbazzar_db',
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('⚠️ Unexpected PostgreSQL pool error on idle client:', err.message);
});

/**
 * Execute a parameterized SQL query
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log('Executed query', { text: text.slice(0, 80), duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', { query: text.slice(0, 100), error: error.message });
    throw error;
  }
};

/**
 * Health check helper to verify PostgreSQL connectivity
 */
export const checkConnection = async () => {
  const start = Date.now();
  try {
    const res = await pool.query('SELECT current_database() AS db, version() AS version;');
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      database: res.rows[0].db,
      version: res.rows[0].version.split(' ')[0] + ' ' + res.rows[0].version.split(' ')[1],
      latencyMs
    };
  } catch (error) {
    const targetHost = process.env.PGHOST || 'localhost';
    const targetPort = process.env.PGPORT || '5432';
    const errorMsg = error.message || (error.code ? `Connection error: ${error.code}` : 'Connection failed');
    return {
      connected: false,
      code: error.code || 'UNKNOWN',
      error: errorMsg,
      hint: `Make sure PostgreSQL is running on ${targetHost}:${targetPort} and your database credentials in .env are correct.`
    };
  }
};

export default {
  pool,
  query,
  checkConnection
};
