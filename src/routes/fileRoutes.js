import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';
import {
  uploadFileController,
  listFilesController,
  deleteFileController,
  getFileInfoController,
  downloadFileController,
  updateFileController,
} from '../controllers/fileController.js';

const router = Router();

router.use(authenticate);
router.post('/upload', upload.single('file'), uploadFileController);
router.get('/list', listFilesController);
router.delete('/delete/:id', deleteFileController);
router.get('/download/:id', downloadFileController);
router.put('/update/:id', upload.single('file'), updateFileController);
router.get('/:id', getFileInfoController);

export default router;

