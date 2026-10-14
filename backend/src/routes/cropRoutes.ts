import { Router } from 'express';
import { CropController } from '../controllers/cropController';
import { optionalAuthJwt } from '../middleware/authMiddleware';

const router = Router();

router.post('/recommend', optionalAuthJwt, CropController.recommend);
router.get('/history', optionalAuthJwt, CropController.getHistory);

export default router;
