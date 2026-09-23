import { pool, query } from '../config/db.js';

/**
 * Get all orders with customer details and line items
 */
export const getOrders = async (req, res) => {
  try {
    const ordersResult = await query(`
      SELECT 
        o.id,
        o.total,
        o.payment_method,
        o.status,
        o.created_at,
        o.updated_at,
        o.customer_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.customer_address,
        o.customer_city,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.product_id,
              'name', oi.name,
              'price', oi.price,
              'quantity', oi.quantity,
              'image', oi.image
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `);

    const formattedOrders = ordersResult.rows.map(o => ({
      id: o.id,
      date: o.created_at,
      total: parseFloat(o.total),
      paymentMethod: o.payment_method,
      status: o.status,
      customer: {
        id: o.customer_id,
        name: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone,
        address: o.customer_address,
        city: o.customer_city
      },
      items: o.items.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity, 10),
        image: item.image
      }))
    }));

    res.json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new customer order with line items & stock decrement (Transactional)
 */
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id, customer, items, total, paymentMethod } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data. Customer and items are required.' });
    }

    const orderId = id || `TB-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    await client.query('BEGIN');

    // 1. Insert or find customer
    let customerId = null;
    if (customer.email) {
      const custCheck = await client.query(
        'SELECT id FROM customers WHERE email = $1 LIMIT 1;',
        [customer.email.trim().toLowerCase()]
      );

      if (custCheck.rows.length > 0) {
        customerId = custCheck.rows[0].id;
        // Update customer details
        await client.query(`
          UPDATE customers SET
            name = $1, phone = $2, address = $3, city = $4
          WHERE id = $5;
        `, [customer.name, customer.phone, customer.address, customer.city, customerId]);
      } else {
        const newCust = await client.query(`
          INSERT INTO customers (name, email, phone, address, city)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id;
        `, [customer.name, customer.email.trim().toLowerCase(), customer.phone, customer.address, customer.city]);
        customerId = newCust.rows[0].id;
      }
    }

    // 2. Insert Order
    const insertOrderSql = `
      INSERT INTO orders (
        id, customer_id, customer_name, customer_email, customer_phone,
        customer_address, customer_city, total, payment_method, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending')
      RETURNING *;
    `;

    const orderParams = [
      orderId,
      customerId,
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
      customer.city,
      parseFloat(total),
      paymentMethod || 'Credit Card'
    ];

    const orderRes = await client.query(insertOrderSql, orderParams);

    // 3. Insert line items & decrement product stock
    for (const item of items) {
      const price = parseFloat(item.salePrice || item.price);
      const qty = parseInt(item.quantity || 1, 10);
      const itemImage = item.images && item.images[0] ? item.images[0] : (item.image || null);

      await client.query(`
        INSERT INTO order_items (order_id, product_id, name, price, quantity, image)
        VALUES ($1, $2, $3, $4, $5, $6);
      `, [orderId, item.id || null, item.name, price, qty, itemImage]);

      // Decrement stock if product exists
      if (item.id) {
        await client.query(`
          UPDATE products
          SET stock = GREATEST(0, stock - $1), updated_at = CURRENT_TIMESTAMP
          WHERE id = $2;
        `, [qty, item.id]);
      }
    }

    await client.query('COMMIT');

    const createdOrder = {
      id: orderId,
      date: orderRes.rows[0].created_at,
      total: parseFloat(total),
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Pending',
      customer,
      items
    };

    res.status(201).json({
      success: true,
      message: 'Order created successfully in PostgreSQL',
      data: createdOrder
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const result = await query(`
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: {
        id,
        status: result.rows[0].status,
        updatedAt: result.rows[0].updated_at
      }
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

