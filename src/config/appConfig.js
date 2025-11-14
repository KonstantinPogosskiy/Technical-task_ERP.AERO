import path from 'path';

export const config = {
  uploadDir: process.env.UPLOAD_DIR || path.resolve('uploads'),
};