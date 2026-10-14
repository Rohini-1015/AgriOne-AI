import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { authenticateJwt } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJwt);

router.get('/', CartController.getCart);
router.post('/', CartController.addItem);
router.put('/item/:id', CartController.updateItem);
router.delete('/item/:id', CartController.removeItem);
router.delete('/', CartController.clearCart);

export default router;
