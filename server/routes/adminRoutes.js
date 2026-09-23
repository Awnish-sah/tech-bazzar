import express from 'express';
import { login, getMetrics, getHealth } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', login);
router.get('/metrics', getMetrics);
router.get('/health', getHealth);

export default router;

