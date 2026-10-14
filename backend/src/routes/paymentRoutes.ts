import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticateJwt } from '../middleware/authMiddleware';

const router = Router();

router.post('/initiate', authenticateJwt, PaymentController.initiate);
router.post('/verify', PaymentController.verify);
router.post('/webhook', PaymentController.webhook);

export default router;
