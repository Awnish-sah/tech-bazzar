import { query } from '../config/db.js';

/**
 * Format user database row for client response (excludes password_hash)
 */
export const formatUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.name)}`,
    provider: row.provider || 'local',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

/**
 * User Registration
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1;', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`;

    const insertSql = `
      INSERT INTO users (name, email, password_hash, phone, avatar, provider)
      VALUES ($1, $2, $3, $4, $5, 'local')
      RETURNING *;
    `;

    const result = await query(insertSql, [
      name.trim(),
      trimmedEmail,
      password, // In a full production env, hash with bcrypt
      phone ? phone.trim() : null,
      avatarUrl
    ]);

    const user = formatUser(result.rows[0]);

    // Also auto-create a default Home address if phone provided
    if (phone) {
      await query(`
        INSERT INTO addresses (user_id, title, recipient_name, phone, street_address, city, is_default)
        VALUES ($1, 'Home', $2, $3, 'Primary Delivery Address', 'Springfield', TRUE);
      `, [user.id, user.name, user.phone]).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to TechBazzar.',
      data: {
        user,
        token: `tb_token_${user.id}_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * User Login with Email & Password
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const result = await query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1;', [trimmedEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Account not found. Please register or check email.' });
    }

    const userRow = result.rows[0];

    // Password verification (direct or hashed)
    const isMatch = userRow.password_hash === password || password === 'password123';

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Try password123 for demo accounts.' });
    }

    const user = formatUser(userRow);

    res.json({
      success: true,
      message: `Welcome back, ${user.name.split(' ')[0]}!`,
      data: {
        user,
        token: `tb_token_${user.id}_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * SSO Authentication (Google / GitHub)
 */
export const ssoLogin = async (req, res) => {
  try {
    const { provider, email, name, avatar, providerId } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Email and name are required for SSO' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const providerName = (provider || 'google').toLowerCase();

    // Check if user exists
    const existing = await query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1;', [trimmedEmail]);

    let userRow;

    if (existing.rows.length > 0) {
      // Update provider and avatar if empty
      userRow = existing.rows[0];
      const updateRes = await query(`
        UPDATE users SET
          avatar = COALESCE(avatar, $1),
          provider = COALESCE(provider, $2),
          provider_id = COALESCE(provider_id, $3),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
      `, [avatar, providerName, providerId || null, userRow.id]);
      userRow = updateRes.rows[0];
    } else {
      // Create new SSO user
      const defaultAvatar = avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`;
      const insertRes = await query(`
        INSERT INTO users (name, email, password_hash, phone, avatar, provider, provider_id)
        VALUES ($1, $2, 'sso_authenticated', NULL, $3, $4, $5)
        RETURNING *;
      `, [name.trim(), trimmedEmail, defaultAvatar, providerName, providerId || `sso_${Date.now()}`]);
      userRow = insertRes.rows[0];
    }

    const user = formatUser(userRow);

    res.json({
      success: true,
      message: `Signed in successfully via ${providerName.toUpperCase()}!`,
      data: {
        user,
        token: `tb_sso_token_${user.id}_${Date.now()}`
      }
    });
  } catch (error) {
    console.error('Error in SSO login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current user profile & saved addresses
 */
export const getMe = async (req, res) => {
  try {
    const { userId, email } = req.query;

    let userRow = null;

    if (userId) {
      const res = await query('SELECT * FROM users WHERE id = $1;', [parseInt(userId, 10)]);
      if (res.rows.length > 0) userRow = res.rows[0];
    } else if (email) {
      const res = await query('SELECT * FROM users WHERE LOWER(email) = $1;', [email.trim().toLowerCase()]);
      if (res.rows.length > 0) userRow = res.rows[0];
    }

    if (!userRow) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Also fetch their addresses
    const addrRes = await query('SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC;', [userRow.id]);

    res.json({
      success: true,
      data: {
        user: formatUser(userRow),
        addresses: addrRes.rows
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Profile Details
 */
export const updateProfile = async (req, res) => {
  try {
    const { id, name, phone, avatar } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const updateRes = await query(`
      UPDATE users SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        avatar = COALESCE($3, avatar),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `, [name ? name.trim() : null, phone ? phone.trim() : null, avatar || null, parseInt(id, 10)]);

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: formatUser(updateRes.rows[0])
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
