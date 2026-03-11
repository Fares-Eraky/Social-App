import { Router } from 'express';
import { FriendController } from './friend.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { sendRequestSchema } from './friend.validation';

const router = Router();
const friendController = new FriendController();

router.post('/request', authenticate, validate(sendRequestSchema), friendController.sendRequest);
router.post('/accept/:id', authenticate, friendController.acceptRequest);
router.post('/reject/:id', authenticate, friendController.rejectRequest);
router.get('/', authenticate, friendController.getFriends);
router.get('/pending', authenticate, friendController.getPendingRequests);

export default router;
