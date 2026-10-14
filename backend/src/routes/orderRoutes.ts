import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateJwt } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJwt);

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/status', OrderController.updateOrderStatus);

export default router;
