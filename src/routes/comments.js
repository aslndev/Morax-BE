import express from 'express';
import CommentController from '../controllers/CommentController.js';
import { authenticateToken } from '../middleware/auth.js';
import { loadUserProfile } from '../middleware/profile.js';

const router = express.Router();

router.get('/:courseId/comments', CommentController.getCommentsByCourseId);

router.use(authenticateToken);
router.use(loadUserProfile);

router.post('/:courseId/comments', CommentController.createComment);
router.put('/:courseId/comments/:commentId', CommentController.updateComment);
router.delete('/:courseId/comments/:commentId', CommentController.deleteComment);

export default router; 