import express from 'express';
import UploadController from '../controllers/UploadController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../config/upload.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', upload.single('file'), UploadController.uploadFile);

export default router; 