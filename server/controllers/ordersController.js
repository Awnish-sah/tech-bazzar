import { pool, query } from '../config/db.js';

export const formatOrderRow = (o) => ({
  id: o.id,
  userId: o.user_id,
  date: o.created_at,
  createdAt: o.created_at,
  updatedAt: o.updated_at,
  total: parseFloat(o.total),
  subtotal: o.subtotal ? parseFloat(o.subtotal) : parseFloat(o.total),
  discount: o.discount ? parseFloat(o.discount) : 0,
  shipping: o.shipping ? parseFloat(o.shipping) : 0,
  tax: o.tax ? parseFloat(o.tax) : 0,
  paymentMethod: o.payment_method,
  status: o.status,
  trackingNumber: o.tracking_number || `FDX-${o.id.replace(/[^0-9]/g, '').slice(0, 8)}-US`,
  courierName: o.courier_name || 'FedEx Express',
  estimatedDelivery: o.estimated_delivery,
  deliveredAt: o.delivered_at,
  cancelReason: o.cancel_reason,
  cancelledAt: o.cancelled_at,
  returnReason: o.return_reason,
  returnComments: o.return_comments,
  returnRequestedAt: o.return_requested_at,
  returnStatus: o.return_status || 'None',
  invoiceNumber: o.invoice_number || `INV-${new Date(o.created_at || Date.now()).getFullYear()}-${o.id.replace(/[^0-9]/g, '').slice(-5)}`,
  customer: {
    id: o.customer_id,
    name: o.customer_name,
    email: o.customer_email,
    phone: o.customer_phone,
    address: o.customer_address,
    city: o.customer_city
  },
  items: (o.items || []).map(item => ({
    id: item.id || item.product_id,
    productId: item.product_id || item.id,
    name: item.name,
    price: parseFloat(item.price),
    quantity: parseInt(item.quantity, 10),
    image: item.image
  }))
});

/**
 * Get all orders (Admin view)
 */
export const getOrders = async (req, res) => {
  try {
    const ordersResult = await query(`
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.product_id,
              'product_id', oi.product_id,
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

    const formattedOrders = ordersResult.rows.map(formatOrderRow);

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
 * Get orders for a specific user with search & status filters
 */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { search, status } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const uid = parseInt(userId, 10);

    let sql = `
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.product_id,
              'product_id', oi.product_id,
              'name', oi.name,
              'price', oi.price,
              'quantity', oi.quantity,
              'image', oi.image
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE (o.user_id = $1 OR LOWER(TRIM(o.customer_email)) = (SELECT LOWER(TRIM(email)) FROM users WHERE id = $1 LIMIT 1))
    `;

    const params = [uid];
    let paramIndex = 2;

    // Filter by status
    if (status && status !== 'all') {
      if (status === 'active') {
        sql += ` AND o.status IN ('Pending', 'Processing', 'Shipped')`;
      } else if (status === 'delivered') {
        sql += ` AND o.status = 'Delivered'`;
      } else if (status === 'cancelled') {
        sql += ` AND o.status IN ('Cancelled', 'Return Requested', 'Returned')`;
      } else {
        sql += ` AND o.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }
    }

    // Search query
    if (search && search.trim()) {
      sql += ` AND (
        LOWER(o.id) LIKE $${paramIndex} OR 
        LOWER(o.invoice_number) LIKE $${paramIndex} OR 
        LOWER(o.tracking_number) LIKE $${paramIndex} OR 
        EXISTS (
          SELECT 1 FROM order_items sub_oi 
          WHERE sub_oi.order_id = o.id AND LOWER(sub_oi.name) LIKE $${paramIndex}
        )
      )`;
      params.push(`%${search.trim().toLowerCase()}%`);
      paramIndex++;
    }

    sql += ` GROUP BY o.id ORDER BY o.created_at DESC;`;

    const result = await query(sql, params);
    const orders = result.rows.map(formatOrderRow);

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new customer order with line items & stock decrement (Transactional)
 */
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      id,
      userId,
      customer,
      items,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      paymentMethod
    } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data. Customer and items are required.' });
    }

    const orderId = id || `TB-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNum = `FDX-${Math.floor(10000000 + Math.random() * 90000000)}-US`;

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
        await client.query(`
          UPDATE customers SET
            name = $1, phone = $2, address = $3, city = $4, user_id = COALESCE(user_id, $5)
          WHERE id = $6;
        `, [customer.name, customer.phone, customer.address, customer.city, userId ? parseInt(userId, 10) : null, customerId]);
      } else {
        const newCust = await client.query(`
          INSERT INTO customers (user_id, name, email, phone, address, city)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id;
        `, [userId ? parseInt(userId, 10) : null, customer.name, customer.email.trim().toLowerCase(), customer.phone, customer.address, customer.city]);
        customerId = newCust.rows[0].id;
      }
    }

    // Estimated delivery 3 business days from now
    const estDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    // 2. Insert Order
    const insertOrderSql = `
      INSERT INTO orders (
        id, user_id, customer_id, customer_name, customer_email, customer_phone,
        customer_address, customer_city, total, subtotal, discount, shipping, tax,
        payment_method, status, tracking_number, courier_name, estimated_delivery,
        invoice_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Pending', $15, 'FedEx Express', $16, $17)
      RETURNING *;
    `;

    const orderParams = [
      orderId,
      userId ? parseInt(userId, 10) : null,
      customerId,
      customer.name,
      customer.email,
      customer.phone,
      customer.address,
      customer.city,
      parseFloat(total),
      subtotal ? parseFloat(subtotal) : parseFloat(total),
      discount ? parseFloat(discount) : 0,
      shipping ? parseFloat(shipping) : 0,
      tax ? parseFloat(tax) : 0,
      paymentMethod || 'Credit Card',
      trackingNum,
      estDelivery,
      invoiceNum
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

    const createdOrder = formatOrderRow({
      ...orderRes.rows[0],
      items
    });

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
 * Cancel an order (Allowed if status is Pending or Processing)
 * Restores product inventory stock in PostgreSQL!
 */
export const cancelOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await client.query('BEGIN');

    // Check order status
    const orderCheck = await client.query('SELECT * FROM orders WHERE id = $1;', [id]);
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orderCheck.rows[0];
    if (order.status !== 'Pending' && order.status !== 'Processing') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order with status "${order.status}". Cancellation is only allowed while Pending or Processing.`
      });
    }

    // 1. Update order status to Cancelled
    const updateRes = await client.query(`
      UPDATE orders SET
        status = 'Cancelled',
        cancel_reason = $1,
        cancelled_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `, [reason || 'Cancelled by customer', id]);

    // 2. Restore stock for each item in the order
    const itemsRes = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1;', [id]);
    for (const item of itemsRes.rows) {
      if (item.product_id) {
        await client.query(`
          UPDATE products SET
            stock = stock + $1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $2;
        `, [parseInt(item.quantity, 10), item.product_id]);
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Order successfully cancelled. Product stock has been restored.',
      data: formatOrderRow(updateRes.rows[0])
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

/**
 * Request Return for a Delivered order (Allowed within 14 days of delivery)
 */
export const returnOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, comments } = req.body;

    const orderCheck = await query('SELECT * FROM orders WHERE id = $1;', [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orderCheck.rows[0];
    if (order.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Returns can only be requested for orders that have been successfully Delivered.'
      });
    }

    // Validate 14-day return window
    const deliveredDate = new Date(order.delivered_at || order.updated_at || order.created_at);
    const daysSinceDelivery = (Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceDelivery > 14) {
      return res.status(400).json({
        success: false,
        message: `The 14-day return window has expired for this order (${Math.floor(daysSinceDelivery)} days since delivery).`
      });
    }

    const updateRes = await query(`
      UPDATE orders SET
        status = 'Return Requested',
        return_reason = $1,
        return_comments = $2,
        return_requested_at = CURRENT_TIMESTAMP,
        return_status = 'Requested',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `, [reason || 'Product return request', comments || null, id]);

    res.json({
      success: true,
      message: 'Return request submitted successfully. A courier pickup has been scheduled.',
      data: formatOrderRow(updateRes.rows[0])
    });
  } catch (error) {
    console.error('Error requesting order return:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get structured invoice details
 */
export const getOrderInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const orderRes = await query(`
      SELECT 
        o.*,
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
      WHERE o.id = $1
      GROUP BY o.id;
    `, [id]);

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invoice not found for this order' });
    }

    const order = formatOrderRow(orderRes.rows[0]);

    const invoiceData = {
      invoiceNumber: order.invoiceNumber,
      orderId: order.id,
      orderDate: order.date,
      invoiceDate: new Date().toISOString(),
      seller: {
        name: 'TechBazzar Global Inc.',
        taxId: 'US-TB-9982410-X',
        gstin: 'GST99TECHBAZZAR01',
        email: 'billing@techbazzar.com',
        phone: '+1 (800) 555-TECH',
        address: '100 Silicon Way, Tech Tower, San Francisco, CA 94105'
      },
      buyer: order.customer,
      items: order.items,
      total: order.total,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      tax: order.tax,
      pricing: {
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total
      },
      payment: {
        method: order.paymentMethod,
        status: order.status === 'Cancelled' ? 'Refunded' : 'Paid'
      },
      shippingInfo: {
        courier: order.courierName,
        trackingNumber: order.trackingNumber,
        status: order.status
      }
    };

    res.json({
      success: true,
      data: invoiceData
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get tracking status & milestone events
 */
export const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;

    const orderRes = await query('SELECT * FROM orders WHERE id = $1;', [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orderRes.rows[0];
    const orderCreated = new Date(order.created_at);

    // Milestones
    const milestones = [
      {
        step: 1,
        title: 'Order Confirmed',
        description: 'Payment authorized and order sent to TechBazzar logistics center.',
        date: orderCreated.toISOString(),
        completed: true
      },
      {
        step: 2,
        title: 'Quality Inspection & Packing',
        description: 'Electronic diagnostic check passed. Packed in secure ESD anti-static packaging.',
        date: new Date(orderCreated.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        completed: ['Processing', 'Shipped', 'Delivered'].includes(order.status)
      },
      {
        step: 3,
        title: 'Handed to Courier',
        description: `Dispatched with ${order.courier_name || 'FedEx Express'}. Tracking: ${order.tracking_number || 'FDX-882910'}`,
        date: new Date(orderCreated.getTime() + 18 * 60 * 60 * 1000).toISOString(),
        completed: ['Shipped', 'Delivered'].includes(order.status)
      },
      {
        step: 4,
        title: 'Out for Delivery',
        description: 'Package is on the delivery van arriving at destination address.',
        date: new Date(orderCreated.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        completed: order.status === 'Delivered'
      },
      {
        step: 5,
        title: 'Delivered',
        description: 'Package delivered and signed. 14-day warranty and return window active.',
        date: order.delivered_at || new Date(orderCreated.getTime() + 72 * 60 * 60 * 1000).toISOString(),
        completed: order.status === 'Delivered'
      }
    ];

    res.json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        courier: order.courier_name || 'FedEx Express',
        trackingNumber: order.tracking_number,
        estimatedDelivery: order.estimated_delivery,
        milestones
      }
    });
  } catch (error) {
    console.error('Error fetching order tracking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update order status (Admin)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const deliveredAtSql = status === 'Delivered' ? ', delivered_at = CURRENT_TIMESTAMP' : '';

    const result = await query(`
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP ${deliveredAtSql}
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
