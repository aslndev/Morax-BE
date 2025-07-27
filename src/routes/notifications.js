import express from 'express';
import NotificationController from '../controllers/NotificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', NotificationController.getNotifications);
router.put('/:id/read', NotificationController.markAsRead);

export default router; 