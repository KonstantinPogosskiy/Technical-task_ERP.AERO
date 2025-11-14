import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/appConfig.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });