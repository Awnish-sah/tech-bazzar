import { query, pool } from '../config/db.js';

/**
 * Get all reviews for a specific product
 * GET /api/reviews/product/:productId
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await query(`
      SELECT 
        r.id,
        r.product_id AS "productId",
        r.user_id AS "userId",
        r.user_name AS "userName",
        r.user_avatar AS "userAvatar",
        r.rating,
        r.title,
        r.comment,
        r.verified_purchase AS "verifiedPurchase",
        r.created_at AS "createdAt"
      FROM reviews r
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC;
    `, [productId]);

    // Rating breakdown summary
    const summaryResult = await query(`
      SELECT 
        COUNT(*)::int AS count,
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS average,
        COUNT(CASE WHEN rating = 5 THEN 1 END)::int AS stars_5,
        COUNT(CASE WHEN rating = 4 THEN 1 END)::int AS stars_4,
        COUNT(CASE WHEN rating = 3 THEN 1 END)::int AS stars_3,
        COUNT(CASE WHEN rating = 2 THEN 1 END)::int AS stars_2,
        COUNT(CASE WHEN rating = 1 THEN 1 END)::int AS stars_1
      FROM reviews
      WHERE product_id = $1;
    `, [productId]);

    const summary = summaryResult.rows[0] || {
      count: 0,
      average: 0,
      stars_5: 0,
      stars_4: 0,
      stars_3: 0,
      stars_2: 0,
      stars_1: 0
    };

    res.json({
      success: true,
      data: result.rows,
      summary
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new product review
 * POST /api/reviews
 */
export const createReview = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      productId,
      userId = null,
      userName = 'Verified Customer',
      userAvatar = null,
      rating,
      title = '',
      comment
    } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, rating (1-5), and comment are required'
      });
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    // Verify product exists
    const prodCheck = await client.query('SELECT id, name FROM products WHERE id = $1', [productId]);
    if (prodCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user purchased this product for verified badge
    let verifiedPurchase = true;
    if (userId) {
      const purchaseCheck = await client.query(`
        SELECT oi.id 
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.user_id = $1 AND oi.product_id = $2
        LIMIT 1;
      `, [userId, productId]);
      verifiedPurchase = purchaseCheck.rows.length > 0;
    }

    await client.query('BEGIN');

    // Insert review
    const insertRes = await client.query(`
      INSERT INTO reviews (
        product_id, user_id, user_name, user_avatar, rating, title, comment, verified_purchase
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        id,
        product_id AS "productId",
        user_id AS "userId",
        user_name AS "userName",
        user_avatar AS "userAvatar",
        rating,
        title,
        comment,
        verified_purchase AS "verifiedPurchase",
        created_at AS "createdAt";
    `, [productId, userId, userName, userAvatar, numRating, title, comment, verifiedPurchase]);

    const newReview = insertRes.rows[0];

    // Recalculate and update products table rating and reviews_count
    const statsRes = await client.query(`
      SELECT 
        COUNT(*)::int AS count,
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS average
      FROM reviews
      WHERE product_id = $1;
    `, [productId]);

    const newCount = statsRes.rows[0].count;
    const newAvg = statsRes.rows[0].average;

    await client.query(`
      UPDATE products
      SET rating = $1, reviews_count = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3;
    `, [newAvg, newCount, productId]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully! Thank you for your feedback.',
      data: newReview,
      productRating: {
        average: parseFloat(newAvg),
        reviewsCount: parseInt(newCount, 10)
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

/**
 * Get reviews created by a specific user
 * GET /api/reviews/user/:userId
 */
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await query(`
      SELECT 
        r.id,
        r.product_id AS "productId",
        p.name AS "productName",
        p.image AS "productImage",
        p.price AS "productPrice",
        r.rating,
        r.title,
        r.comment,
        r.verified_purchase AS "verifiedPurchase",
        r.created_at AS "createdAt"
      FROM reviews r
      JOIN products p ON p.id = r.product_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
    `, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
