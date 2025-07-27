import express from 'express';
import ProfileController from '../controllers/ProfileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);

export default router; 