import express from 'express';
import CourseMaterialController from '../controllers/CourseMaterialController.js';
import { authenticateToken } from '../middleware/auth.js';
import { loadUserProfile } from '../middleware/profile.js';

const router = express.Router();

router.get('/:courseId/materials', CourseMaterialController.getMaterialsByCourseId);

router.use(authenticateToken);
router.use(loadUserProfile);

router.post('/:courseId/materials', CourseMaterialController.createMaterial);
router.put('/:courseId/materials/:materialId', CourseMaterialController.updateMaterial);
router.delete('/:courseId/materials/:materialId', CourseMaterialController.deleteMaterial);

export default router; 