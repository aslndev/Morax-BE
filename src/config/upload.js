import multer from 'multer';

const uploadConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
};

export const upload = multer(uploadConfig);

export const thumbnailSizeLimit = parseInt(process.env.MAX_THUMBNAIL_SIZE) || 5 * 1024 * 1024; 