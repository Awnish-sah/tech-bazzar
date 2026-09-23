import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrderStatus
} from '../controllers/ordersController.js';

const router = express.Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;

