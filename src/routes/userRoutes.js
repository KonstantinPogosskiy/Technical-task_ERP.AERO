import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { infoController } from '../controllers/userController.js';
import { logoutController } from '../controllers/authController.js';

const router = Router();

router.use(authenticate);
router.get('/info', infoController);
router.get('/logout', logoutController);

export default router;

