import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

const DEFAULT_NEON_URL = 'postgresql://neondb_owner:npg_mAECLdX32yqF@ep-polished-feather-b34msen7-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const rawConnectionString = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || DEFAULT_NEON_URL;
// Sanitize channel_binding=require for node-postgres compatibility with Neon Pooler
const connectionString = rawConnectionString
  ? rawConnectionString.replace(/([?&])channel_binding=require(&?)/gi, (match, p1, p2) => (p1 === '?' && p2 ? '?' : p2 ? p1 : ''))
  : null;

const isLocalConnection = connectionString
  ? connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
  : (process.env.PGHOST || 'localhost') === 'localhost' || process.env.PGHOST === '127.0.0.1';

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: !isLocalConnection ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'techbazzar_db',
      ssl: process.env.PGSSL === 'true' || !isLocalConnection ? { rejectUnauthorized: false } : false,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('⚠️ Unexpected PostgreSQL pool error on idle client:', err.message);
});

let isDbInitialized = false;
let initPromise = null;

/**
 * Automatically initialize schema.sql & seed.sql on a fresh cloud PostgreSQL database
 * (such as Neon, Supabase, or Render PostgreSQL when deployed to Netlify)
 */
export const ensureDatabaseInitialized = async () => {
  if (isDbInitialized) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Check if products table and hero_banners table exist
      const checkRes = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'products'
        ) AS has_products,
        EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'hero_banners'
        ) AS has_banners;
      `);

      const { has_products, has_banners } = checkRes.rows[0] || {};

      if (!has_products || !has_banners) {
        console.log('📦 Fresh PostgreSQL database detected. Running schema.sql & seed.sql automatically...');
        const dbDir = path.resolve(__dirname, '../db');
        const schemaSql = fs.readFileSync(path.join(dbDir, 'schema.sql'), 'utf8');
        const seedSql = fs.readFileSync(path.join(dbDir, 'seed.sql'), 'utf8');

        await pool.query(schemaSql);
        await pool.query(seedSql);
        await pool.query("SELECT setval('customers_id_seq', COALESCE((SELECT MAX(id) FROM customers), 1));");
        await pool.query("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));");
        await pool.query("SELECT setval('addresses_id_seq', COALESCE((SELECT MAX(id) FROM addresses), 1));");
        await pool.query("SELECT setval('reviews_id_seq', COALESCE((SELECT MAX(id) FROM reviews), 1));");
        await pool.query("SELECT setval('order_items_id_seq', COALESCE((SELECT MAX(id) FROM order_items), 1));");
        console.log('✅ Cloud PostgreSQL schema & seed data initialized successfully!');
      } else {
        // Ensure latest columns exist
        await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_acknowledged BOOLEAN DEFAULT FALSE;');
        await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_acknowledged_at TIMESTAMP WITH TIME ZONE;');
      }

      isDbInitialized = true;
      return true;
    } catch (err) {
      console.warn('⚠️ Auto-init check warning:', err.message);
      initPromise = null;
      return false;
    }
  })();

  return initPromise;
};

/**
 * Execute a parameterized SQL query
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    await ensureDatabaseInitialized();
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
    await ensureDatabaseInitialized();
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
      hint: `Make sure DATABASE_URL is configured in Netlify Environment Variables or PostgreSQL is running on ${targetHost}:${targetPort}.`
    };
  }
};

export default {
  pool,
  query,
  checkConnection,
  ensureDatabaseInitialized
};
