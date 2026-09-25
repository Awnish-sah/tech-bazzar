import { query } from '../config/db.js';

const formatBannerRow = (b) => ({
  id: b.id,
  title: b.title,
  subtitle: b.subtitle,
  tagline: b.tagline,
  price: b.price ? parseFloat(b.price) : null,
  originalPrice: b.original_price ? parseFloat(b.original_price) : null,
  badge: b.badge,
  image: b.image,
  accentColor: b.accent_color || 'from-cyan-500 to-blue-600',
  link: b.link || '#catalog-section',
  specs: b.specs || [],
  displayOrder: b.display_order || 0,
  isActive: Boolean(b.is_active),
  createdAt: b.created_at,
  updatedAt: b.updated_at
});

/**
 * Get all hero banners (active ones for storefront, all for admin)
 * GET /api/banners
 */
export const getHeroBanners = async (req, res) => {
  try {
    const { all } = req.query;
    const filterSql = all === 'true' ? '' : 'WHERE is_active = TRUE';
    
    const result = await query(`
      SELECT * FROM hero_banners
      ${filterSql}
      ORDER BY display_order ASC, id ASC;
    `);

    res.json({
      success: true,
      data: result.rows.map(formatBannerRow)
    });
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new hero banner (Admin)
 * POST /api/banners
 */
export const createHeroBanner = async (req, res) => {
  try {
    const {
      title,
      subtitle = '',
      tagline = '',
      price = null,
      originalPrice = null,
      badge = 'Featured',
      image,
      accentColor = 'from-cyan-500 to-blue-600',
      link = '#catalog-section',
      specs = [],
      displayOrder = 0,
      isActive = true
    } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image URL are required' });
    }

    const result = await query(`
      INSERT INTO hero_banners (
        title, subtitle, tagline, price, original_price, badge, image, accent_color, link, specs, display_order, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `, [
      title.trim(),
      subtitle.trim(),
      tagline.trim(),
      price ? parseFloat(price) : null,
      originalPrice ? parseFloat(originalPrice) : null,
      badge.trim(),
      image.trim(),
      accentColor,
      link,
      JSON.stringify(specs),
      parseInt(displayOrder || 0, 10),
      Boolean(isActive)
    ]);

    res.status(201).json({
      success: true,
      message: 'Hero banner created successfully',
      data: formatBannerRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error creating hero banner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update an existing hero banner (Admin)
 * PUT /api/banners/:id
 */
export const updateHeroBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      tagline,
      price,
      originalPrice,
      badge,
      image,
      accentColor,
      link,
      specs,
      displayOrder,
      isActive
    } = req.body;

    const result = await query(`
      UPDATE hero_banners SET
        title = COALESCE($1, title),
        subtitle = COALESCE($2, subtitle),
        tagline = COALESCE($3, tagline),
        price = COALESCE($4, price),
        original_price = COALESCE($5, original_price),
        badge = COALESCE($6, badge),
        image = COALESCE($7, image),
        accent_color = COALESCE($8, accent_color),
        link = COALESCE($9, link),
        specs = COALESCE($10, specs),
        display_order = COALESCE($11, display_order),
        is_active = COALESCE($12, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *;
    `, [
      title,
      subtitle,
      tagline,
      price !== undefined ? parseFloat(price) : null,
      originalPrice !== undefined ? parseFloat(originalPrice) : null,
      badge,
      image,
      accentColor,
      link,
      specs ? JSON.stringify(specs) : null,
      displayOrder !== undefined ? parseInt(displayOrder, 10) : null,
      isActive !== undefined ? Boolean(isActive) : null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Hero banner not found' });
    }

    res.json({
      success: true,
      message: 'Hero banner updated successfully',
      data: formatBannerRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error updating hero banner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a hero banner (Admin)
 * DELETE /api/banners/:id
 */
export const deleteHeroBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM hero_banners WHERE id = $1 RETURNING id;', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Hero banner not found' });
    }

    res.json({
      success: true,
      message: 'Hero banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hero banner:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Toggle hero banner active state (Admin)
 * PATCH /api/banners/:id/active
 */
export const toggleHeroBannerActive = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      UPDATE hero_banners
      SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Hero banner not found' });
    }

    res.json({
      success: true,
      message: `Banner status set to ${result.rows[0].is_active ? 'Active' : 'Inactive'}`,
      data: formatBannerRow(result.rows[0])
    });
  } catch (error) {
    console.error('Error toggling hero banner active:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
