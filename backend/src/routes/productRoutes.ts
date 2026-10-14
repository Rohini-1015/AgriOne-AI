import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticateJwt, optionalAuthJwt } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { uploadSingleImage } from '../middleware/uploadMiddleware';

const router = Router();

// Public: Browse products
router.get('/', optionalAuthJwt, ProductController.getAll);
router.get('/:id', optionalAuthJwt, ProductController.getById);

// Protected: Farmer / Admin create, edit, delete
router.post(
  '/',
  authenticateJwt,
  authorizeRoles('FARMER', 'ADMIN'),
  uploadSingleImage,
  ProductController.create
);

router.put(
  '/:id',
  authenticateJwt,
  authorizeRoles('FARMER', 'ADMIN'),
  uploadSingleImage,
  ProductController.update
);

router.delete(
  '/:id',
  authenticateJwt,
  authorizeRoles('FARMER', 'ADMIN'),
  ProductController.delete
);

export default router;
