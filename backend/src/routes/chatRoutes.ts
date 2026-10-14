import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { optionalAuthJwt } from '../middleware/authMiddleware';

const router = Router();

router.post('/message', optionalAuthJwt, ChatController.sendMessage);
router.get('/history', optionalAuthJwt, ChatController.getHistory);

export default router;
