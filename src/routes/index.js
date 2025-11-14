import { Router } from 'express';
import authRoutes from './authRoutes.js';
import fileRoutes from './fileRoutes.js';
import userRoutes from './userRoutes.js';

export default function createRouter() {
  const router = Router();

  router.use(authRoutes);
  router.use('/file', fileRoutes);
  router.use(userRoutes);

  return router;
}

