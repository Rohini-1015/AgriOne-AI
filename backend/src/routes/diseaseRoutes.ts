import { Router } from 'express';
import { DiseaseController } from '../controllers/diseaseController';
import { optionalAuthJwt } from '../middleware/authMiddleware';
import { uploadSingleImage } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/predict', optionalAuthJwt, uploadSingleImage, DiseaseController.predict);
router.get('/history', optionalAuthJwt, DiseaseController.getHistory);
router.get('/:id', optionalAuthJwt, DiseaseController.getScanById);

export default router;
