import express from 'express';
import { register, login, ssoLogin, getMe, updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/sso', ssoLogin);
router.get('/me', getMe);
router.put('/profile', updateProfile);

export default router;
