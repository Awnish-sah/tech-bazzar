import { query } from '../config/db.js';

export const formatAddress = (row) => ({
  id: row.id,
  userId: row.user_id,
  title: row.title || 'Home',
  recipientName: row.recipient_name,
  phone: row.phone,
  streetAddress: row.street_address,
  city: row.city,
  state: row.state,
  zipCode: row.zip_code,
  country: row.country || 'United States',
  isDefault: Boolean(row.is_default),
  createdAt: row.created_at
});

/**
 * Get all addresses for a user
 */
export const getAddresses = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const result = await query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC;',
      [parseInt(userId, 10)]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows.map(formatAddress)
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Add a new address
 */
export const addAddress = async (req, res) => {
  try {
    const { userId, title, recipientName, phone, streetAddress, city, state, zipCode, country, isDefault } = req.body;

    if (!userId || !recipientName || !phone || !streetAddress || !city) {
      return res.status(400).json({ success: false, message: 'Recipient name, phone, street address, and city are required' });
    }

    const uid = parseInt(userId, 10);

    // If setting as default, unmark other defaults
    if (isDefault) {
      await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1;', [uid]);
    } else {
      // If user has no addresses yet, make this one default
      const checkCount = await query('SELECT COUNT(*) FROM addresses WHERE user_id = $1;', [uid]);
      if (parseInt(checkCount.rows[0].count, 10) === 0) {
        req.body.isDefault = true;
      }
    }

    const insertSql = `
      INSERT INTO addresses (user_id, title, recipient_name, phone, street_address, city, state, zip_code, country, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      uid,
      title || 'Home',
      recipientName.trim(),
      phone.trim(),
      streetAddress.trim(),
      city.trim(),
      state ? state.trim() : null,
      zipCode ? zipCode.trim() : null,
      country ? country.trim() : 'United States',
      Boolean(req.body.isDefault)
    ]);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: formatAddress(result.rows[0])
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, recipientName, phone, streetAddress, city, state, zipCode, country, isDefault, userId } = req.body;

    const addressId = parseInt(id, 10);

    if (isDefault && userId) {
      await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1;', [parseInt(userId, 10)]);
    }

    const updateSql = `
      UPDATE addresses SET
        title = COALESCE($1, title),
        recipient_name = COALESCE($2, recipient_name),
        phone = COALESCE($3, phone),
        street_address = COALESCE($4, street_address),
        city = COALESCE($5, city),
        state = COALESCE($6, state),
        zip_code = COALESCE($7, zip_code),
        country = COALESCE($8, country),
        is_default = COALESCE($9, is_default),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *;
    `;

    const result = await query(updateSql, [
      title || null,
      recipientName ? recipientName.trim() : null,
      phone ? phone.trim() : null,
      streetAddress ? streetAddress.trim() : null,
      city ? city.trim() : null,
      state ? state.trim() : null,
      zipCode ? zipCode.trim() : null,
      country ? country.trim() : null,
      isDefault !== undefined ? Boolean(isDefault) : null,
      addressId
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: formatAddress(result.rows[0])
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM addresses WHERE id = $1 RETURNING id, user_id, is_default;', [parseInt(id, 10)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // If deleted address was default, make another one default
    if (result.rows[0].is_default) {
      await query(`
        UPDATE addresses SET is_default = TRUE 
        WHERE id = (SELECT id FROM addresses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1);
      `, [result.rows[0].user_id]);
    }

    res.json({
      success: true,
      message: 'Address removed successfully',
      id: parseInt(id, 10)
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const uid = parseInt(userId, 10);
    const addressId = parseInt(id, 10);

    await query('UPDATE addresses SET is_default = FALSE WHERE user_id = $1;', [uid]);
    const result = await query('UPDATE addresses SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *;', [addressId, uid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Address not found for this user' });
    }

    res.json({
      success: true,
      message: 'Address set as primary default',
      data: formatAddress(result.rows[0])
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
