import express from 'express';
import {
  getOrders,
  createOrder,
  getUserOrders,
  cancelOrder,
  returnOrder,
  getOrderInvoice,
  getOrderTracking,
  updateOrderStatus
} from '../controllers/ordersController.js';

const router = express.Router();

// User-specific orders
router.get('/user/:userId', getUserOrders);

// Tracking and invoice for an order
router.get('/:id/tracking', getOrderTracking);
router.get('/:id/invoice', getOrderInvoice);

// Order actions
router.post('/:id/cancel', cancelOrder);
router.post('/:id/return', returnOrder);

// Standard orders CRUD
router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;
