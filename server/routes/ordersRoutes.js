import express from 'express';
import {
  getOrders,
  createOrder,
  getUserOrders,
  cancelOrder,
  acknowledgeCancelOrder,
  resolveReturnOrder,
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
router.patch('/:id/acknowledge-cancel', acknowledgeCancelOrder);
router.post('/:id/return', returnOrder);
router.patch('/:id/resolve-return', resolveReturnOrder);

// Standard orders CRUD
router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;
