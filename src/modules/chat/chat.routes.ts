import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { sendMessageSchema, createGroupSchema, getOrCreateChatSchema } from './chat.validation';

const router = Router();
const chatController = new ChatController();

router.post('/', authenticate, validate(getOrCreateChatSchema), chatController.getOrCreateChat);
router.get('/', authenticate, chatController.getUserChats);
router.post('/:id/messages', authenticate, validate(sendMessageSchema), chatController.sendMessage);
router.get('/:id/messages', authenticate, chatController.getMessages);
router.post('/groups', authenticate, validate(createGroupSchema), chatController.createGroup);
router.post('/groups/:id/messages', authenticate, validate(sendMessageSchema), chatController.sendGroupMessage);

export default router;
