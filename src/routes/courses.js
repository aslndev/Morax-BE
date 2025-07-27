import express from 'express';
import CourseController from '../controllers/CourseController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { loadUserProfile } from '../middleware/profile.js';

const router = express.Router();

router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

router.use(authenticateToken);
router.use(loadUserProfile);

router.post('/', CourseController.createCourse);
router.put('/:id', CourseController.updateCourse);
router.delete('/:id', CourseController.deleteCourse);

router.put('/:id/status', requireRole(['admin']), CourseController.updateCourseStatus);

export default router; 