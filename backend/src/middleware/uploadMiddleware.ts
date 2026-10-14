import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';

// Ensure upload directories exist
const uploadBaseDir = env.UPLOAD_DIR;
const diseaseUploadDir = path.join(uploadBaseDir, 'disease');
const productUploadDir = path.join(uploadBaseDir, 'products');
const avatarUploadDir = path.join(uploadBaseDir, 'avatars');

[uploadBaseDir, diseaseUploadDir, productUploadDir, avatarUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = uploadBaseDir;
    if (req.baseUrl.includes('disease')) {
      dest = diseaseUploadDir;
    } else if (req.baseUrl.includes('products')) {
      dest = productUploadDir;
    } else if (req.baseUrl.includes('profile')) {
      dest = avatarUploadDir;
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
}).single('image');

export const uploadMultipleImages = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter,
}).array('images', 5);
