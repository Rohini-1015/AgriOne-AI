import { Router } from 'express';
import { SchemeController } from '../controllers/schemeController';
import { authenticateJwt, optionalAuthJwt } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

// Public: View verified schemes
router.get('/', optionalAuthJwt, SchemeController.getAll);
router.get('/:id', optionalAuthJwt, SchemeController.getById);

// Protected: Admin only
router.post('/', authenticateJwt, authorizeRoles('ADMIN'), SchemeController.create);
router.put('/:id', authenticateJwt, authorizeRoles('ADMIN'), SchemeController.update);
router.delete('/:id', authenticateJwt, authorizeRoles('ADMIN'), SchemeController.delete);

export default router;
