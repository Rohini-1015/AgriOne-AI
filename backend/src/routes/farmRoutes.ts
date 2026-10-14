import { Router } from 'express';
import { FarmController } from '../controllers/farmController';
import { authenticateJwt } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJwt);

router.get('/', FarmController.getFarms);
router.post('/', FarmController.createFarm);
router.put('/:id', FarmController.updateFarm);
router.delete('/:id', FarmController.deleteFarm);

export default router;
