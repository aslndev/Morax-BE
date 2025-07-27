import express from 'express';
import AuthController from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);

router.put('/password', authenticateToken, AuthController.changePassword);

export default router; 