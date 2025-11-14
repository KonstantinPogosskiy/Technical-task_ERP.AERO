import asyncHandler from '../middleware/asyncHandler.js';

export const infoController = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user.id,
    },
  });
});