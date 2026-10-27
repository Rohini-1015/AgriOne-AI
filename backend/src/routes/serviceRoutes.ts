import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController';
import { authenticateJwt } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateJwt);

// Equipment
router.get('/equipment', ServiceController.getEquipments);
router.post('/equipment', ServiceController.createEquipment);
router.get('/equipment/requests', ServiceController.getEquipmentRequests);
router.post('/equipment/requests', ServiceController.createEquipmentRequest);
router.put('/equipment/requests/:id/status', authorizeRoles('ADMIN', 'FARMER'), ServiceController.updateEquipmentStatus);

// Labour
router.get('/labour/requests', ServiceController.getLabourRequests);
router.post('/labour/requests', ServiceController.createLabourRequest);
router.put('/labour/requests/:id/status', authorizeRoles('ADMIN', 'FARMER'), ServiceController.updateLabourStatus);

// Logistics
router.get('/logistics/requests', ServiceController.getLogisticsRequests);
router.post('/logistics/requests', ServiceController.createLogisticsRequest);
router.put('/logistics/requests/:id/status', authorizeRoles('ADMIN', 'FARMER'), ServiceController.updateLogisticsStatus);

export default router;
