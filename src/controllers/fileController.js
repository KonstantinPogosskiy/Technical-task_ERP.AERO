import fs from 'fs/promises';
import path from 'path';
import asyncHandler from '../middleware/asyncHandler.js';
import {
  createFileRecord,
  listFiles,
  findFileById,
  deleteFileRecord,
  updateFileRecord,
} from '../services/fileService.js';
import { AppError } from '../utils/errors.js';
import { config } from '../config/appConfig.js';

export const uploadFileController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, 'File is required');
  }

  const fileData = {
    userId: req.user.id,
    originalName: req.file.originalname,
    storedName: req.file.filename,
    extension: path.extname(req.file.originalname),
    mimeType: req.file.mimetype,
    size: req.file.size,
  };

  const fileId = await createFileRecord(fileData);
  const savedFile = await findFileById(fileId, req.user.id);

  res.status(201).json({
    success: true,
    data: {
      id: savedFile.id,
      originalName: savedFile.originalName,
      extension: savedFile.extension,
      mimeType: savedFile.mimeType,
      size: savedFile.size,
      uploadedAt: savedFile.uploadedAt,
    },
  });
});

export const listFilesController = asyncHandler(async (req, res) => {
  const rawListSize = Number.parseInt(req.query.list_size, 10);
  const rawPage = Number.parseInt(req.query.page, 10);
  const pageSize = Number.isNaN(rawListSize) || rawListSize <= 0 ? 10 : rawListSize;
  const page = Number.isNaN(rawPage) || rawPage <= 0 ? 1 : rawPage;
  const result = await listFiles({
    userId: req.user.id,
    page,
    pageSize,
  });

  const formattedItems = result.items.map((item) => ({
    id: item.id,
    originalName: item.originalName,
    extension: item.extension,
    mimeType: item.mimeType,
    size: item.size,
    uploadedAt: item.uploadedAt,
  }));

  res.json({
    success: true,
    data: formattedItems,
    pagination: result.pagination,
  });
});

export const getFileInfoController = asyncHandler(async (req, res) => {
  const file = await findFileById(req.params.id, req.user.id);
  if (!file) {
    throw new AppError(404, 'File not found');
  }

  res.json({
    success: true,
    data: {
      id: file.id,
      originalName: file.originalName,
      extension: file.extension,
      mimeType: file.mimeType,
      size: file.size,
      uploadedAt: file.uploadedAt,
    },
  });
});

export const deleteFileController = asyncHandler(async (req, res) => {
  const file = await findFileById(req.params.id, req.user.id);
  if (!file) {
    throw new AppError(404, 'File not found');
  }

  await deleteFileRecord(file.id, req.user.id);

  const filepath = path.join(config.uploadDir, file.storedName);
  await fs.unlink(filepath).catch(() => {});

  res.json({
    success: true,
    message: 'File deleted successfully',
  });
});

export const downloadFileController = asyncHandler(async (req, res) => {
  const file = await findFileById(req.params.id, req.user.id);
  if (!file) {
    throw new AppError(404, 'File not found');
  }

  const filepath = path.join(config.uploadDir, file.storedName);
  res.download(filepath, file.originalName, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404).json({ success: false, message: 'File not founf' });
      } else {
        res.status(500).json({ success: false, message: 'Failed to download file' });
      }
    }
  });
});

export const updateFileController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, 'File is required');
  }

  const file = await findFileById(req.params.id, req.user.id);
  if (!file) {
    throw new AppError(404, 'File not found');
  }

  const newData = {
    originalName: req.file.originalname,
    storedName: req.file.filename,
    extension: path.extname(req.file.originalname),
    mimeType: req.file.mimetype,
    size: req.file.size,
  };

  await updateFileRecord({
    id: file.id,
    userId: req.user.id,
    ...newData,
  });

  const updatedFile = await findFileById(file.id, req.user.id);
  const oldPath = path.join(config.uploadDir, file.storedName);
  await fs.unlink(oldPath).catch(() => {});

  res.json({
    success: true,
    data: {
      id: updatedFile.id,
      originalName: updatedFile.originalName,
      extension: updatedFile.extension,
      mimeType: updatedFile.mimeType,
      size: updatedFile.size,
      uploadedAt: updatedFile.uploadedAt,
    },
  });
});