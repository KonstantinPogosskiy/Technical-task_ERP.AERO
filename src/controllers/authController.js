import asyncHandler from '../middleware/asyncHandler.js';
import {
  signup,
  signin,
  refreshSession,
  logout as logoutService,
} from '../services/authService.js';

export const signupController = asyncHandler(async (req, res) => {
  const { id, password } = req.body;
  const { sessionId, ...tokenPayload } = await signup({ id, password });
  res.status(201).json({
    success: true,
    data: {
      userId: id,
      ...tokenPayload,
    },
  });
});

export const signinController = asyncHandler(async (req, res) => {
  const { id, password } = req.body;
  const { sessionId, ...tokenPayload } = await signin({ id, password });
  res.json({
    success: true,
    data: {
      userId: id,
      ...tokenPayload,
    },
  });
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.body.refresh_token;
  const { sessionId, ...tokenPayload } = await refreshSession(refreshToken);
  res.json({
    success: true,
    data: tokenPayload,
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  await logoutService(req.user.tokenRecordId);
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});