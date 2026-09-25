import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkConnection } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('🚀 Checking PostgreSQL connection...');
  const status = await checkConnection();

  if (!status.connected) {
    console.error('❌ Could not connect to PostgreSQL:');
    console.error(status.error);
    console.log('\n💡 Setup instructions:');
    console.log('1. Make sure your PostgreSQL server is running (e.g. via pgAdmin or Windows Services).');
    console.log('2. Check the credentials in your .env file:');
    console.log('   PGHOST=' + (process.env.PGHOST || 'localhost'));
    console.log('   PGPORT=' + (process.env.PGPORT || '5432'));
    console.log('   PGUSER=' + (process.env.PGUSER || 'postgres'));
    console.log('   PGDATABASE=' + (process.env.PGDATABASE || 'techbazzar_db'));
    console.log('3. In pgAdmin, create a database named "techbazzar_db" if it does not already exist.');
    process.exit(1);
  }

  console.log(`✅ Connected to PostgreSQL database: "${status.database}" (${status.version}) in ${status.latencyMs}ms\n`);

  try {
    // 1. Run schema.sql
    console.log('📦 Executing schema.sql (Creating tables, indexes, triggers)...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSql);
    console.log('✅ Tables created/updated successfully: categories, products, users, addresses, customers, orders, order_items, reviews, admin_users.');

    // 2. Run seed.sql
    console.log('🌱 Executing seed.sql (Populating default products, users, addresses & reviews)...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await pool.query(seedSql);
    console.log('✅ Seed data inserted successfully.');

    // 3. Verify counts
    const productsRes = await pool.query('SELECT COUNT(*) FROM products;');
    const ordersRes = await pool.query('SELECT COUNT(*) FROM orders;');
    const categoriesRes = await pool.query('SELECT COUNT(*) FROM categories;');
    const usersRes = await pool.query('SELECT COUNT(*) FROM users;');
    const addressesRes = await pool.query('SELECT COUNT(*) FROM addresses;');
    const reviewsRes = await pool.query('SELECT COUNT(*) FROM reviews;');
    const bannersRes = await pool.query('SELECT COUNT(*) FROM hero_banners;');

    console.log('\n📊 Database Status Summary:');
    console.log(`   - Categories:   ${categoriesRes.rows[0].count}`);
    console.log(`   - Products:     ${productsRes.rows[0].count}`);
    console.log(`   - Hero Banners: ${bannersRes.rows[0].count}`);
    console.log(`   - Orders:       ${ordersRes.rows[0].count}`);
    console.log(`   - Users:        ${usersRes.rows[0].count}`);
    console.log(`   - Addresses:    ${addressesRes.rows[0].count}`);
    console.log(`   - Reviews:      ${reviewsRes.rows[0].count}`);
    console.log('\n🎉 TechBazzar PostgreSQL database is fully initialized and ready!\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
