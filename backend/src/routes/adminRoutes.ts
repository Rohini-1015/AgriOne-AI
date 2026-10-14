import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateJwt } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateJwt);
router.use(authorizeRoles('ADMIN'));

router.get('/metrics', AdminController.getMetrics);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/role', AdminController.updateUserRole);

export default router;
