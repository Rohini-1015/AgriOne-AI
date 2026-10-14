import { Router } from 'express';
import { MarketController } from '../controllers/marketController';

const router = Router();

router.get('/prices', MarketController.getPrices);
router.get('/trend/:cropName', MarketController.getTrend);

export default router;
