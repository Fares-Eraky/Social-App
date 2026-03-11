import { Router } from 'express';
import { CommentController } from './comment.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createCommentSchema } from './comment.validation';

const router = Router({ mergeParams: true });
const commentController = new CommentController();

router.post('/', authenticate, validate(createCommentSchema), commentController.createComment);
router.get('/', authenticate, commentController.getComments);
router.delete('/:id', authenticate, commentController.deleteComment);

export default router;
