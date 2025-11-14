import { Router } from 'express';
import {
  signinController,
  signupController,
  refreshTokenController,
} from '../controllers/authController.js';

const router = Router();

router.post('/signin', signinController);
router.post('/signup', signupController);
router.post('/signin/new_token', refreshTokenController);

export default router;