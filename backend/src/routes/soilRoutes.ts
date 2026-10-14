import { Router } from 'express';
import { SoilController } from '../controllers/soilController';
import { optionalAuthJwt } from '../middleware/authMiddleware';

const router = Router();

router.post('/analyze', optionalAuthJwt, SoilController.analyze);
router.get('/history', optionalAuthJwt, SoilController.getHistory);
router.get('/:id', optionalAuthJwt, SoilController.getReportById);

export default router;
