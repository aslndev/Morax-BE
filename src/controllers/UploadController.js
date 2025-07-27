import UploadService from '../services/UploadService.js';

class UploadController {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await UploadService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      res.json(result);
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ 
        error: 'File upload failed',
        details: error.message 
      });
    }
  }
}

export default new UploadController(); 