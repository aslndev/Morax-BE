import express from 'express';
import AdminController from '../controllers/AdminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { loadUserProfile } from '../middleware/profile.js';

const router = express.Router();

router.use(authenticateToken);
router.use(loadUserProfile);
router.use(requireRole(['admin']));

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/role', AdminController.updateUserRole);
router.delete('/users/:id', AdminController.deleteUser);

export default router; 