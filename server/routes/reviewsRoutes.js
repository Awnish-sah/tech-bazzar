import express from 'express';
import {
  getProductReviews,
  createReview,
  getUserReviews
} from '../controllers/reviewsController.js';

const router = express.Router();

// Get reviews for a specific product
router.get('/product/:productId', getProductReviews);

// Get reviews submitted by a specific user
router.get('/user/:userId', getUserReviews);

// Post a new review
router.post('/', createReview);

export default router;
