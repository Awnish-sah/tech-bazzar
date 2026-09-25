import { query, pool } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = typeof import.meta?.url === 'string'
  ? path.dirname(fileURLToPath(import.meta.url))
  : process.cwd();

// Helper to convert database snake_case row to frontend camelCase
export const formatProductRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: parseFloat(row.price),
    salePrice: row.sale_price !== null ? parseFloat(row.sale_price) : null,
    rating: parseFloat(row.rating || 5.0),
    reviewsCount: parseInt(row.reviews_count || 0, 10),
    stock: parseInt(row.stock || 0, 10),
    sku: row.sku,
    badge: row.badge,
    isFeatured: Boolean(row.is_featured),
    isFlashDeal: Boolean(row.is_flash_deal),
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    shortDesc: row.short_desc,
    description: row.description,
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * Get all products with optional search, category, brand, and sort filters
 */
export const getProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (search && search.trim()) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(brand) LIKE $${paramIndex} OR LOWER(sku) LIKE $${paramIndex})`;
      params.push(`%${search.trim().toLowerCase()}%`);
      paramIndex++;
    }

    if (category && category !== 'all') {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (brand && brand !== 'all') {
      sql += ` AND brand = $${paramIndex}`;
      params.push(brand);
      paramIndex++;
    }

    if (minPrice) {
      sql += ` AND price >= $${paramIndex}`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      sql += ` AND price <= $${paramIndex}`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Sort order
    if (sort === 'price-low') {
      sql += ' ORDER BY COALESCE(sale_price, price) ASC';
    } else if (sort === 'price-high') {
      sql += ' ORDER BY COALESCE(sale_price, price) DESC';
    } else if (sort === 'rating') {
      sql += ' ORDER BY rating DESC, reviews_count DESC';
    } else {
      // default: featured first, then newest
      sql += ' ORDER BY is_featured DESC, created_at DESC';
    }

    const result = await query(sql, params);
    const products = result.rows.map(formatProductRow);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: formatProductRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error fetching product by id:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new product
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      price,
      salePrice,
      stock,
      sku,
      badge,
      isFeatured,
      isFlashDeal,
      images,
      shortDesc,
      description,
      specs
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const id = req.body.id || `prod-${Date.now()}`;
    const generatedSku = sku || `TB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const insertSql = `
      INSERT INTO products (
        id, name, brand, category, price, sale_price, stock, sku, badge,
        is_featured, is_flash_deal, images, short_desc, description, specs
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *;
    `;

    const params = [
      id,
      name.trim(),
      brand || 'Generic',
      category,
      parseFloat(price),
      salePrice ? parseFloat(salePrice) : null,
      parseInt(stock || 0, 10),
      generatedSku,
      badge || null,
      Boolean(isFeatured),
      Boolean(isFlashDeal),
      JSON.stringify(images || []),
      shortDesc || null,
      description || null,
      JSON.stringify(specs || {})
    ];

    const result = await query(insertSql, params);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formatProductRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      category,
      price,
      salePrice,
      stock,
      badge,
      isFeatured,
      isFlashDeal,
      images,
      shortDesc,
      description,
      specs
    } = req.body;

    const updateSql = `
      UPDATE products SET
        name = COALESCE($1, name),
        brand = COALESCE($2, brand),
        category = COALESCE($3, category),
        price = COALESCE($4, price),
        sale_price = $5,
        stock = COALESCE($6, stock),
        badge = $7,
        is_featured = COALESCE($8, is_featured),
        is_flash_deal = COALESCE($9, is_flash_deal),
        images = COALESCE($10, images),
        short_desc = COALESCE($11, short_desc),
        description = COALESCE($12, description),
        specs = COALESCE($13, specs),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *;
    `;

    const params = [
      name ? name.trim() : null,
      brand ? brand.trim() : null,
      category || null,
      price !== undefined ? parseFloat(price) : null,
      salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : null,
      stock !== undefined ? parseInt(stock, 10) : null,
      badge !== undefined ? badge : null,
      isFeatured !== undefined ? Boolean(isFeatured) : null,
      isFlashDeal !== undefined ? Boolean(isFlashDeal) : null,
      images ? JSON.stringify(images) : null,
      shortDesc || null,
      description || null,
      specs ? JSON.stringify(specs) : null,
      id
    ];

    const result = await query(updateSql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: formatProductRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      id
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle stock status between 0 and 15
 */
export const toggleStock = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await query('SELECT stock FROM products WHERE id = $1;', [id]);

    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const currentStock = parseInt(check.rows[0].stock, 10);
    const newStock = currentStock > 0 ? 0 : 15;

    const result = await query(
      'UPDATE products SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;',
      [newStock, id]
    );

    res.json({
      success: true,
      message: `Stock updated to ${newStock}`,
      data: formatProductRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error toggling stock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Reset products catalog to default seed
 */
export const resetCatalog = async (req, res) => {
  try {
    const seedPath = path.join(__dirname, '../db/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await pool.query(seedSql);

    const result = await query('SELECT * FROM products ORDER BY is_featured DESC, created_at DESC;');
    res.json({
      success: true,
      message: 'Catalog reset to defaults',
      data: result.rows.map(formatProductRow)
    });
  } catch (error) {
    console.error('Error resetting catalog:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

