import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import createRouter from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { config } from './config/appConfig.js';
import { initializeDatabase } from './db/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = config.uploadDir || path.resolve('uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  logger.info(`Created upload directory at ${UPLOAD_DIR}`);
}

app.use(
  cors({
    origin: (_origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/', createRouter());
app.use(errorHandler);

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Server failed to start', error);
    process.exit(1);
  }
}

startServer();