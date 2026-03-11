import { Router } from 'express';
import { PostController } from './post.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createPostSchema } from './post.validation';
import { upload } from '../../middleware/upload.middleware';

const router = Router();
const postController = new PostController();

router.post(
  '/',
  authenticate,
  upload.array('files', 10),
  validate(createPostSchema),
  postController.createPost
);

router.get('/', authenticate, postController.getPosts);
router.get('/:id', authenticate, postController.getPost);
router.post('/:id/like', authenticate, postController.likePost);
router.delete('/:id', authenticate, postController.deletePost);

export default router;
